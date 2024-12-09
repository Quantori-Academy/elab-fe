import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { OrdersService } from '../../service/orders.service';
import { Order, Status, UpdateOrder } from '../../model/order-model';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BehaviorSubject, Subject, takeUntil } from 'rxjs';
import { MaterialModule } from '../../../../material.module';
import {
  FormBuilder,
  FormControl,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NotificationPopupService } from '../../../../shared/services/notification-popup/notification-popup.service';
import { ReagentRequestList } from '../../../reagent-request/reagent-request-page/reagent-request-page.interface';
import { AsyncPipe } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-edit-order',
  standalone: true,
  imports: [MaterialModule, ReactiveFormsModule, AsyncPipe, TranslateModule],
  templateUrl: './edit-order.component.html',
  styleUrls: ['./edit-order.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditOrderComponent implements OnInit, OnDestroy {
  private fb = inject(FormBuilder);
  private destroy$ = new Subject<void>();
  private orderService = inject(OrdersService);
  private notificationPopupService = inject(NotificationPopupService);
  private translate = inject(TranslateService);
  statusOptions: Status[] = [
    Status.pending,
    Status.submitted,
    Status.fulfilled,
    Status.declined,
  ];

  initialValues: Partial<Order> = {};
  //initial values of order
  sellerOptions$ = new BehaviorSubject<string[]>([]);
  lastReagentToRemove: ReagentRequestList | null = null;
  updateForm = this.fb.group({
    title: ['', Validators.required],
    seller: ['', Validators.required],
  });

  constructor(
    @Inject(MAT_DIALOG_DATA) private orderId: number,
    private dialogRef: MatDialogRef<EditOrderComponent>
  ) {}

  ngOnInit() {
    this.orderService
      .getReagentById(this.orderId)
      .pipe(takeUntil(this.destroy$))
      .subscribe((order: Order) => {
        this.initialValues = {
          title: order.title,
          seller: order.seller,
        };
        this.updateForm.patchValue(this.initialValues);
        this.updateForm.markAsPristine();
      });
    this.orderService
      .getAllUniqueSellers()
      .pipe(takeUntil(this.destroy$))
      .subscribe((sellers) => this.sellerOptions$.next(sellers));
  }

  onSubmit() {
    const modifiedValues: Partial<UpdateOrder> = {};

    //to compare current form values to initial values and collect changes
    Object.keys(this.updateForm.controls).forEach((key) => {
      const control = this.updateForm.get(
        key as keyof typeof this.updateForm.controls
      ) as FormControl;
      const initialValue = this.initialValues[key as keyof Order];

      //  add to modifiedValues if current value is different from initial value,
      if (control.value !== initialValue) {
        modifiedValues[key as keyof UpdateOrder] = control.value;
      }
    });
    this.orderService
      .updateOrder(this.orderId, modifiedValues as UpdateOrder)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.dialogRef.close(true);
          this.notificationPopupService.success({
            title: this.translate.instant('EDIT_ORDER.SUCCESS_TITLE'),
            message: this.translate.instant('EDIT_ORDER.SUCCESS_MESSAGE'),
            duration: 3000,
          });
        },
        error: (err) =>
          this.notificationPopupService.error({
            title: this.translate.instant('EDIT_ORDER.ERROR_TITLE'),
            message: err.message,
            duration: 3000,
          }),
      });
  }

  public hasError(label: string, error: string): boolean | undefined {
    return this.updateForm.get(label)?.hasError(error);
  }

  onClose() {
    this.dialogRef.close();
    this.updateForm.reset();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  get translatedStatus(): string {
    const status = this.updateForm.get('status')?.value;
    return status
      ? this.translate.instant('ORDERS_LIST.STATUS.' + status.toUpperCase())
      : '';
  }
}
