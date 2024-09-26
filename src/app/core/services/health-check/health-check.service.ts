import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { ServerHealthStatus } from './server-health-status.interface';

@Injectable({
  providedIn: 'root',
})
export class HealthCheckService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  checkHealth(): Observable<ServerHealthStatus> {
    return this.http.get<ServerHealthStatus>(`${this.apiUrl}/healthcheck`);
  }
}
