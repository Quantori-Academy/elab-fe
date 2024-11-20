import {
  ChangeDetectionStrategy,
  Component,
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
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { takeUntil, map } from 'rxjs/operators';
import { AsyncPipe } from '@angular/common';
import { OrdersService } from '../../service/orders.service';
import { ReagentsService } from '../../../../shared/services/reagents.service';
import { Router } from '@angular/router';
import { ReagentPageComponent } from '../../../reagents-list/components/reagent-page/reagent-page.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ReagentRequestList } from '../../../reagent-request/reagent-request-page/reagent-request-page.interface';

@Component({
  selector: 'app-order-form',
  standalone: true,
  imports: [
    MaterialModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    AsyncPipe,
    MatCheckboxModule,
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
  private reagentService = inject(ReagentsService);
  private dialog = inject(MatDialog);
  private router = inject(Router);
  private destroy$ = new Subject<void>();

  dataSource$!: Observable<ReagentRequestList[]>;
  sellerOptions$ = new BehaviorSubject<string[]>([]);
  selectedReagents = new Set<number>();
  reagentsSelectionError = false;
  selectedReagentNames: string[] = [];
  displayedColumns: string[] = [
    'select',
    'name',
    'desiredQuantity',
    'package',
    'userComments',
    'casNumber',
    'actions',
  ];

  orderForm: FormGroup = this.fb.group({
    title: ['', [Validators.required, Validators.maxLength(200)]],
    seller: ['', Validators.required],
    reagents: [[], Validators.required],
  });

  ngOnInit(): void {
    const pageSize = 1000;
    const skip = 0;
    this.dataSource$ = this.reagentRequestService
      .getReagentRequests(
        'Pending',
        undefined,
        undefined,
        undefined,
        skip,
        pageSize,
        undefined
      )
      .pipe(map((response) => response.requests));
    this.ordersService
      .getAllUniqueSellers()
      .pipe(takeUntil(this.destroy$))
      .subscribe((sellers) => this.sellerOptions$.next(sellers));
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
      this.selectedReagentNames = this.selectedReagentNames.filter(
        (name) => name !== element.name
      );
    } else {
      this.selectedReagents.add(element.id);
      this.selectedReagentNames.push(element.name);
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
    } else {
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
