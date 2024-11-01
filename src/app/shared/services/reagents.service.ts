import { inject, Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Reagent, ReagentRequest } from '../models/reagent-model';

@Injectable({
  providedIn: 'root',
})
export class ReagentsService {
  private httpClient = inject(HttpClient);
  apiUrl = `${environment.apiUrl}/api/v1/reagents`;

  getReagents(
    name?: string,
    category?: string,
    sortByName?: 'asc' | 'desc',
    sortByCreationDate?: 'asc' | 'desc',
    sortByUpdatedDate?: 'asc' | 'desc',
    skip?: number,
    take?: number
  ): Observable<Reagent[]> {
    const token = localStorage.getItem('access_token');
    if (!token) {
      return throwError('No access token found');
    }

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
    let params = new HttpParams();
    if (name) {
      params = params.append('name', name);
    }
    if (category) {
      params = params.append('category', category);
    }
    if (sortByName) {
      params = params.append('sortByName', sortByName);
    }
    if (sortByCreationDate) {
      params = params.append('sortByCreationDate', sortByCreationDate);
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

    return this.httpClient
      .get<Reagent[]>(this.apiUrl, { headers, params })
      .pipe(
        catchError((error) => {
          console.error('Error fetching reagents:', error);
          return throwError(() => new Error('Failed to fetch reagents'));
        })
      );
  }
  createReagent(reagentData?: ReagentRequest): Observable<ReagentRequest> {
    const token = localStorage.getItem('access_token');
    if (!token) {
      return throwError(() => new Error('No access token found'));
    }

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });

    return this.httpClient
      .post<ReagentRequest>(this.apiUrl, reagentData, { headers })
      .pipe(
        catchError((error) => {
          console.error('Error creating reagent:', error);
          return throwError(() => new Error('Failed to create reagent'));
        })
      );
  }
}
