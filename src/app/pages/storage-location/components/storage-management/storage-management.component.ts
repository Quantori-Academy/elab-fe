import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { MaterialModule } from '../../../../material.module';
import {
  debounceTime,
  distinctUntilChanged,
  Observable,
  Subject,
  takeUntil,
} from 'rxjs';
import {
  StorageLocationFilteredData,
  StorageLocationItem,
} from '../../models/storage-location.interface';
import { StorageLocationService } from '../../services/storage-location.service';
import { MatSortModule, Sort } from '@angular/material/sort';
import { AsyncPipe, CommonModule, DatePipe } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatSelectModule } from '@angular/material/select';
import { RbacService } from '../../../../auth/services/authentication/rbac.service';
import { PageEvent } from '@angular/material/paginator';
import { StorageLocationColumn } from '../../models/storage-location.enum';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-storage-management',
  standalone: true,
  imports: [
    MaterialModule,
    MatTableModule,
    MatSortModule,
    MatSelectModule,
    DatePipe,
    AsyncPipe,
    CommonModule,
    FormsModule,
  ],
  templateUrl: './storage-management.component.html',
  styleUrl: './storage-management.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StorageManagementComponent implements OnInit, OnDestroy {
  readonly DEBOUNCE_TIME = 1000;
  public displayedColumns: string[] = ['room', 'name', 'createdAt', 'reagents'];
  public pageSize: number;
  public listLength = 100;
  public pageIndex = 0;
  public storageLocationList$!: Observable<StorageLocationItem[]>;

  public listOfRooms$: Observable<string[]>;
  public isAdmin = false;

  private storageLocationService = inject(StorageLocationService);
  private rbcService = inject(RbacService);
  private filterSubject = new Subject<StorageLocationFilteredData>();
  private destroy$ = new Subject<void>();

  constructor() {
    this.storageLocationList$ =
      this.storageLocationService.getListStorageLocation();
    this.listOfRooms$ = this.storageLocationService.listOfRooms;
    this.pageSize = this.storageLocationService.pageSize;
  }

  ngOnInit(): void {
    this.isAdmin = this.rbcService.isAdmin();
    if (this.isAdmin) {
      this.displayedColumns.push('actions');
    }
    this.filterSubject
      .pipe(
        debounceTime(this.DEBOUNCE_TIME),
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      )
      .subscribe((filterData) =>
        this.storageLocationService.setFilteringPageData(filterData)
      );
  }

  private setActionsColumn() {
    if (this.isAdmin) {
      this.displayedColumns.push('actions');
    }
  }

  onSort(sort: Sort) {
    this.storageLocationService.setSortingPageData(sort);
  }

  onFilterRoom(value: string) {
    this.filterSubject.next({ value, column: StorageLocationColumn.Room });
  }

  onFilterName($event: Event) {
    const value = ($event.target as HTMLInputElement).value;
    this.filterSubject.next({ value, column: StorageLocationColumn.Name });
  }

  onEdit(element: StorageLocationItem) {
    console.log('edited element', element);
  }

  onDelete(element: StorageLocationItem) {
    console.log('deleted element', element);
  }

  handlePageEvent($event: PageEvent) {
    this.storageLocationService.setPageData($event);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
