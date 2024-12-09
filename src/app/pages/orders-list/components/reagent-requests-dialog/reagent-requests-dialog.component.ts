import { Component, computed, Inject, inject } from '@angular/core';
import { MaterialModule } from '../../../../material.module';
import { AsyncPipe, DatePipe } from '@angular/common';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { SpinnerDirective } from '../../../../shared/directives/spinner/spinner.directive';
import { TableLoaderSpinnerComponent } from '../../../../shared/components/table-loader-spinner/table-loader-spinner.component';
import {
  BehaviorSubject,
  debounceTime,
  distinctUntilChanged,
  map,
  switchMap,
} from 'rxjs';
import { ReagentRequestService } from '../../../reagent-request/reagent-request-page/reagent-request-page.service';
import { Sort } from '@angular/material/sort';
import { ReagentRequestList } from '../../../reagent-request/reagent-request-page/reagent-request-page.interface';
import { OrdersService } from '../../service/orders.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NotificationPopupService } from '../../../../shared/services/notification-popup/notification-popup.service';
import { HttpErrorResponse } from '@angular/common/http';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-reagent-requests-dialog',
  standalone: true,
  imports: [
    MaterialModule,
    AsyncPipe,
    DatePipe,
    MatCheckboxModule,
    SpinnerDirective,
    TableLoaderSpinnerComponent,
    TranslateModule,
  ],
  templateUrl: './reagent-requests-dialog.component.html',
  styleUrls: ['./reagent-requests-dialog.component.scss'],
})
export class ReagentRequestsDialogComponent {
  private reagentRequestService = inject(ReagentRequestService);
  private notificationPopupService = inject(NotificationPopupService);
  private orderService = inject(OrdersService);
  private translate = inject(TranslateService);

  public isLoading = computed(() => this.reagentRequestService.isLoading());
  private paramsSubject = new BehaviorSubject<{ filter?: string; sort?: Sort }>(
    {}
  );

  constructor(
    @Inject(MAT_DIALOG_DATA) private id: number,
    private dialogRef: MatDialogRef<ReagentRequestsDialogComponent>
  ) {}

  selectedReagents = new Set<number>();
  includedReagents: { id: number }[] = [];

  displayedColumns: string[] = [
    'select',
    'name',
    'desiredQuantity',
    'package',
    'createdAt',
    'userComments',
  ];

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
    ),
    map((response) => {
      // Filter out items where inOrder is true
      const filteredRequests = response.requests.filter(
        (request) => !request.inOrder
      );
      return { ...response, requests: filteredRequests };
    })
  );

  updateParams(params: { filter?: string; sort?: Sort }) {
    this.paramsSubject.next({ ...this.paramsSubject.value, ...params });
  }

  onFilterName(event: Event) {
    const value = (event.target as HTMLInputElement).value.trim();
    this.updateParams({ filter: value || undefined });
  }

  onSort(sort: Sort): void {
    this.updateParams({ sort });
  }

  onCheckboxChange(element: ReagentRequestList): void {
    if (this.selectedReagents.has(element.id)) {
      this.selectedReagents.delete(element.id);
    } else {
      this.selectedReagents.add(element.id);
    }
    this.updateOrdersFormControl();
  }

  updateOrdersFormControl() {
    this.includedReagents = Array.from(this.selectedReagents).map((id) => ({
      id,
    }));
  }

  add() {
    this.orderService
      .updateOrder(this.id, { includeReagents: this.includedReagents })
      .subscribe({
        next: () => {
          this.includedReagents = [];
          this.notificationPopupService.success({
            title: this.translate.instant(
              'REAGENT_REQUESTS_DIALOG.SUCCESS_TITLE'
            ),
            message: this.translate.instant(
              'REAGENT_REQUESTS_DIALOG.SUCCESS_MESSAGE'
            ),
            duration: 3000,
          });
          this.dialogRef.close(true);
        },
        error: (error: HttpErrorResponse) => {
          this.notificationPopupService.error({
            title: this.translate.instant(
              'REAGENT_REQUESTS_DIALOG.ERROR_TITLE'
            ),
            message: error.error.message,
          });
        },
      });
  }
}
