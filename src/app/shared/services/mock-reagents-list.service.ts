import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { ELEMENT_DATA } from '../../../../mockData';
// import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class mockReagentsListService {
  // private httpClient = inject(HttpClient);
  apiUrl = `${environment.apiUrl}/reagents`;
  getReagentsList() {
    return of(ELEMENT_DATA);
  }

  //   realGetReagents(){
  //     return this.httpClient.get<Reagents>(this.apiUrl);
  //   }
}
