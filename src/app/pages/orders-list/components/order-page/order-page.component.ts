import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { OrdersService } from '../../service/orders.service';
import { ActivatedRoute } from '@angular/router';
import { AsyncPipe, DatePipe } from '@angular/common';
import { switchMap } from 'rxjs';
import { MaterialModule } from '../../../../material.module';
import { MoleculeStructureComponent } from '../../../../shared/components/molecule-structure/molecule-structure.component';
import { TableLoaderSpinnerComponent } from '../../../../shared/components/table-loader-spinner/table-loader-spinner.component';
import { MatDialog } from '@angular/material/dialog';
import { EditRequestedReagentComponent } from '../edit-requested-reagent/edit-requested-reagent.component';
import { ReagentRequestList } from '../../../reagent-request/reagent-request-page/reagent-request-page.interface';
import { NotificationPopupService } from '../../../../shared/services/notification-popup/notification-popup.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-order-page',
  standalone: true,
  imports: [
    AsyncPipe,
    MaterialModule,
    DatePipe,
    MoleculeStructureComponent,
    TableLoaderSpinnerComponent,
  ],
  templateUrl: './order-page.component.html',
  styleUrl: './order-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderPageComponent {
  private orderService = inject(OrdersService);
  private activatedRoutes = inject(ActivatedRoute);
  private dialog = inject(MatDialog);
  private notificationPopupService = inject(NotificationPopupService);
  excludeReagents: { id: number }[] = [];
  displayedColumns = [
    'name',
    'casNumber',
    'desiredQuantity',
    'package',
    'structureSmiles',
    'status',
    'userComments',
    'actions',
  ];
  order$ = this.activatedRoutes.paramMap.pipe(
    switchMap((paramMap) => {
      const id = Number(paramMap.get('id'));
      return this.orderService.getReagentById(id);
    })
  );

  onOpen(ReagentRequest: ReagentRequestList) {
    const dialogRef = this.dialog.open(EditRequestedReagentComponent, {
      data: ReagentRequest,
      width: '400px',
    });

    dialogRef.afterClosed().subscribe(() => {
      return this.order$;
    });
  }
  onRemove(reagent: ReagentRequestList) {
    this.excludeReagents.push({ id: reagent.id });

    this.orderService
      .updateOrder(reagent.id, { excludeReagents: this.excludeReagents })
      // .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.excludeReagents = [];
          this.notificationPopupService.success({
            title: 'Success',
            message: 'Reagent has been successfully removed!',
            duration: 3000,
          });
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
