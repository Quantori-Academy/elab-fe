import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import {
  StorageLocationFilteredData,
  StorageLocationItem,
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
  private rooms = ['Room 1', 'Room 2', 'Room 3', 'Room 4'];
  private names = ['Name 1', 'Name 2', 'Name 3', 'Name 4'];

  public httpParams$ = this.httpParamsSubject.asObservable();
  public pageSize = 10;

  public listOfRooms = of(this.rooms);
  public listOfNames = of(this.names);

  constructor(private http: HttpClient) {}

  public getListStorageLocation(): Observable<StorageLocationItem[]> {
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

        return this.http.get<StorageLocationItem[]>(`${this.apiUrl}/storages`, {
          params: httpParams,
        });
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
        };
        break;
      case StorageLocationColumn.CreatedAt:
        updatedParams = {
          ...updatedParams,
          chronologicalDate: sortingData.direction,
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
}
