import { inject, Injectable } from '@angular/core';
import { mockOrders } from '../../../../../MockData';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { PageEvent } from '@angular/material/paginator';
import { Order, OrderQuery } from '../model/order-model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private url = environment.apiUrl;

  private apiUrl = `${this.url}/orders`;
  private httpClient = inject(HttpClient);
  private totalOrdersSubject = new BehaviorSubject<number>(mockOrders.length);
  public totalOrders$ = this.totalOrdersSubject.asObservable();

  private httpParamsSubject = new BehaviorSubject<OrderQuery>({
    skip: 0,
    take: 0,
    sortBySeller: '',
    sortByCreationDate: '',
    sortByTitle: '',
    orderTitle: '',
    orderSeller: '',
    orderStatus: '',
  });
  public httpParams$ = this.httpParamsSubject.asObservable();

  public get currentHttpParams() {
    return this.httpParamsSubject.getValue();
  }

  public getOrders(
    params: OrderQuery // : Observable<Order[]>
  ) {

    const filteredOrders = mockOrders.filter((order) => {
      const matchesTitle = params.orderTitle
        ? order.title.toLowerCase() === params.orderTitle.toLowerCase()
        : true;
      const matchesSeller = params.orderSeller
        ? order.seller.toLowerCase() === params.orderSeller.toLowerCase()
        : true;
      const matchesStatus = params.orderStatus
        ? order.status === params.orderStatus
        : true;
      return matchesTitle && matchesSeller && matchesStatus;
    });

    // Sort based on the selected sort option
    if (params.sortBySeller) {
      filteredOrders.sort((a, b) => {
        return params.sortBySeller === 'asc'
          ? a.seller.localeCompare(b.seller)
          : b.seller.localeCompare(a.seller);
      });
    } else if (params.sortByCreationDate) {
      filteredOrders.sort((a, b) => {
        return params.sortByCreationDate === 'asc'
          ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
    } else if (params.sortByTitle) {
      filteredOrders.sort((a, b) => {
        return params.sortByTitle === 'asc'
          ? a.title.localeCompare(b.title)
          : b.title.localeCompare(a.title);
      });
    }

    // Update total orders count for pagination
    this.totalOrdersSubject.next(filteredOrders.length);

    // Apply pagination to the sorted and filtered data
    const paginatedOrders = filteredOrders.slice(
      params.skip ?? 0,
      (params.skip ?? 0) + (params.take ?? 10)
    );
    return of(paginatedOrders);
    // uncomment this apter api is done
    // } else {
    //   return this.httpClient.get<Order[]>(this.apiUrl, {
    //     params: {
    //       skip: params.skip ?? 0,
    //       take: params.take ?? 25,
    //       sortBySeller: params.sortBySeller ?? '',
    //       sortByCreationDate: params.sortByCreationDate ?? '',
    //       sortByTitle: params.sortByTitle ?? '',
    //       orderTitle: params.orderTitle ?? '',
    //       orderSeller: params.orderSeller ?? '',
    //       orderStatus: params.orderStatus ?? '',
    //     },
    //   });
  }
  public getOrderFromMockDataById(id: number): Observable<Order | null> {
    const order = mockOrders.find((order) => order.id === id);
    return of(order || null);
  }
  public deleteOrderFromMockDataById(id: number): Observable<Order | null> {
    const index = mockOrders.findIndex((order: Order) => order.id === id);

    if (index !== -1) {
      const [deletedOrder] = mockOrders.splice(index, 1); 
      return of(deletedOrder);
    } else {
      return of(null);
    }
  }

  public getOrderById(id: number): Observable<Order> {
    return this.httpClient.get<Order>(`${this.apiUrl}/${id}`);
  }

  // for delete api
  public deleteOrderById(id: number): void {
    this.httpClient.delete(`${this.apiUrl}/${id}`);
  }
  // for post api
  public createOrder(order: Order): Observable<Order> {
    return this.httpClient.post<Order>(`${this.apiUrl}`, { order });
  }

  public setPageData(pageData: PageEvent): void {
    this.httpParamsSubject.next({
      ...this.currentHttpParams,
      skip: pageData.pageIndex * pageData.pageSize,
      take: pageData.pageSize,
    });
  }

}
