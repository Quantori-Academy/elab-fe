import { inject, Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { ReagentRequest } from './reagent-request.interface';

@Injectable({
  providedIn: 'root',
})
export class ReagentRequestService {
  private httpClient = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/api/v1/reagent_requests`;

  getReagentRequests(
    status?: 'Pending' | 'Ordered' | 'Declined' | 'Fulfilled',
    sortByQuantity?: 'asc' | 'desc',
    sortByCreatedDate?: 'asc' | 'desc',
    sortByUpdatedDate?: 'asc' | 'desc',
    skip?: number,
    take?: number,
    name?: string
  ): Observable<ReagentRequest[]> {
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

    return this.httpClient
      .get<ReagentRequest[]>(this.apiUrl, { headers, params })
      .pipe(
        catchError((error) => {
          console.error('Error:', error);
          return throwError(() => new Error('Error'));
        })
      );
  }

  createReagentRequest(
    reagentData: ReagentRequest
  ): Observable<ReagentRequest> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.httpClient
      .post<ReagentRequest>(this.apiUrl, reagentData, { headers })
      .pipe(
        catchError((error) => {
          console.error('Error:', error);
          return throwError(() => new Error('Error'));
        })
      );
  }
}
