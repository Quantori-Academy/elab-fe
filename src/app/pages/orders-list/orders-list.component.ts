import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
} from '@angular/core';
import { MaterialModule } from '../../material.module';
import { AsyncPipe, DatePipe } from '@angular/common';
import { Order, OrderQuery, Status } from './model/order-model';
import { OrderService } from './service/order.service';
import { Sort } from '@angular/material/sort';
import { PageEvent } from '@angular/material/paginator';
import { OrderFormComponent } from './components/order-form/order-form.component';
import { MatDialog } from '@angular/material/dialog';
import { Router, RouterLink } from '@angular/router';
import { SpinnerDirective } from '../../shared/directives/spinner/spinner.directive';
import { TableLoaderSpinnerComponent } from '../../shared/components/table-loader-spinner/table-loader-spinner.component';

@Component({
  selector: 'app-orders-list',
  standalone: true,
  imports: [MaterialModule, DatePipe, AsyncPipe, RouterLink, SpinnerDirective, TableLoaderSpinnerComponent],
  templateUrl: './orders-list.component.html',
  styleUrls: ['./orders-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrdersListComponent implements OnInit {
  private ordersService = inject(OrderService);
  private dialog = inject(MatDialog);
  private router = inject(Router);
  public isLoading = computed(() => this.ordersService.isLoading());

  ordersList$ = this.ordersService.getOrders();
  length$ = this.ordersService.totalOrders$;

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

  ngOnInit(): void {
    this.ordersService.updateQueryParams({ skip: 0, take: this.pageSize });
  }

  onSort(sort: Sort) {
    const sortParams: Partial<OrderQuery> = {
      sortBySeller: sort.active === 'seller' ? sort.direction : '',
      sortByCreationDate: sort.active === 'creation date' ? sort.direction : '',
      sortByTitle: sort.active === 'order title' ? sort.direction : '',
    };

    this.ordersService.updateQueryParams({ ...sortParams, skip: 0 });
  }

  onFilterByTitle(event: Event) {
    const target = event.target as HTMLInputElement;
    this.ordersService.updateQueryParams({ orderTitle: target.value, skip: 0 });
  }

  onFilterBySeller(event: Event) {
    const target = event.target as HTMLInputElement;
    this.ordersService.updateQueryParams({
      orderSeller: target.value,
      skip: 0,
    });
  }

  onFilterByStatus(status: Status | '') {
    this.ordersService.updateQueryParams({ orderStatus: status, skip: 0 });
  }

  handlePageEvent(event: PageEvent) {
    const { pageIndex, pageSize } = event;
    this.ordersService.updateQueryParams({
      skip: pageIndex * pageSize,
      take: pageSize,
    });
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
        this.ordersService.updateQueryParams({ skip: 0 });
      },
    });
  }
}
