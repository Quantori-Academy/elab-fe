import { inject, Injectable } from '@angular/core';
import { mockOrders } from '../../../../../MockData';
import { BehaviorSubject, Observable, of, switchMap } from 'rxjs';
import { PageEvent } from '@angular/material/paginator';
import { OrderQuery, OrderRequest } from '../model/order-model';
import { Order } from '../model/order-model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private url = environment.apiUrl;
  private apiUrl = `${this.url}/api/v1/orders`;
  private httpClient = inject(HttpClient);

  private totalOrdersSubject = new BehaviorSubject<number>(mockOrders.length);
  public totalOrders$ = this.totalOrdersSubject.asObservable();

  private querySubject = new BehaviorSubject<OrderQuery>({
    skip: 0,
    take: 25,
    sortBySeller: '',
    sortByCreationDate: '',
    sortByTitle: '',
    orderTitle: '',
    orderSeller: '',
    orderStatus: '',
  });
  public query$ = this.querySubject.asObservable();

  updateQueryParams(updatedParams: Partial<OrderQuery>) {
    const currentQuery = this.querySubject.value;
    this.querySubject.next({ ...currentQuery, ...updatedParams });
  }

  getOrders(): Observable<Order[]> {
    return this.query$.pipe(
      switchMap((params) => {
        const filteredOrders = mockOrders.filter(order => {
          const matchesTitle = params.orderTitle
            ? order.title.toLowerCase().includes(params.orderTitle.toLowerCase())
            : true;
          const matchesSeller = params.orderSeller
            ? order.seller.toLowerCase().includes(params.orderSeller.toLowerCase())
            : true;
          const matchesStatus = params.orderStatus
            ? order.status === params.orderStatus
            : true;
          return matchesTitle && matchesSeller && matchesStatus;
        });
  
        const sortedOrders = this.sortOrders(filteredOrders, params);
        const paginatedOrders = sortedOrders.slice(
          params.skip ?? 0,       
          (params.skip ?? 0) + (params.take ?? 25)
        );
  
        this.totalOrdersSubject.next(sortedOrders.length);
        return of(paginatedOrders);
      })
    );
  }
  

  private sortOrders(orders: Order[], params: OrderQuery): Order[] {
    if (params.sortBySeller) {
      orders.sort((a, b) => 
        params.sortBySeller === 'asc' ? a.seller.localeCompare(b.seller) : b.seller.localeCompare(a.seller)
      );
    } else if (params.sortByCreationDate) {
      orders.sort((a, b) => 
        params.sortByCreationDate === 'asc' 
          ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    } else if (params.sortByTitle) {
      orders.sort((a, b) => 
        params.sortByTitle === 'asc' ? a.title.localeCompare(b.title) : b.title.localeCompare(a.title)
      );
    }
    return orders;
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
    }
    return of(null);
  }
  

  public getOrderById(id: number): Observable<Order> {
    return this.httpClient.get<Order>(`${this.apiUrl}/${id}`);
  }

  public deleteOrderById(id: number): void {
    this.httpClient.delete(`${this.apiUrl}/${id}`);
  }

  public createOrder(order: OrderRequest): Observable<OrderRequest> {    
    return this.httpClient.post<OrderRequest>(this.apiUrl, order);
  }

  public setPageData(pageData: PageEvent): void {
    this.updateQueryParams({
      skip: pageData.pageIndex * pageData.pageSize,
      take: pageData.pageSize,
    });
  }
}
