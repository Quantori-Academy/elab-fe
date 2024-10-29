import { MatTableModule } from '@angular/material/table';
import { MaterialModule } from '../../../../material.module';
import { MatSortModule, Sort } from '@angular/material/sort';
import { MatSelectModule } from '@angular/material/select';
import { AsyncPipe, CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import {
  BehaviorSubject,
  debounceTime,
  distinctUntilChanged,
  Observable,
  Subject,
  take,
  takeUntil,
  tap,
} from 'rxjs';
import {
  RoomData,
  StorageLocationFilteredData,
  StorageLocationItem,
  StorageLocationListData,
} from '../../models/storage-location.interface';
import { StorageLocationService } from '../../services/storage-location.service';
import { NotificationPopupService } from '../../../../shared/services/notification-popup/notification-popup.service';
import { RbacService } from '../../../../auth/services/authentication/rbac.service';
import { AddEditStorageComponent } from '../add-edit-storage/add-edit-storage.component';
import { StorageLocationColumn } from '../../models/storage-location.enum';
import { DeleteConfirmComponent } from '../../../../shared/components/delete-confirm/delete-confirm.component';
import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { RoomManagementService } from '../../services/room-management.service';
import { PAGE_SIZE_OPTIONS } from '../../../../shared/units/variables.units';

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
    MatDialogModule,
  ],
  templateUrl: './storage-management.component.html',
  styleUrl: './storage-management.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StorageManagementComponent implements OnInit, OnDestroy {
  readonly DEBOUNCE_TIME = 1000;
  public displayedColumns: string[] = [
    'room',
    'name',
    'date',
    'reagents',
    'actions',
  ];
  public pageSize: number;
  public listLength = 100;
  public pageIndex = 0;
  public pageSizeOptions = inject(PAGE_SIZE_OPTIONS);
  public storageLocationDataSubject = new BehaviorSubject<
    StorageLocationListData | undefined
  >(undefined);
  public storageLocationData$ = this.storageLocationDataSubject.asObservable();

  public listOfRooms$: Observable<RoomData[] | undefined>;
  public isAdmin = false;
  public isLoading = false;

  private storageLocationService = inject(StorageLocationService);
  private roomManagementService = inject(RoomManagementService);
  private notificationPopupService = inject(NotificationPopupService);
  private rbcService = inject(RbacService);
  private dialog = inject(MatDialog);
  private router = inject(Router);
  private filterSubject = new Subject<StorageLocationFilteredData>();
  private destroy$ = new Subject<void>();

  constructor() {
    this.getListStorageLocation();
    this.listOfRooms$ = this.roomManagementService.roomData$;
    this.pageSize = this.storageLocationService.pageSize;
  }

  ngOnInit(): void {
    this.isAdmin = this.rbcService.isAdmin();
    this.setFilterStorageName();
  }

  public getRandomReagentsNumber(): number {
    return Math.floor(Math.random() * 10);
  }

  public redirectToDetailPage(element: StorageLocationItem) {
    this.router.navigate(['/storage-locations', element.id], {
      queryParams: { data: JSON.stringify(element) },
    });
  }

  private setFilterStorageName() {
    this.filterSubject
      .pipe(
        tap(() => (this.isLoading = true)),
        debounceTime(this.DEBOUNCE_TIME),
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      )
      .subscribe((filterData) => {
        this.storageLocationService.setFilteringPageData(filterData);
        this.isLoading = false;
      });
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

  public onCreate(): void {
    this.dialog.open(AddEditStorageComponent);
  }

  public onEdit(element: StorageLocationItem) {
    this.dialog.open(AddEditStorageComponent, { data: element });
  }

  public onDelete(element: StorageLocationItem) {
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
          this.notificationPopupService.success({
            title: 'Success',
            message: 'Storage location is deleted successfully',
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
