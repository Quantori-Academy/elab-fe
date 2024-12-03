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
  computed,
  inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { catchError, first, map, Observable, of, Subject, take, tap } from 'rxjs';
import {
  RoomData,
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
import { SpinnerDirective } from '../../../../shared/directives/spinner/spinner.directive';
import { TableLoaderSpinnerComponent } from '../../../../shared/components/table-loader-spinner/table-loader-spinner.component';
import { StorageLocationQueryService } from '../../services/storage-location-query.service';
import { NoDataComponent } from '../../../../shared/components/no-data/no-data.component';

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
    SpinnerDirective,
    TableLoaderSpinnerComponent,
    NoDataComponent,
  ],
  providers: [StorageLocationService, StorageLocationQueryService],
  templateUrl: './storage-management.component.html',
  styleUrl: './storage-management.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StorageManagementComponent implements OnInit, OnDestroy {
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
  public storageLocationData$?: Observable<StorageLocationListData | undefined>;

  public listOfRooms$: Observable<RoomData[] | undefined>;
  public isAdmin = false;

  private storageLocationService = inject(StorageLocationService);
  private storageLocationQueryService = inject(StorageLocationQueryService);
  private roomManagementService = inject(RoomManagementService);
  private notificationPopupService = inject(NotificationPopupService);
  private rbcService = inject(RbacService);
  private dialog = inject(MatDialog);
  private router = inject(Router);
  private destroy$ = new Subject<void>();

  public isLoading = computed(() =>
    this.storageLocationQueryService.isLoading()
  );

  constructor() {
    this.storageLocationData$ =
      this.storageLocationService.getListStorageLocation();
    this.roomManagementService.loadListOfRooms();
    this.listOfRooms$ = this.roomManagementService.roomData$;
    this.pageSize = this.storageLocationQueryService.pageSize;
  }

  ngOnInit(): void {
    this.isAdmin = this.rbcService.isAdmin();
  }

  public redirectToDetailPage(element: StorageLocationItem) {
    this.router.navigate(['/storage-locations', element.id]);
  }

  onSort(sort: Sort) {
    this.storageLocationQueryService.setSortingPageData(sort);
  }

  onFilterRoom(value: string) {
    this.storageLocationQueryService.setFilteringPageData({
      value,
      column: StorageLocationColumn.Room,
    });
  }

  onFilterName($event: Event) {
    const value = ($event.target as HTMLInputElement).value;
    this.storageLocationQueryService.nameFilterSubject.next({
      value,
      column: StorageLocationColumn.Name,
    });
  }

  public onCreate(): void {
    this.dialog.open(AddEditStorageComponent, {width: '400px'})
      .afterClosed()
      .pipe(first())
      .subscribe(value => {
        if(value) {
          this.storageLocationQueryService.reloadStorageLocation()
          this.roomManagementService.loadListOfRooms();
        }
      });;
  }

  public onEdit(element: StorageLocationItem) {
    this.dialog.open(AddEditStorageComponent, { data: element, width: '400px' })
      .afterClosed()
      .pipe(first())
      .subscribe(value => {
        if(value) {
          this.storageLocationQueryService.reloadStorageLocation()
        }
      });
  }

  public onDelete(element: StorageLocationItem) {
    this.dialog.open(DeleteConfirmComponent, {
      data: {
        message: 'Are you sure you want to delete the storage location?',
        deleteHandler: () => this.deleteHandler(element.id),
      },
    }).afterClosed()
      .pipe(first())
      .subscribe(value => {
        if(value) {
          this.storageLocationQueryService.reloadStorageLocation()
          this.roomManagementService.loadListOfRooms();
        }
      });;
  }

  public deleteHandler(storageId: number): Observable<boolean> {
    return this.storageLocationService.deleteStorageLocation(storageId).pipe(
      take(1),
      tap({
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
      }),
      map(() => true),
      catchError(() => of(false))
    );
  }

  handlePageEvent($event: PageEvent) {
    this.storageLocationQueryService.setPageData($event);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
