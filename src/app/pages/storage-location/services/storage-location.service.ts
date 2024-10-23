import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient, HttpParams, HttpResponseBase } from '@angular/common/http';
import {
  NewStorageLocation,
  StorageLocationFilteredData,
  StorageLocationListData,
  StorageLocationPageData,
} from '../models/storage-location.interface';
import { BehaviorSubject, Observable, of, switchMap } from 'rxjs';
import { PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import { StorageLocationColumn } from '../models/storage-location.enum';

@Injectable({
  providedIn: 'root',
})
export class StorageLocationService {
  private url = environment.apiUrl;
  private apiUrl = `${this.url}/api/v1`;

  private httpParamsSubject = new BehaviorSubject<StorageLocationPageData>({
    skip: 0,
    take: 0,
    chronologicalDate: '',
    alphabeticalName: '',
    roomName: '',
    storageName: '',
  });
  private rooms = [
    { id: 1, name: 'Room1' },
    { id: 2, name: 'Room2' },
    { id: 3, name: 'Room3' },
  ];

  public httpParams$ = this.httpParamsSubject.asObservable();
  public pageSize = 10;

  public listOfRooms = of(this.rooms);

  constructor(private http: HttpClient) {}

  public addNewStorageLocation(newData: NewStorageLocation) {
    return this.http.post(`${this.apiUrl}/storages`, newData);
  }

  public getListStorageLocation(): Observable<StorageLocationListData> {
    return this.httpParams$.pipe(
      switchMap((params) => {
        let httpParams = new HttpParams()
          .set('skip', params.skip)
          .set('take', params.take || this.pageSize);

        const setParamIfExists = (param: string, value: string | number) => {
          return value ? httpParams.set(param, value) : httpParams;
        };

        httpParams = setParamIfExists(
          'alphabeticalName',
          params.alphabeticalName
        );
        httpParams = setParamIfExists(
          'chronologicalDate',
          params.chronologicalDate
        );
        httpParams = setParamIfExists('roomName', params.roomName);
        httpParams = setParamIfExists('storageName', params.storageName);

        return this.http.get<StorageLocationListData>(
          `${this.apiUrl}/storages`,
          {
            params: httpParams,
          }
        );
      })
    );
  }

  public setPageData(pageData: PageEvent): void {
    this.httpParamsSubject.next({
      ...this.currentHttpParams,
      skip: pageData.pageIndex * pageData.pageSize,
      take: pageData.pageSize,
    });
  }

  // TODO: optimize code
  public setSortingPageData(sortingData: Sort): void {
    let updatedParams = { ...this.currentHttpParams };
    switch (sortingData.active) {
      case StorageLocationColumn.Name:
        updatedParams = {
          ...updatedParams,
          alphabeticalName: sortingData.direction,
          chronologicalDate: '',
        };
        break;
      case StorageLocationColumn.CreatedAt:
        updatedParams = {
          ...updatedParams,
          chronologicalDate: sortingData.direction,
          alphabeticalName: '',
        };
        break;
      default:
        return;
    }
    this.httpParamsSubject.next(updatedParams);
  }

  public setFilteringPageData(filterData: StorageLocationFilteredData): void {
    const { value, column } = filterData;
    if (column === StorageLocationColumn.Name) {
      this.httpParamsSubject.next({
        ...this.currentHttpParams,
        storageName: value,
      });
    }
  }

  public get currentHttpParams() {
    return this.httpParamsSubject.getValue();
  }

  public deleteStorageLocation(id: number): Observable<HttpResponseBase> {
    return this.http.delete<HttpResponseBase>(`${this.apiUrl}/storages/${id}`, {
      observe: 'response',
    });
  }
}
