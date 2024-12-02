import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { MaterialModule } from '../../material.module';
import { AsyncPipe, CommonModule, DatePipe } from '@angular/common';
import {
  Order,
  OrderFilter,
  OrdersListData,
  OrdersTableColumns,
  Status,
} from './model/order-model';
import { Sort } from '@angular/material/sort';
import { PageEvent } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { SpinnerDirective } from '../../shared/directives/spinner/spinner.directive';
import { TableLoaderSpinnerComponent } from '../../shared/components/table-loader-spinner/table-loader-spinner.component';
import { OrdersService } from './service/orders.service';
import { PAGE_SIZE_OPTIONS } from '../../shared/units/variables.units';
import {
  BehaviorSubject,
  debounceTime,
  distinctUntilChanged,
  Subject,
  takeUntil,
  tap,
} from 'rxjs';
import { EditOrderComponent } from './components/edit-order/edit-order.component';
import { ChangeDetectorRef } from '@angular/core';
import { NoDataComponent } from '../../shared/components/no-data/no-data.component';
import { NotificationPopupService } from '../../shared/services/notification-popup/notification-popup.service';
import { TranslateService, TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-orders-list',
  standalone: true,
  imports: [
    MaterialModule,
    CommonModule,
    DatePipe,
    AsyncPipe,
    SpinnerDirective,
    TableLoaderSpinnerComponent,
    NoDataComponent,
    TranslateModule,
  ],
  templateUrl: './orders-list.component.html',
  styleUrls: ['./orders-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrdersListComponent implements OnInit, OnDestroy {
  private readonly DEBOUNCE_TIME = 1000;
  public pageSize: number;
  public pageSizeOptions = inject(PAGE_SIZE_OPTIONS);
  private notificationPopupService = inject(NotificationPopupService);
  private ordersListSubject = new BehaviorSubject<OrdersListData | undefined>(
    undefined
  );
  ordersList$ = this.ordersListSubject.asObservable();
  public filterSubject = new Subject<OrderFilter>();
  public listLength = 100;
  public pageIndex = 0;
  private dialog = inject(MatDialog);
  private router = inject(Router);
  private destroy$ = new Subject<void>();
  private orderService = inject(OrdersService);
  statusOptions = Object.values(Status);
  private cdr = inject(ChangeDetectorRef);
  public isLoading = computed(() => this.orderService.isLoading());
  private translate = inject(TranslateService);

  constructor() {
    this.ordersList$ = this.orderService.getOrdersList();
    this.pageSize = this.orderService.pagesize;
  }

  // getStatusTranslation(elementStatus: string): string {
  //   const key = 'ORDERS_LIST.STATUS.' + elementStatus.toUpperCase();
  //   return this.translate.instant(key);
  // }

  displayedColumns: string[] = [
    'title',
    'seller',
    'status',
    'createdAt',
    'updatedAt',
    'actions',
  ];

  ngOnInit(): void {
    this.filterOrder();
  }

  filterOrder() {
    this.filterSubject
      .pipe(
        tap(() => this.orderService.isLoading.set(true)),
        debounceTime(this.DEBOUNCE_TIME),
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      )
      .subscribe((filteredData) => {
        this.orderService.filtering(filteredData);
      });
  }

  onSort(sort: Sort) {
    this.orderService.sorting(sort);
  }

  onFilterByTitle($event: Event) {
    const value = ($event.target as HTMLInputElement).value;
    this.filterSubject.next({ value, column: OrdersTableColumns.title });
  }

  onFilterBySeller($event: Event) {
    const value = ($event.target as HTMLInputElement).value;
    this.filterSubject.next({ value, column: OrdersTableColumns.seller });
  }

  onFilterByStatus(status: Status | '') {
    this.filterSubject.next({
      value: status,
      column: OrdersTableColumns.status,
    });
  }

  onCreate() {
    this.router.navigate(['orders/create-order']);
  }

  openEditor(order: Order) {
    const dialogRef = this.dialog.open(EditOrderComponent, {
      data: order.id,
      minWidth: 'fit-content',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.ordersList$ = this.orderService.getOrdersList();
        this.cdr.markForCheck();
      }
    });
  }
  orderStatusChange(orderId: number, status: string) {
    this.orderService
      .updateOrder(orderId, { status })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.cdr.markForCheck();
          this.notificationPopupService.success({
            title: 'Status Updated',
            message: `Order status changed to ${status} successfully.`,
            duration: 3000,
          });

          this.ordersList$ = this.orderService.getOrdersList();
        },
        error: (err) => {
          this.notificationPopupService.error({
            title: 'Update Failed',
            message: err.message || 'Failed to update order status.',
            duration: 3000,
          });
        },
      });
  }

  redirectToDetailPage(order: Order) {
    this.router.navigate(['/orders', order.id], {});
  }
  handlePageEvent($event: PageEvent) {
    this.orderService.setPageData($event);
  }

  showIconAttention(element: Order): boolean {
    return (
      element.status === Status.fulfilled &&
      element.reagents.some((reagent) => reagent.status !== 'Completed')
    );
  }

  ngOnDestroy(): void {
    this.orderService.resetQueryParams();
    this.destroy$.next();
    this.destroy$.complete();
  }
}
