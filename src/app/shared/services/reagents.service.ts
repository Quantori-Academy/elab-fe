import { inject, Injectable } from '@angular/core';
import { catchError, Observable, of, throwError } from 'rxjs';
import { NewReagentsList } from '../../../../newMockData';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Reagent, ReagentRequest } from '../models/reagent-model';

@Injectable({
  providedIn: 'root',
})
export class ReagentsService {
  private httpClient = inject(HttpClient);
  apiUrl = `${environment.apiUrl}/api/v1/reagents`;

  // swagger doesn't work so locally had to check
  // apiUrl = `http://localhost:3000/api/v1/reagents`;


  getReagentsList() {
    return of(NewReagentsList);
  }
  getreagents():Observable <Reagent[]>{
    const token = localStorage.getItem('access_token');
    if (!token) {
      return throwError('No access token found');
    }
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
    return this.httpClient.get<Reagent[]>(this.apiUrl, { headers }).pipe(
      catchError((error) => {
        console.error('Error fetching reagents:', error);
        return throwError(() => new Error('Failed to fetch reagents'));
      })
    );
  }
  getAllReagents(): Observable<Reagent[]> {
    const token = localStorage.getItem('access_token');
    if (!token) {
      return throwError('No access token found');
    }
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
    return this.httpClient.get<Reagent[]>(this.apiUrl, { headers }).pipe(
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
