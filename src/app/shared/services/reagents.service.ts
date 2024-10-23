import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { NewReagentsList } from '../../../../mockData';
// import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ReagentsService {
  // private httpClient = inject(HttpClient);
  apiUrl = `${environment.apiUrl}/reagents`;
  getReagentsList() {
    return of(NewReagentsList);
  }

  //   GetReagents(){
  //     return this.httpClient.get<Reagents>(this.apiUrl);
  //   }
}
