import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  inject,
  OnDestroy,
} from '@angular/core';
import { OrdersService } from '../../service/orders.service';
import { Status } from '../../model/order-model';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Subject, takeUntil, BehaviorSubject } from 'rxjs';
import { MaterialModule } from '../../../../material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { NotificationPopupService } from '../../../../shared/services/notification-popup/notification-popup.service';
import { ReagentRequestList } from '../../../reagent-request/reagent-request-page/reagent-request-page.interface';

@Component({
  selector: 'app-edit-order',
  standalone: true,
  imports: [MaterialModule, ReactiveFormsModule],
  templateUrl: './confirm-decline-dialog.component.html',
  styleUrls: ['./confirm-decline-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmDeclineDialogComponent implements OnDestroy {
  private destroy$ = new Subject<void>();
  private orderService = inject(OrdersService);
  private notificationPopupService = inject(NotificationPopupService);

  reagents$ = new BehaviorSubject<ReagentRequestList[]>([]);
  excludeReagents: { id: number }[] = [];
  showRemoveConfirmation = false;
  errorMessage = '';
  lastReagentToRemove: ReagentRequestList | null = null;
  orderId;
  constructor(
    @Inject(MAT_DIALOG_DATA)
    private data: { orderId: number; reagentId: number },
    private dialogRef: MatDialogRef<ConfirmDeclineDialogComponent>
  ) {
    this.orderId = data.orderId;
  }
  confirmRemoval() {
    const reagentId = this.data.reagentId;
    this.excludeReagents.push({ id: reagentId });

    this.orderService
      .updateOrder(this.orderId, { excludeReagents: this.excludeReagents })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.orderService
            .updateOrder(this.orderId, {
              status: Status.submitted,
            })
            .pipe(takeUntil(this.destroy$))
            .subscribe();
          this.orderService
            .updateOrder(this.orderId, { status: Status.declined })
            .pipe(takeUntil(this.destroy$))
            .subscribe({
              next: () => {
                this.dialogRef.close(true);
                this.notificationPopupService.success({
                  title: 'Success',
                  message: 'Order Declined successfully!',
                  duration: 3000,
                });
              },
              error: (err) => this.notificationPopupService.error(err),
            });
        },
        error: (err) => this.notificationPopupService.error(err),
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
