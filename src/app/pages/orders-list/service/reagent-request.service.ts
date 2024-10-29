import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { ReagentRequest } from '../model/reagent-request-model';

@Injectable({
  providedIn: 'root',
})

//I will remove this service as soon as Denis merges reagents get api :)

export class ReagentRequestService {
  private httpClient = inject(HttpClient);
  apiUrl = `${environment.apiUrl}/api/v1/reagent_requests`;

  public getReagentRequests(): Observable<ReagentRequest[]> {
    return this.httpClient.get<ReagentRequest[]>(this.apiUrl);
  }
}
