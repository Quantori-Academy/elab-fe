import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
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
  map,
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
import { NoDataComponent } from '../../../../shared/components/no-data/no-data.component';
import { HttpErrorResponse } from '@angular/common/http';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { CreateReagentRequestComponent } from '../../../reagent-request/create-reagent-request/create-reagent-request.component';

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
    NoDataComponent,
    TranslateModule,
  ],
  templateUrl: './order-form.component.html',
  styleUrl: './order-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderFormComponent implements OnInit, OnDestroy {
  private notificationPopupService = inject(NotificationPopupService);
  private fb = inject(FormBuilder);
  private cdr = inject(ChangeDetectorRef);
  private ordersService = inject(OrdersService);
  private reagentRequestService = inject(ReagentRequestService);
  private dialog = inject(MatDialog);
  private router = inject(Router);
  private translate = inject(TranslateService);
  private destroy$ = new Subject<void>();
  public isLoading = computed(() => this.reagentRequestService.isLoading());
  private paramsSubject = new BehaviorSubject<{ filter?: string; sort?: Sort }>(
    {}
  );
  sellerOptions$ = new BehaviorSubject<string[]>([]);
  selectedReagents = new Map<number, { id: number; packageAmount: number }>();
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
          : 'desc',
        'desc',
        undefined,
        undefined,
        params.filter
      )
    ),
    map((response) => {
      const filteredRequests = response.requests.filter(
        (request) => !request.inOrder
      );
      return { ...response, requests: filteredRequests };
    })
  );

  updateParams(params: { filter?: string; sort?: Sort }) {
    this.paramsSubject.next({ ...this.paramsSubject.value, ...params });
  }

  displayedColumns: string[] = [
    'select',
    'name',
    'desiredQuantity',
    'package',
    'amount',
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

  openAddReagentDialog() {
    const dialogRef = this.dialog.open(CreateReagentRequestComponent, {
      minWidth: '500px',
      maxHeight: '500px',
    });

    dialogRef.afterClosed().subscribe((reagentRequest: ReagentRequestList) => {
      if (reagentRequest) {
        this.selectedReagents.set(reagentRequest.id, {
          id: reagentRequest.id,
          packageAmount: 1,
        });
        this.selectedReagentReq.push(reagentRequest);
        this.updateOrdersFormControl();
        this.cdr.markForCheck();
      }
    });
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
        (reagent) => reagent.id !== element.id
      );
    } else {
      this.selectedReagents.set(element.id, {
        id: element.id,
        packageAmount: 1,
      });
      this.selectedReagentReq.push(element);
    }
    this.updateOrdersFormControl();
  }

  onPackageAmountChange(id: number, event: Event): void {
    const amount = +(event.target as HTMLInputElement).value || 1;
    if (this.selectedReagents.has(id)) {
      this.selectedReagents.set(id, { id, packageAmount: amount });
      this.updateOrdersFormControl();
    }
  }

  updateOrdersFormControl() {
    const selectedReagentArray = Array.from(this.selectedReagents.values());
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
            title: this.translate.instant('ORDER_FORM.SUCCESS_TITLE'),
            message: this.translate.instant('ORDER_FORM.SUCCESS_MESSAGE'),
            duration: 3000,
          });
          this.redirectToReagentList();
        },
        error: (error: HttpErrorResponse) => {
          this.notificationPopupService.error({
            title: this.translate.instant('ORDER_FORM.ERROR_TITLE'),
            message: `${this.translate.instant('ORDER_FORM.ERROR_MESSAGE')}: ${
              error.error.message
            }`,
            duration: 15000,
          });
        },
      });
    } else if (this.selectedReagents.size === 0) {
      this.reagentsSelectionError = true;
      this.orderForm.markAllAsTouched();
    }
  }

  redirectToReagentList() {
    return this.router.navigate(['orders']);
  }

  removeReagent(reagent: ReagentRequestList) {
    this.selectedReagents.delete(reagent.id);
    this.selectedReagentReq = this.selectedReagentReq.filter(
      (selectedReagent) => selectedReagent.id !== reagent.id
    );
    this.updateOrdersFormControl();
    this.cdr.markForCheck();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
