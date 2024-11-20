import { inject, Injectable, signal } from '@angular/core';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import {
  ReagentRequestList,
  ReagentRequestCreate,
  ReagentRequestResponse,
} from './reagent-request-page.interface';

@Injectable({
  providedIn: 'root',
})
export class ReagentRequestService {
  private httpClient = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/api/v1/reagent_requests`;
  public isLoading = signal(false);

  getReagentRequests(
    status?: 'Pending' | 'Ordered' | 'Declined' | 'Fulfilled',
    sortByQuantity?: 'asc' | 'desc',
    sortByCreatedDate?: 'asc' | 'desc',
    sortByUpdatedDate?: 'asc' | 'desc',
    skip?: number,
    take?: number,
    name?: string
  ): Observable<ReagentRequestResponse> {
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
      .get<ReagentRequestResponse>(this.apiUrl, {
        headers,
        params,
      })
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
      .patch<ReagentRequestList>(`${this.apiUrl}/${id}`, reagentData, {
        headers,
      })
      .pipe(
        catchError((error) => {
          console.error('Error:', error);
          return throwError(() => new Error('Error'));
        })
      );
  }
}
