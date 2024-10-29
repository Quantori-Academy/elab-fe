import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { MaterialModule } from '../../material.module';
import { AsyncPipe, DatePipe } from '@angular/common';
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { debounceTime, switchMap } from 'rxjs/operators';
import { Order, OrderQuery, Status } from './model/order-model';
import { OrderService } from './service/order.service';
import { Sort, SortDirection } from '@angular/material/sort';
import { PageEvent } from '@angular/material/paginator';
import { OrderFormComponent } from './components/order-form/order-form.component';
import { MatDialog } from '@angular/material/dialog';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-orders-list',
  standalone: true,
  imports: [MaterialModule, DatePipe, AsyncPipe, RouterLink],
  templateUrl: './orders-list.component.html',
  styleUrls: ['./orders-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrdersListComponent implements OnInit {
  private ordersService = inject(OrderService);
  private dialog = inject(MatDialog);
  private router = inject(Router);
  private cdRef = inject(ChangeDetectorRef);

  ordersList$ = new BehaviorSubject<Order[]>([]);
  length$: Observable<number> = this.ordersService.totalOrders$;

  displayedColumns: string[] = [
    'order title',
    'creation date',
    'modification date',
    'seller',
    'status',
    'actions',
  ];

  pageSize = 25;
  pageIndex = 0;
  statusOptions = Object.values(Status);

  queryObj: OrderQuery = {
    skip: 0,
    take: this.pageSize,
    sortBySeller: '' as SortDirection,
    sortByCreationDate: '' as SortDirection,
    sortByTitle: '' as SortDirection,
    orderTitle: '',
    orderSeller: '',
    orderStatus: '',
  };

  private titleFilterSubject = new Subject<string>();
  private sellerFilterSubject = new Subject<string>();

  ngOnInit(): void {
    this.ordersService.setPageData({
      pageIndex: this.pageIndex,
      pageSize: this.pageSize,
      length: 0,
    });

    this.fetchOrders();

    // Listen for changes in totalOrders$ to update paginator length dynamically
    this.ordersService.totalOrders$.subscribe((total) => {
      this.length$ = of(total); // Set the observable for pagination length
    });

    // Debounce for title input
    this.titleFilterSubject
      .pipe(
        debounceTime(300),
        switchMap((title) => {
          this.queryObj.orderTitle = title;
          return this.ordersService.getOrders(this.queryObj);
        })
      )
      .subscribe((data) => {
        this.ordersList$.next(data);
        this.cdRef.detectChanges();
      });

    // Debounce for seller input
    this.sellerFilterSubject
      .pipe(
        debounceTime(300),
        switchMap((seller) => {
          this.queryObj.orderSeller = seller;
          return this.ordersService.getOrders(this.queryObj);
        })
      )
      .subscribe((data) => {
        this.ordersList$.next(data);
        this.cdRef.detectChanges();
      });
  }

  fetchOrders() {
    this.ordersService.getOrders(this.queryObj).subscribe((data) => {
      this.ordersList$.next(data);
      this.cdRef.detectChanges();
    });
  }

  onSort(sort: Sort) {
    this.queryObj.sortBySeller = sort.active === 'seller' ? sort.direction : '';
    this.queryObj.sortByCreationDate =
      sort.active === 'creation date' ? sort.direction : '';
    this.queryObj.sortByTitle =
      sort.active === 'order title' ? sort.direction : '';

    // Reset pagination when sorting
    this.pageIndex = 0;
    this.queryObj.skip = 0;
    this.fetchOrders();
  }

  onFilterByTitle(event: Event) {
    const target = event.target as HTMLInputElement | null;

    if (target) {
      this.titleFilterSubject.next(target.value);
    }
  }

  onFilterBySeller(event: Event) {
    const target = event.target as HTMLInputElement | null;

    if (target) {
      this.sellerFilterSubject.next(target.value);
    }
  }

  onFilterByStatus(selectedStatus: Status | '') {
    console.log('Selected status:', selectedStatus);
    this.queryObj.orderStatus = selectedStatus;
    this.fetchOrders();
  }

  handlePageEvent($event: PageEvent) {
    this.ordersService.setPageData($event);
    this.pageSize = $event.pageSize;
    this.pageIndex = $event.pageIndex;

    // Update take based on page size and fetch new orders
    this.queryObj.take = this.pageSize;
    this.queryObj.skip = this.pageIndex * this.pageSize;

    this.fetchOrders();
  }

  onCreate() {
    this.dialog.open(OrderFormComponent);
  }

  public redirectToDetailPage(order: Order) {
    this.router.navigate(['/orders', order.id], {
      queryParams: { data: JSON.stringify(order.id) },
    });
  }

  onDelete(id: number) {
    this.ordersService.deleteOrderFromMockDataById(id).subscribe({
      next: () => {
        console.log('deleted');
      },
    });
    this.fetchOrders();
  }
}
