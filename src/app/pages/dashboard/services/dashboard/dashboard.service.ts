import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { AdminDashboardDataResponse } from '../../model/dashboard.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private url = environment.apiUrl;
  private apiUrl = `${this.url}/api/v1/dashboard`;
  private http = inject(HttpClient);

  public getAdminDashboardData(): Observable<AdminDashboardDataResponse> {
    return this.http.get<AdminDashboardDataResponse>(`${this.apiUrl}/admin`);
  }
}
