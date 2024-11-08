import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, switchMap, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { ReagentsQueryService } from '../../pages/reagents-list/services/reagents-query.service';
import {
  Reagent,
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

  getReagents(storageId?: number): Observable<Reagent[]> {
    return this.reagentsQueryService.httpParams$.pipe(
      map((params) => {
        return storageId ? params.set('storageId', storageId) : params;
      }),
      switchMap((params) => {
        return this.httpClient
          .get<Reagent[]>(this.apiUrl, { params })
          .pipe(tap(() => this.reagentsQueryService.isLoading.set(false)));
      })
    );
  }

  createReagent(reagentData?: ReagentRequest): Observable<ReagentRequest> {
    return this.httpClient.post<ReagentRequest>(this.apiUrl, reagentData);
  }

  createSample(sampleData: SampleRequest): Observable<SampleRequest> {
    return this.httpClient.post<SampleRequest>(
      `${this.apiUrl}/create/sample`,
      sampleData
    );
  }

  public getReagentById(id: string): Observable<Reagent> {
    return this.httpClient.get<Reagent>(`${this.apiUrl}/${id}`);
  }

  // to get producers from whom we already bought before
  public getAllUniqueSellers(): Observable<string[]> {
    return this.httpClient.get<Reagent[]>(`${this.apiUrl}`).pipe(
      map((reagentData: Reagent[]) => {
        const uniqueSellers = Array.from(
          new Set(reagentData.map((reagent) => reagent.producer))
        );

        this.uniqueProducersSubject.next(uniqueSellers);
        return uniqueSellers;
      })
    );
  }
}
