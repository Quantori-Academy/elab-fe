import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { MaterialModule } from '../../material.module';
import { AsyncPipe, DatePipe } from '@angular/common';
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
import { Router, RouterLink } from '@angular/router';
import { SpinnerDirective } from '../../shared/directives/spinner/spinner.directive';
import { TableLoaderSpinnerComponent } from '../../shared/components/table-loader-spinner/table-loader-spinner.component';
import { OrdersService } from './service/orders.service';
import { PAGE_SIZE_OPTIONS } from '../../shared/units/variables.units';
import {
  debounceTime,
  distinctUntilChanged,
  Observable,
  Subject,
  takeUntil,
  tap,
} from 'rxjs';

@Component({
  selector: 'app-orders-list',
  standalone: true,
  imports: [
    MaterialModule,
    DatePipe,
    AsyncPipe,
    RouterLink,
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
  public ordersList$?: Observable<OrdersListData | undefined>;
  public filterSubject = new Subject<OrderFilter>();
  public listLength = 100;
  public pageIndex = 0;
  private dialog = inject(MatDialog);
  private router = inject(Router);
  private destroy$ = new Subject<void>();
  private orderService = inject(OrdersService);
  statusOptions = Object.values(Status);
  public isLoading = computed(() => this.orderService.isLoading());

  constructor() {
    this.ordersList$ = this.orderService.getOrdersList();
    this.pageSize = this.orderService.pagesize;
  }

  displayedColumns: string[] = [
    'title',
    'createdAt',
    'updatedAt',
    'seller',
    'status',
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

  public redirectToDetailPage(order: Order) {
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
