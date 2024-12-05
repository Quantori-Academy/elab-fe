import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import {
  AdminDashboardDataResponse,
  ProcurementOfficerDashboardDataResponse,
  ResearcherDashboardDataResponse,
} from '../../models/dashboard.model';
import { BehaviorSubject, map, Observable, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private url = environment.apiUrl;
  private apiUrl = `${this.url}/api/v1/dashboard`;
  private http = inject(HttpClient);
  public filteredDate = new BehaviorSubject<Date>(new Date());

  public httpParams = this.filteredDate.pipe(map((date) => {
    const httpParams = new HttpParams()
      .set('year', date.getFullYear())
      .set('month', date.getMonth() + 1);
    return httpParams;
  }))

  public getAdminDashboardData$(): Observable<AdminDashboardDataResponse> {
    return this.http.get<AdminDashboardDataResponse>(`${this.apiUrl}/admin`);
  }

  public getResearcherDashboardData$(): Observable<ResearcherDashboardDataResponse> {
    return this.httpParams.pipe(
      switchMap((params) => this.http.get<ResearcherDashboardDataResponse>(
        `${this.apiUrl}/researcher`, { params })
      )
    )
  }

  public getProcurementOfficerDashboardData$(): Observable<ProcurementOfficerDashboardDataResponse> {
    return this.httpParams.pipe(
      switchMap((params) => this.http.get<ProcurementOfficerDashboardDataResponse>(
        `${this.apiUrl}/procurement_officer`, { params })
      )
    )
  }
}
