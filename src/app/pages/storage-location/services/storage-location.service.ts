import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient, HttpResponseBase } from '@angular/common/http';
import {
  NewStorageLocation,
  StorageLocationItem,
  StorageLocationListData,
} from '../models/storage-location.interface';
import { Observable, switchMap, tap } from 'rxjs';
import { StorageLocationQueryService } from './storage-location-query.service';

@Injectable({
  providedIn: 'root',
})
export class StorageLocationService {
  private url = environment.apiUrl;
  private apiUrl = `${this.url}/api/v1`;
  private storageLocationQueryService = inject(StorageLocationQueryService);
  private http = inject(HttpClient);

  public getListStorageLocation(): Observable<StorageLocationListData> {
    return this.storageLocationQueryService.httpParams$.pipe(
      switchMap((params) => {
        this.storageLocationQueryService.isLoading.set(true);
        return this.http
          .get<StorageLocationListData>(`${this.apiUrl}/storages`, {
            params: params,
          })
          .pipe(
            tap(() => this.storageLocationQueryService.isLoading.set(false))
          );
      })
    );
  }

  public getStorageLocation(id: string): Observable<StorageLocationItem> {
    return this.http.get<StorageLocationItem>(`${this.apiUrl}/storages/${id}`);
  }

  public addNewStorageLocation(newData: NewStorageLocation) {
    return this.http.post(`${this.apiUrl}/storages`, newData).pipe(
      tap(() => {
        this.storageLocationQueryService.reloadStorageLocation();
      })
    );
  }

  public editStorageLocation(
    id: number,
    newData: Omit<NewStorageLocation, 'roomName'>
  ) {
    return this.http.patch(`${this.apiUrl}/storages/${id}`, newData).pipe(
      tap(() => {
        this.storageLocationQueryService.reloadStorageLocation();
      })
    );
  }

  public deleteStorageLocation(id: number): Observable<HttpResponseBase> {
    return this.http
      .delete<HttpResponseBase>(`${this.apiUrl}/storages/${id}`, {
        observe: 'response',
      })
      .pipe(
        tap(() => {
          this.storageLocationQueryService.reloadStorageLocation();
        })
      );
  }

  public searchStorageLocationByName(
    maxStorageLocationOptions: number
  ): Observable<StorageLocationListData> {
    return this.storageLocationQueryService.httpParams$.pipe(
      switchMap((params) => {
        return this.http.get<StorageLocationListData>(
          `${this.apiUrl}/storages`,
          {
            params: params.set('take', maxStorageLocationOptions),
          }
        );
      })
    );
  }
}
