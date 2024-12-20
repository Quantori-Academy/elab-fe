import { HttpParams } from '@angular/common/http';
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
  ReagentListColumn,
  ReagentListFilteredData,
  ReagentListQuery,
} from '../../../shared/models/reagent-model';
import { PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';

@Injectable({
  providedIn: 'root',
})
export class ReagentsQueryService implements OnDestroy {
  private readonly DEBOUNCE_TIME = 1000;
  public readonly pageSize = 10;
  public isLoading = signal(false);
  public nameFilterSubject = new Subject<ReagentListFilteredData>();
  public structureFilterSubject = new Subject<ReagentListFilteredData>();
  private destroy$ = new Subject<void>();
  private httpParamsSubject = new BehaviorSubject<ReagentListQuery>({
    name: '',
    category: '',
    storageId: '',
    structure: '',
    isFullStructure: false,
    sortByName: '',
    sortByCreationDate: '',
    sortByUpdatedDate: '',
    skip: 0,
    take: 0,
  });

  public httpParams$ = this.httpParamsSubject.pipe(
    map((params) => {
      let httpParams = new HttpParams()
        .set('skip', params.skip)
        .set('take', params.take || this.pageSize);

      const setParamIfExists = (
        param: keyof ReagentListQuery,
        value: string | number | boolean
      ) => {
        return value ? httpParams.set(param, value) : httpParams;
      };

      httpParams = setParamIfExists('name', params.name);
      httpParams = setParamIfExists('category', params.category);
      httpParams = setParamIfExists('storageId', params.storageId);
      httpParams = setParamIfExists('structure', params.structure);
      httpParams = setParamIfExists('isFullStructure', params.isFullStructure);
      httpParams = setParamIfExists('sortByName', params.sortByName);
      httpParams = setParamIfExists(
        'sortByCreationDate',
        params.sortByCreationDate
      );
      httpParams = setParamIfExists(
        'sortByUpdatedDate',
        params.sortByUpdatedDate
      );

      return httpParams;
    })
  );

  constructor() {
    this.setFilterName();
    this.setFilterStructure();
  }

  public get currentHttpParams() {
    return this.httpParamsSubject.getValue();
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
      [ReagentListColumn.NAME]: {
        sortByName: sortingData.direction,
      },
      [ReagentListColumn.STRUCTURE]: {
        sortByStructure: sortingData.direction,
      },
    };
    const resetSortingParams = {
      sortByName: '',
      sortByCreationDate: '',
      sortByUpdatedDate: '',
      sortByStructure: '',
    };
    const updatedParams = {
      ...this.currentHttpParams,
      ...resetSortingParams,
      ...sortingMap[sortingData.active as ReagentListColumn.NAME],
    };
    this.httpParamsSubject.next(updatedParams);
  }

  private setFilterName() {
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

  private setFilterStructure() {
    this.structureFilterSubject
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

  public setFilteringPageData(filterData: ReagentListFilteredData): void {
    this.isLoading.set(true);
    const { value, column, isFullStructure } = filterData;
    let filterColumn = {};
    switch (column) {
      case ReagentListColumn.NAME:
        filterColumn = { name: value };
        break;
      case ReagentListColumn.CATEGORY:
        filterColumn = { category: value };
        break;
      case ReagentListColumn.STRUCTURE:
        filterColumn = { structure: value, isFullStructure: isFullStructure ?? this.currentHttpParams.isFullStructure };
        break;
    }
    this.httpParamsSubject.next({
      ...this.currentHttpParams,
      skip: 0,
      ...filterColumn,
    });
  }

  reloadReagentList() {
    this.httpParamsSubject.next(this.currentHttpParams);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
