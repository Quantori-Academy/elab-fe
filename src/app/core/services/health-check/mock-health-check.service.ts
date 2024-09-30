import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ServerHealthStatus } from './server-health-status.interface';

@Injectable({
  providedIn: 'root',
})
export class MockHealthCheckService {
  checkHealth(): Observable<ServerHealthStatus> {
    const mockData: ServerHealthStatus = { version: '1.0.0' };
    return of(mockData);
  }
}
