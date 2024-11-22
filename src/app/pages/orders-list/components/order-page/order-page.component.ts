import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { OrdersService } from '../../service/orders.service';
import { ActivatedRoute } from '@angular/router';
import { AsyncPipe, CommonModule, DatePipe } from '@angular/common';
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
import { StorageLocationDialogComponent } from '../storage-location-dialog/storage-location-dialog.component';

@Component({
  selector: 'app-order-page',
  standalone: true,
  imports: [
    AsyncPipe,
    MaterialModule,
    DatePipe,
    MoleculeStructureComponent,
    TableLoaderSpinnerComponent,
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

  private orderSubject = new BehaviorSubject<Order | null>(null);
  order$ = this.orderSubject.asObservable();

  excludeReagents: { id: number }[] = [];

  displayedColumns = [
    'name',
    'structureSmiles',
    'casNumber',
    'desiredQuantity',
    'package',
    'status',
    'userComments',
    'actions',
  ];

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
      width: '400px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.fetchOrder();
      }
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

  onRemove(OrderId: number, reagent: ReagentRequestList) {
    this.excludeReagents.push({ id: reagent.id });

    this.orderService
      .updateOrder(OrderId, { excludeReagents: this.excludeReagents })
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

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
