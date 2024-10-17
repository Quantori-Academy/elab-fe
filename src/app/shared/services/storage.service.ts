import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  private httpClient = inject(HttpClient);
  apiUrl = `${environment.apiUrl}/api/v1/storages`;


  getStorageBy(storageName?: string): Observable<Storage> {
    let params = new HttpParams();
    if (storageName) {
      params = params.set('name', storageName);
    }

    return this.httpClient.get<Storage>(`${this.apiUrl}`, { params });
  }

  // just added this to check storages names, but i guess we can use it for storage managment later

  getAllStorages(): Observable<Storage[]> {
    const token = localStorage.getItem('access_token');
    if (!token) {
      return throwError('No access token found');
    }
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
    return this.httpClient.get<Storage[]>(this.apiUrl, { headers });
  }
}
