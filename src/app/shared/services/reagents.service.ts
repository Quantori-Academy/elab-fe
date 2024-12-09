import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, switchMap, tap } from 'rxjs';
import { HttpClient, HttpEvent } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { ReagentsQueryService } from '../../pages/reagents-list/services/reagents-query.service';
import {
  Reagent,
  ReagentFromFulfilledOrder,
  ReagentListResponse,
  ReagentRequest,
  SampleRequest,
} from '../models/reagent-model';

@Injectable({
  providedIn: 'root',
})
export class ReagentsService {
  private httpClient = inject(HttpClient);
  private reagentsQueryService = inject(ReagentsQueryService);
  private readonly apiUrl = `${environment.apiUrl}/api/v1/reagents`;

  private uniqueProducersSubject = new BehaviorSubject<string[]>([]);
  public uniqueProducers$ = this.uniqueProducersSubject.asObservable();

  getReagents(storageId?: number): Observable<ReagentListResponse> {
    return this.reagentsQueryService.httpParams$.pipe(
      map((params) => {
        return storageId ? params.set('storageId', storageId) : params;
      }),
      switchMap((params) => {
        return this.httpClient
          .get<ReagentListResponse>(this.apiUrl, { params })
          .pipe(tap(() => this.reagentsQueryService.isLoading.set(false)));
      })
    );
  }

  createReagent(reagentData: ReagentRequest): Observable<ReagentRequest> {
    return this.httpClient.post<ReagentRequest>(this.apiUrl, reagentData);
  }

  createSample(sampleData: SampleRequest): Observable<SampleRequest> {
    return this.httpClient.post<SampleRequest>(
      `${this.apiUrl}/create/sample`,
      sampleData
    );
  }

  uploadReagent(formData: FormData): Observable<HttpEvent<unknown>> {
    return this.httpClient.post<HttpEvent<unknown>>(`${this.apiUrl}/upload`, formData, {
      reportProgress: true,
      observe: 'events',
    });
  }

  editReagent(id: number, reagentData: {quantityLeft: number, storageId?: number}): Observable<Reagent[]> {
    return this.httpClient.patch<Reagent[]>(`${this.apiUrl}/${id}`, reagentData)
  }

  public getReagentById(id: string): Observable<Reagent> {
    return this.httpClient.get<Reagent>(`${this.apiUrl}/${id}`);
  }

  public deleteReagent(id: string): Observable<Reagent> {
    return this.httpClient.delete<Reagent>(`${this.apiUrl}/${id}`);
  }

  public createReagentFromOrder(
    reagentId: number,
    storageId: number
  ): Observable<ReagentFromFulfilledOrder> {
    return this.httpClient.post<ReagentFromFulfilledOrder>(
      `${this.apiUrl}/reagent-request/${reagentId}/${storageId}`,
      null
    );
  }
}
