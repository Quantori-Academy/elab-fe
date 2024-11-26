import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import {
  AdminDashboardDataResponse,
  ProcurementOfficerDashboardDataResponse,
  ResearcherDashboardDataResponse,
} from '../../models/dashboard.model';
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

  public getResearcherDashboardData(): Observable<ResearcherDashboardDataResponse> {
    return this.http.get<ResearcherDashboardDataResponse>(
      `${this.apiUrl}/researcher`
    );
  }

  public getProcurementOfficerDashboardData(params: {
    year: number;
    month: number;
  }): Observable<ProcurementOfficerDashboardDataResponse> {
    return this.http.get<ProcurementOfficerDashboardDataResponse>(
      `${this.apiUrl}/procurement_officer`,
      { params }
    );
  }
}
