import { inject, Injectable, signal } from '@angular/core';
import {
  BehaviorSubject,
  catchError,
  Observable,
  Subject,
  switchMap,
  tap,
  throwError,
} from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import {
  ReagentRequestList,
  ReagentRequestCreate,
  ReagentRequestQuery,
  ReagentRequestData,
  ReagentRequestFilter,
  ReagentRequestTableColumns,
} from './reagent-request-page.interface';
import { Sort } from '@angular/material/sort';

@Injectable({
  providedIn: 'root',
})
export class ReagentRequestService {
  private httpClient = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/api/v1/reagent_requests`;
  public isLoading = signal(false);
  public nameFilterSubject = new Subject<ReagentRequestFilter>();
  private readonly DEBOUNCE_TIME = 300;
  private destroy$ = new Subject<void>();

  getReagentRequests(
    status?: 'Pending' | 'Ordered' | 'Declined' | 'Fulfilled',
    sortByQuantity?: 'asc' | 'desc',
    sortByCreatedDate?: 'asc' | 'desc',
    sortByUpdatedDate?: 'asc' | 'desc',
    skip?: number,
    take?: number,
    name?: string
  ): Observable<ReagentRequestList[]> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    let params = new HttpParams();
    if (status) {
      params = params.append('status', status);
    }
    if (sortByQuantity) {
      params = params.append('sortByQuantity', sortByQuantity);
    }
    if (sortByCreatedDate) {
      params = params.append('sortByCreatedDate', sortByCreatedDate);
    }
    if (sortByUpdatedDate) {
      params = params.append('sortByUpdatedDate', sortByUpdatedDate);
    }
    if (skip !== undefined) {
      params = params.append('skip', skip.toString());
    }
    if (take !== undefined) {
      params = params.append('take', take.toString());
    }
    if (name) {
      params = params.append('name', name);
    }

    this.isLoading.set(true);

    return this.httpClient
      .get<ReagentRequestList[]>(this.apiUrl, { headers, params })
      .pipe(
        tap(() => this.isLoading.set(false)),
        catchError((error) => {
          this.isLoading.set(false);
          console.error('Error:', error);
          return throwError(() => new Error('Error'));
        })
      );
  }

  getReagentRequestById(id: number): Observable<ReagentRequestList> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    this.isLoading.set(true);

    return this.httpClient
      .get<ReagentRequestList>(`${this.apiUrl}/${id}`, { headers })
      .pipe(
        tap(() => this.isLoading.set(false)),
        catchError((error) => {
          this.isLoading.set(false);
          console.error('Error fetching reagent request by id:', error);
          return throwError(
            () => new Error('Error fetching reagent request by id')
          );
        })
      );
  }

  createReagentRequest(
    reagentData: ReagentRequestCreate
  ): Observable<ReagentRequestList> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.httpClient
      .post<ReagentRequestList>(this.apiUrl, reagentData, { headers })
      .pipe(
        catchError((error) => {
          console.error('Error:', error);
          return throwError(() => new Error('Error'));
        })
      );
  }

  declineReagentRequest(
    id: number,
    reagentData: Partial<ReagentRequestList>
  ): Observable<ReagentRequestList> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.httpClient
      .post<ReagentRequestList>(`${this.apiUrl}/${id}`, reagentData, {
        headers,
      })
      .pipe(
        catchError((error) => {
          console.error('Error:', error);
          return throwError(() => new Error('Error'));
        })
      );
  }

// added this part to adjust updated get RR api, will remove it once denis merges his branch
  private querySubject = new BehaviorSubject<ReagentRequestQuery>({
    skip: 0,
    take: 0,
    sortByQuantity: '',
    sortByCreatedDate: '',
    sortByUpdatedDate: '',
    status: '',
    name: '',
  });
  public query$ = this.querySubject.asObservable();
  public pagesize = 10;

  public get currentQueryParams() {
    return this.querySubject.getValue();
  }
  public getReagentRequestList(): Observable<ReagentRequestData> {
    return this.query$.pipe(
      switchMap((param) => {
        this.isLoading.set(true);
        let httpParams = new HttpParams()
          .set('skip', param.skip)
          .set('take', param.take || this.pagesize);

        const setParams = (
          param: keyof ReagentRequestQuery,
          value: string | number
        ) => {
          return value ? httpParams.set(param, value) : httpParams;
        };
        httpParams = setParams('name', param.name);
        httpParams = setParams('status', param.status);
        httpParams = setParams('sortByQuantity', param.sortByQuantity);
        httpParams = setParams('sortByCreatedDate', param.sortByCreatedDate);
        httpParams = setParams('sortByUpdatedDate', param.sortByUpdatedDate);
        return this.httpClient
          .get<ReagentRequestData>(`${this.apiUrl}`, { params: httpParams })
          .pipe(
            tap(() => {
              this.isLoading.set(false);
            })
          );
      })
    );
  }
  public sorting(sorting: Sort): void {
    this.isLoading.set(true);
    const sortingMap = {
      [ReagentRequestTableColumns.createdAt]: {
        sortByCreatedDate: sorting.direction,
      },
    };

    const resetSortingParams = {
      sortByCreatedDate: '',
    };

    const updatedParams = {
      ...this.currentQueryParams,
      ...resetSortingParams,
      ...sortingMap[sorting.active as keyof typeof sortingMap],
    };
    this.querySubject.next(updatedParams);
  }

  public filtering(filter: ReagentRequestFilter): void {
    this.isLoading.set(true);
    const { value, column } = filter;
    let filterColumn = {};
    switch (column) {
      case ReagentRequestTableColumns.name:
        filterColumn = { name: value };
        break;
      case ReagentRequestTableColumns.status:
        filterColumn = { status: value };
        break;
    }
    this.querySubject.next({
      ...this.currentQueryParams,
      skip: 0,
      ...filterColumn,
    });
  }
  updateQueryParams(updatedParams: Partial<ReagentRequestQuery>) {
    const currentQuery = this.querySubject.value;
    this.querySubject.next({ ...currentQuery, ...updatedParams });
  }
}
