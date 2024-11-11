import { Injectable, OnDestroy, signal } from '@angular/core';
import {
  BehaviorSubject,
  debounceTime,
  distinctUntilChanged,
  map,
  Subject,
  takeUntil,
  tap,
} from 'rxjs';
import {
  StorageLocationFilteredData,
  StorageLocationPageData,
} from '../models/storage-location.interface';
import { HttpParams } from '@angular/common/http';
import { PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import { StorageLocationColumn } from '../models/storage-location.enum';

@Injectable({
  providedIn: 'root',
})
export class StorageLocationQueryService implements OnDestroy {
  private readonly DEBOUNCE_TIME = 1000;
  public readonly pageSize = 10;
  public isLoading = signal(false);
  public nameFilterSubject = new Subject<StorageLocationFilteredData>();

  private destroy$ = new Subject<void>();
  private httpParamsSubject = new BehaviorSubject<StorageLocationPageData>({
    skip: 0,
    take: 0,
    chronologicalDate: '',
    alphabeticalRoomName: '',
    alphabeticalStorageName: '',
    roomName: '',
    storageName: '',
  });

  public httpParams$ = this.httpParamsSubject.pipe(
    map((params) => {
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

      return httpParams;
    })
  );

  constructor() {
    this.setFilterStorageName();
  }

  public get currentHttpParams() {
    return this.httpParamsSubject.getValue();
  }

  private setFilterStorageName() {
    this.nameFilterSubject
      .pipe(
        tap(() => this.isLoading.set(true)),
        debounceTime(this.DEBOUNCE_TIME),
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      )
      .subscribe((filterData) => {
        this.setFilteringPageData(filterData);
      });
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

  public reloadStorageLocation() {
    this.httpParamsSubject.next(this.currentHttpParams);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
