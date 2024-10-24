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
    alphabeticalRoomName: '',
    alphabeticalStorageName: '',
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

  public setSortingPageData(sortingData: Sort): void {
    const sortingMap = {
      [StorageLocationColumn.Name]: {
        alphabeticalStorageName: sortingData.direction,
      },
      [StorageLocationColumn.CreatedAt]: {
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
      ...filterColumn,
    });
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
