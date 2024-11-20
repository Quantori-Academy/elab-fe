import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { MaterialModule } from '../../../../material.module';
import { OrderRequest } from '../../model/order-model';
import { NotificationPopupService } from '../../../../shared/services/notification-popup/notification-popup.service';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';

import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { ReagentRequestService } from '../../../reagent-request/reagent-request-page/reagent-request-page.service';
import { BehaviorSubject, Subject } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  switchMap,
  takeUntil,
} from 'rxjs/operators';
import { AsyncPipe, DatePipe } from '@angular/common';
import { OrdersService } from '../../service/orders.service';
import { Router } from '@angular/router';
import { ReagentPageComponent } from '../../../reagents-list/components/reagent-page/reagent-page.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { TableLoaderSpinnerComponent } from '../../../../shared/components/table-loader-spinner/table-loader-spinner.component';
import { Sort } from '@angular/material/sort';
import { SpinnerDirective } from '../../../../shared/directives/spinner/spinner.directive';
import { ReagentRequestList } from '../../../reagent-request/reagent-request-page/reagent-request-page.interface';
import { MoleculeStructureComponent } from '../../../../shared/components/molecule-structure/molecule-structure.component';

@Component({
  selector: 'app-order-form',
  standalone: true,
  imports: [
    MaterialModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    AsyncPipe,
    DatePipe,
    MatCheckboxModule,
    SpinnerDirective,
    TableLoaderSpinnerComponent,
    MoleculeStructureComponent,
  ],
  templateUrl: './order-form.component.html',
  styleUrl: './order-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderFormComponent implements OnInit, OnDestroy {
  private notificationPopupService = inject(NotificationPopupService);
  private fb = inject(FormBuilder);
  private ordersService = inject(OrdersService);
  private reagentRequestService = inject(ReagentRequestService);
  private dialog = inject(MatDialog);
  private router = inject(Router);
  private destroy$ = new Subject<void>();
  public isLoading = computed(() => this.reagentRequestService.isLoading());
  private paramsSubject = new BehaviorSubject<{ filter?: string; sort?: Sort }>(
    {}
  );
  sellerOptions$ = new BehaviorSubject<string[]>([]);
  selectedReagents = new Set<number>();
  reagentsSelectionError = false;
  selectedReagentReq: ReagentRequestList[] = [];

  dataSource$ = this.paramsSubject.pipe(
    debounceTime(500),
    distinctUntilChanged(),
    switchMap((params) =>
      this.reagentRequestService.getReagentRequests(
        'Pending',
        undefined,
        params.sort?.active === 'createdAt' && params.sort.direction
          ? params.sort.direction
          : undefined,
        undefined,
        undefined,
        undefined,
        params.filter
      )
    )
  );

  updateParams(params: { filter?: string; sort?: Sort }) {
    this.paramsSubject.next({ ...this.paramsSubject.value, ...params });
  }

  displayedColumns: string[] = [
    'select',
    'name',
    'desiredQuantity',
    'package',
    'createdAt',
    'userComments',
    'actions',
  ];

  orderForm: FormGroup = this.fb.group({
    title: ['', [Validators.required, Validators.maxLength(200)]],
    seller: ['', Validators.required],
    reagents: [[], Validators.required],
  });

  ngOnInit(): void {
    this.ordersService
      .getAllUniqueSellers()
      .pipe(takeUntil(this.destroy$))
      .subscribe((sellers) => this.sellerOptions$.next(sellers));
  }

  onFilterName(event: Event) {
    const value = (event.target as HTMLInputElement).value.trim();
    this.updateParams({ filter: value || undefined });
  }

  onSort(sort: Sort): void {
    this.updateParams({ sort });
  }

  openReagentDialog(id: string): void {
    this.dialog.open(ReagentPageComponent, {
      width: '600px',
      data: { id },
    });
  }

  onCheckboxChange(element: ReagentRequestList): void {
    if (this.selectedReagents.has(element.id)) {
      this.selectedReagents.delete(element.id);
      this.selectedReagentReq = this.selectedReagentReq.filter(
        (name) => name !== element
      );
    } else {
      this.selectedReagents.add(element.id);
      this.selectedReagentReq.push(element);
    }
    this.updateOrdersFormControl();
  }

  updateOrdersFormControl() {
    const selectedReagentArray = Array.from(this.selectedReagents).map(
      (id) => ({ id })
    );
    this.orderForm.patchValue({ reagents: selectedReagentArray });
    this.reagentsSelectionError = this.selectedReagents.size === 0;
  }

  onSubmit() {
    if (this.orderForm.valid && this.selectedReagents.size > 0) {
      this.reagentsSelectionError = false;

      const orderData: OrderRequest = this.orderForm.value;
      this.ordersService.createOrder(orderData).subscribe({
        next: () => {
          this.notificationPopupService.success({
            title: 'Success',
            message: 'Order created successfully!',
            duration: 3000,
          });
          this.redirectToReagentList();
        },
        error: (err) => this.notificationPopupService.error(err),
      });
    } else if (this.selectedReagents.size === 0) {
      this.reagentsSelectionError = true;
      this.orderForm.markAllAsTouched();
    }
  }

  redirectToReagentList() {
    return this.router.navigate(['orders']);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
