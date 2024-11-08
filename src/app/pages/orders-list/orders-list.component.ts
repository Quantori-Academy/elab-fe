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
  ],
  templateUrl: './orders-list.component.html',
  styleUrls: ['./orders-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrdersListComponent implements OnInit, OnDestroy {
  private readonly DEBOUNCE_TIME = 1000;
  public pageSize: number;
  public pageSizeOptions = inject(PAGE_SIZE_OPTIONS);
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

  constructor() {
    this.ordersList$ = this.orderService.getOrdersList();
    this.pageSize = this.orderService.pagesize;
  }

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

  redirectToDetailPage(order: Order) {
    this.router.navigate(['/orders', order.id], {});
  }
  handlePageEvent($event: PageEvent) {
    this.orderService.setPageData($event);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
