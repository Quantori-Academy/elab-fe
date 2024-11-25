import { inject, Injectable, signal } from '@angular/core';
import { BehaviorSubject, map, Observable, switchMap, tap } from 'rxjs';
import { PageEvent } from '@angular/material/paginator';
import {
  OrderFilter,
  OrderQuery,
  OrderRequest,
  OrdersListData,
  OrdersTableColumns,
  UpdateOrder,
} from '../model/order-model';
import { Order } from '../model/order-model';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Sort } from '@angular/material/sort';

@Injectable({
  providedIn: 'root',
})
export class OrdersService {
  private url = environment.apiUrl;
  private apiUrl = `${this.url}/api/v1/orders`;
  private httpClient = inject(HttpClient);
  private uniqueSellersSubject = new BehaviorSubject<string[]>([]);
  public uniqueSellers$ = this.uniqueSellersSubject.asObservable();

  private querySubject = new BehaviorSubject<OrderQuery>({
    skip: 0,
    take: 0,
    title: '',
    seller: '',
    status: '',
    titleOrder: '',
    sellerOrder: '',
    createdAt: '',
    updatedAt: '',
  });

  public query$ = this.querySubject.asObservable();
  public pagesize = 10;
  public isLoading = signal(false);

  public get currentQueryParams() {
    return this.querySubject.getValue();
  }

  public getOrdersList(): Observable<OrdersListData> {
    return this.query$.pipe(
      switchMap((param) => {
        this.isLoading.set(true);
        let httpParams = new HttpParams()
          .set('skip', param.skip)
          .set('take', param.take || this.pagesize);

        const setParams = (param: keyof OrderQuery, value: string | number) => {
          return value ? httpParams.set(param, value) : httpParams;
        };
        httpParams = setParams('title', param.title);
        httpParams = setParams('seller', param.seller);
        httpParams = setParams('status', param.status);
        httpParams = setParams('titleOrder', param.titleOrder);
        httpParams = setParams('sellerOrder', param.sellerOrder);
        httpParams = setParams('createdAt', param.createdAt);
        httpParams = setParams('updatedAt', param.updatedAt);
        return this.httpClient
          .get<OrdersListData>(`${this.apiUrl}`, { params: httpParams })
          .pipe(
            tap(() => {
              this.isLoading.set(false);
            })
          );
      })
    );
  }

  
  // hardcoded number to fetch all records, because BE is sending already paginated data and not all at the same time, for now i switched to using reagent's producers/sellers, i can switch back to this.

  public getAllUniqueSellers(): Observable<string[]> {
    const httpParams = new HttpParams()
      .set('skip', 0)
      .set('take', 1000);
    return this.httpClient.get<OrdersListData>(`${this.apiUrl}`, { params: httpParams }).pipe(
      map((ordersData: OrdersListData) => {
        const uniqueSellers = Array.from(
          new Set(ordersData.orders.map(order => order.seller))
        );

        this.uniqueSellersSubject.next(uniqueSellers);
        return uniqueSellers;
      })
    );
  }

  public sorting(sorting: Sort): void {
    this.isLoading.set(true);
    const sortingMap = {
      [OrdersTableColumns.title]: {
        titleOrder: sorting.direction,
      },
      [OrdersTableColumns.seller]: {
        sellerOrder: sorting.direction,
      },
      [OrdersTableColumns.createdAt]: {
        createdAt: sorting.direction,
      },
      [OrdersTableColumns.updatedAt]: {
        updatedAt: sorting.direction,
      },
    };

    const resetSortingParams = {
      titleOrder: '',
      sellerOrder: '',
      createdAt: '',
      updatedAt: '',
    };
    if (sorting.active in sortingMap) {
      const updatedParams = {
        ...this.currentQueryParams,
        ...resetSortingParams,
        ...sortingMap[sorting.active as keyof typeof sortingMap],
      };
      this.querySubject.next(updatedParams);
    } else {
      this.querySubject.next({
        ...this.currentQueryParams,
        ...resetSortingParams,
      });
    }
  }

  public filtering(filter: OrderFilter): void {
    this.isLoading.set(true);
    const { value, column } = filter;
    let filterColumn = {};
    switch (column) {
      case OrdersTableColumns.title:
        filterColumn = { title: value };
        break;
      case OrdersTableColumns.seller:
        filterColumn = { seller: value };
        break;
      case OrdersTableColumns.status:
        filterColumn = { status: value };
        break;
    }
    this.querySubject.next({
      ...this.currentQueryParams,
      skip: 0,
      ...filterColumn,
    });
  }

  updateQueryParams(updatedParams: Partial<OrderQuery>) {
    const currentQuery = this.querySubject.value;
    this.querySubject.next({ ...currentQuery, ...updatedParams });
  }

  public setPageData(pageData: PageEvent): void {
    this.isLoading.set(true);
    this.querySubject.next({
      ...this.currentQueryParams,
      skip: pageData.pageIndex * pageData.pageSize,
      take: pageData.pageSize,
    });
  }

  resetQueryParams(): void {
    this.querySubject.next({
      skip: 0,
      take: this.pagesize,
      title: '',
      seller: '',
      status: '',
      titleOrder: '',
      sellerOrder: '',
      createdAt: '',
      updatedAt: '',
    });
  }

  public createOrder(order: OrderRequest): Observable<OrderRequest> {
    return this.httpClient.post<OrderRequest>(this.apiUrl, order);
  }

  public getReagentById(id: number): Observable<Order> {
    return this.httpClient.get<Order>(`${this.apiUrl}/${id}`);
  }

  public updateOrder(id: number, data: UpdateOrder): Observable<Order> {
    return this.httpClient.patch<Order>(`${this.apiUrl}/${id}`, data);
  }
}
