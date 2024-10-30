import { Injectable, signal } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient, HttpParams, HttpResponseBase } from '@angular/common/http';
import {
  NewStorageLocation,
  StorageLocationFilteredData,
  StorageLocationListData,
  StorageLocationPageData,
} from '../models/storage-location.interface';
import { BehaviorSubject, Observable, switchMap, tap } from 'rxjs';
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
    alphabeticalRoomName: '',
    alphabeticalStorageName: '',
    roomName: '',
    storageName: '',
  });
  public httpParams$ = this.httpParamsSubject.asObservable();

  public pageSize = 10;
  public isLoading = signal(false);

  constructor(private http: HttpClient) {}

  public get currentHttpParams() {
    return this.httpParamsSubject.getValue();
  }

  public getListStorageLocation(): Observable<StorageLocationListData> {
    return this.httpParams$.pipe(
      switchMap((params) => {
        this.isLoading.set(true);
        let httpParams = new HttpParams()
          .set('skip', params.skip)
          .set('take', params.take || this.pageSize);

        const setParamIfExists = (
          param: keyof StorageLocationPageData,
          value: string | number
        ) => {
          return value ? httpParams.set(param, value) : httpParams;
        };

        httpParams = setParamIfExists(
          'alphabeticalStorageName',
          params.alphabeticalStorageName
        );
        httpParams = setParamIfExists(
          'alphabeticalRoomName',
          params.alphabeticalRoomName
        );
        httpParams = setParamIfExists(
          'chronologicalDate',
          params.chronologicalDate
        );
        httpParams = setParamIfExists('roomName', params.roomName);
        httpParams = setParamIfExists('storageName', params.storageName);

        return this.http
          .get<StorageLocationListData>(`${this.apiUrl}/storages`, {
            params: httpParams,
          })
          .pipe(tap(() => this.isLoading.set(false)));
      })
    );
  }

  public setPageData(pageData: PageEvent): void {
    this.isLoading.set(true);
    this.httpParamsSubject.next({
      ...this.currentHttpParams,
      skip: pageData.pageIndex * pageData.pageSize,
      take: pageData.pageSize,
    });
  }

  public setSortingPageData(sortingData: Sort): void {
    this.isLoading.set(true);
    const sortingMap = {
      [StorageLocationColumn.Name]: {
        alphabeticalStorageName: sortingData.direction,
      },
      [StorageLocationColumn.Date]: {
        chronologicalDate: sortingData.direction,
      },
      [StorageLocationColumn.Room]: {
        alphabeticalRoomName: sortingData.direction,
      },
    };
    const resetSortingParams = {
      alphabeticalStorageName: '',
      chronologicalDate: '',
      alphabeticalRoomName: '',
    };
    const updatedParams = {
      ...this.currentHttpParams,
      ...resetSortingParams,
      ...sortingMap[sortingData.active as StorageLocationColumn],
    };
    this.httpParamsSubject.next(updatedParams);
  }

  public setFilteringPageData(filterData: StorageLocationFilteredData): void {
    this.isLoading.set(true);
    const { value, column } = filterData;
    let filterColumn = {};
    switch (column) {
      case StorageLocationColumn.Room:
        filterColumn = { roomName: value };
        break;
      case StorageLocationColumn.Name:
        filterColumn = { storageName: value };
        break;
    }
    this.httpParamsSubject.next({
      ...this.currentHttpParams,
      skip: 0,
      ...filterColumn,
    });
  }

  public addNewStorageLocation(newData: NewStorageLocation) {
    return this.http.post(`${this.apiUrl}/storages`, newData).pipe(
      tap(() => {
        this.httpParamsSubject.next(this.currentHttpParams);
      })
    );
  }

  public editStorageLocation(
    id: number,
    newData: Omit<NewStorageLocation, 'roomName'>
  ) {
    return this.http.patch(`${this.apiUrl}/storages/${id}`, newData).pipe(
      tap(() => {
        this.httpParamsSubject.next(this.currentHttpParams);
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
          this.httpParamsSubject.next(this.currentHttpParams);
        })
      );
  }
}
