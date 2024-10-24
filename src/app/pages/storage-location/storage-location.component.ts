import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { MaterialModule } from '../../material.module';
import {
  BehaviorSubject,
  debounceTime,
  distinctUntilChanged,
  Observable,
  Subject,
  take,
  takeUntil,
} from 'rxjs';
import {
  StorageLocationFilteredData,
  StorageLocationItem,
  StorageLocationListData,
} from './models/storage-location.interface';
import { MatSortModule, Sort } from '@angular/material/sort';
import { AsyncPipe, CommonModule, DatePipe } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatSelectModule } from '@angular/material/select';
import { RbacService } from '../../auth/services/authentication/rbac.service';
import { PageEvent } from '@angular/material/paginator';
import { StorageLocationColumn } from './models/storage-location.enum';
import { FormsModule } from '@angular/forms';
import { DeleteConfirmComponent } from '../../shared/components/delete-confirm/delete-confirm.component';
import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { NotificationPopupService } from '../../shared/services/notification-popup/notification-popup.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { StorageLocationAddNewComponent } from './components/storage-location-add-new/storage-location-add-new.component';
import { StorageLocationService } from './services/storage-location.service';

@Component({
  selector: 'app-storage-location',
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
    MatDialogModule,
  ],
  templateUrl: './storage-location.component.html',
  styleUrl: './storage-location.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StorageLocationComponent implements OnInit, OnDestroy {
  readonly DEBOUNCE_TIME = 1000;
  public displayedColumns: string[] = ['room', 'name', 'createdAt', 'reagents'];
  public pageSize: number;
  public listLength = 100;
  public pageIndex = 0;
  public storageLocationDataSubject: BehaviorSubject<
    StorageLocationListData | undefined
  > = new BehaviorSubject<StorageLocationListData | undefined>(undefined);
  public storageLocationData$ = this.storageLocationDataSubject.asObservable();

  public listOfRooms$: Observable<{ id: number; name: string }[]>;
  public isAdmin = false;

  private storageLocationService = inject(StorageLocationService);
  private notificationPopupService = inject(NotificationPopupService);
  private rbcService = inject(RbacService);
  private dialog = inject(MatDialog);
  private filterSubject = new Subject<StorageLocationFilteredData>();
  private destroy$ = new Subject<void>();

  constructor() {
    this.getListStorageLocation();
    this.listOfRooms$ = this.storageLocationService.listOfRooms;
    this.pageSize = this.storageLocationService.pageSize;
  }

  public openDialog(): void {
    this.dialog
      .open(StorageLocationAddNewComponent)
      .afterClosed()
      .pipe(take(1))
      .subscribe((value) => {
        if (value) {
          this.getListStorageLocation();
        }
      });
  }

  ngOnInit(): void {
    this.setIsAdmin();
    this.setFilterStorageName();
  }

  private setIsAdmin() {
    this.isAdmin = this.rbcService.isAdmin();
    if (this.isAdmin) {
      this.displayedColumns.push('actions');
    }
  }

  private setFilterStorageName() {
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

  public getListStorageLocation() {
    this.storageLocationService
      .getListStorageLocation()
      .pipe(takeUntil(this.destroy$))
      .subscribe((storageList) =>
        this.storageLocationDataSubject.next(storageList)
      );
  }

  onSort(sort: Sort) {
    this.storageLocationService.setSortingPageData(sort);
  }

  onFilterRoom(value: string) {
    this.storageLocationService.setFilteringPageData({
      value,
      column: StorageLocationColumn.Room,
    });
  }

  onFilterName($event: Event) {
    const value = ($event.target as HTMLInputElement).value;
    this.filterSubject.next({ value, column: StorageLocationColumn.Name });
  }

  onEdit(element: StorageLocationItem) {
    console.log('edited element', element);
  }

  onDelete(element: StorageLocationItem) {
    this.dialog.open(DeleteConfirmComponent, {
      data: {
        message: 'Are you sure you want to delete the storage location?',
        deleteHandler: () => this.deleteHandler(element.id),
      },
    });
  }

  public deleteHandler(storageId: number) {
    this.storageLocationService
      .deleteStorageLocation(storageId)
      .pipe(take(1))
      .subscribe({
        next: () => {
          this.getListStorageLocation();
          this.notificationPopupService.success({
            title: 'Success',
            message: 'Storage location is deleted successfully',
            duration: 3000,
          });
        },
        error: (error: HttpErrorResponse) => {
          if (error.status === HttpStatusCode.Conflict) {
            this.notificationPopupService.warning({
              title: 'Warning',
              message: error.error.message,
              duration: 4000,
            });
          } else {
            this.notificationPopupService.error({
              title: 'Error',
              message: error.error.message,
              duration: 3000,
            });
          }
        },
      });
  }

  handlePageEvent($event: PageEvent) {
    this.storageLocationService.setPageData($event);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
