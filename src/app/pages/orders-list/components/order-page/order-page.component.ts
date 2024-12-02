import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { OrdersService } from '../../service/orders.service';
import { ActivatedRoute } from '@angular/router';
import { AsyncPipe, DatePipe, NgClass } from '@angular/common';
import { BehaviorSubject, Subject, switchMap, takeUntil } from 'rxjs';
import { MaterialModule } from '../../../../material.module';
import { MoleculeStructureComponent } from '../../../../shared/components/molecule-structure/molecule-structure.component';
import { TableLoaderSpinnerComponent } from '../../../../shared/components/table-loader-spinner/table-loader-spinner.component';
import { MatDialog } from '@angular/material/dialog';
import { EditRequestedReagentComponent } from '../edit-requested-reagent/edit-requested-reagent.component';
import { ReagentRequestList } from '../../../reagent-request/reagent-request-page/reagent-request-page.interface';
import { NotificationPopupService } from '../../../../shared/services/notification-popup/notification-popup.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Order } from '../../model/order-model';
import { NoDataComponent } from '../../../../shared/components/no-data/no-data.component';
import { StorageLocationDialogComponent } from '../storage-location-dialog/storage-location-dialog.component';
import { ReagentRequestsDialogComponent } from '../reagent-requests-dialog/reagent-requests-dialog.component';
import { EditOrderComponent } from '../edit-order/edit-order.component';
import { ConfirmDeclineDialogComponent } from '../confirm-decline-dialog/confirm-decline-dialog.component';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-order-page',
  standalone: true,
  imports: [
    AsyncPipe,
    MaterialModule,
    DatePipe,
    MoleculeStructureComponent,
    TableLoaderSpinnerComponent,
    NoDataComponent,
    NgClass,
    TranslateModule,
    CommonModule,
  ],
  templateUrl: './order-page.component.html',
  styleUrl: './order-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderPageComponent implements OnInit, OnDestroy {
  private orderService = inject(OrdersService);
  private activatedRoutes = inject(ActivatedRoute);
  private dialog = inject(MatDialog);
  private notificationPopupService = inject(NotificationPopupService);
  private destroy$ = new Subject<void>();
  private translate = inject(TranslateService);

  private orderSubject = new BehaviorSubject<Order | null>(null);
  order$ = this.orderSubject.asObservable();

  excludeReagents: { id: number }[] = [];

  baseColumns = [
    'name',
    'structureSmiles',
    'casNumber',
    'desiredQuantity',
    'package',
    'status',
    'userComments',
  ];
  actionColumn = 'actions';

  get displayedColumns(): string[] {
    const order = this.orderSubject.getValue();
    if (order?.status === 'Pending' || order?.status === 'Fulfilled') {
      return [...this.baseColumns, this.actionColumn];
    }
    return this.baseColumns.filter((column) => column !== this.actionColumn);
  }

  ngOnInit(): void {
    this.fetchOrder();
  }

  fetchOrder(): void {
    this.activatedRoutes.paramMap
      .pipe(
        takeUntil(this.destroy$),
        switchMap((params) =>
          this.orderService.getReagentById(Number(params.get('id')))
        )
      )
      .subscribe((order) => this.orderSubject.next(order));
  }

  onOpen(ReagentRequest: ReagentRequestList) {
    const dialogRef = this.dialog.open(EditRequestedReagentComponent, {
      data: ReagentRequest,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.fetchOrder();
      }
    });
  }

  editOrder(order: Order) {
    const dialogRef = this.dialog.open(EditOrderComponent, {
      data: order.id,
      minWidth: 'fit-content',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.fetchOrder();
      }
    });
  }
  orderStatusChange(orderId: number, status: string) {
    this.orderService
      .updateOrder(orderId, { status })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.notificationPopupService.success({
            title: 'Status Updated',
            message: `Order status changed to ${status} successfully.`,
            duration: 3000,
          });
          this.fetchOrder();
        },
        error: () => {
          this.notificationPopupService.error({
            title: 'Update Failed',
            message: 'Failed to update order status.',
            duration: 3000,
          });
        },
      });
  }
  onCompleted(id: number) {
    const dialog = this.dialog.open(StorageLocationDialogComponent, {
      data: id,
      minWidth: '600px',
    });
    dialog.afterClosed().subscribe((result) => {
      if (result) {
        this.fetchOrder();
      }
    });
  }
  onRemove(orderId: number, reagent: ReagentRequestList) {
    const order = this.orderSubject.getValue();

    if (order && order.reagents.length === 1) {
      const dialogRef = this.dialog.open(ConfirmDeclineDialogComponent, {
        data: { orderId, reagentId: reagent.id },
      });

      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          this.fetchOrder();
        }
      });
    } else {
      this.excludeReagents.push({ id: reagent.id });

      this.orderService
        .updateOrder(orderId, { excludeReagents: this.excludeReagents })
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.excludeReagents = [];
            this.notificationPopupService.success({
              title: 'Success',
              message: 'Reagent has been successfully removed!',
              duration: 3000,
            });
            this.fetchOrder();
          },
          error: (error: HttpErrorResponse) => {
            this.notificationPopupService.error({
              title: 'Error',
              message: error.error.message,
            });
          },
        });
    }
  }

  onAdd(id: number) {
    const dialog = this.dialog.open(ReagentRequestsDialogComponent, {
      data: id,
      minWidth: '700px',
    });
    dialog.afterClosed().subscribe((result) => {
      if (result) {
        this.fetchOrder();
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
