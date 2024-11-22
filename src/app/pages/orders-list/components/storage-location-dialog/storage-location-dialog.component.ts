import { Component, computed, inject, Inject, OnDestroy } from '@angular/core';
import { MaterialModule } from '../../../../material.module';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { StorageLocationService } from '../../../storage-location/services/storage-location.service';
import { ReagentsService } from '../../../../shared/services/reagents.service';
import { Observable, Subject, take } from 'rxjs';
import { NotificationPopupService } from '../../../../shared/services/notification-popup/notification-popup.service';
import { StorageLocationQueryService } from '../../../storage-location/services/storage-location-query.service';
import {
  RoomData,
  StorageLocationListData,
} from '../../../storage-location/models/storage-location.interface';
import { AsyncPipe } from '@angular/common';
import { TableLoaderSpinnerComponent } from '../../../../shared/components/table-loader-spinner/table-loader-spinner.component';
import { StorageLocationColumn } from '../../../storage-location/models/storage-location.enum';
import { RoomManagementService } from '../../../storage-location/services/room-management.service';
import { SpinnerDirective } from '../../../../shared/directives/spinner/spinner.directive';
import { PageEvent } from '@angular/material/paginator';
import { PAGE_SIZE_OPTIONS } from '../../../../shared/units/variables.units';

@Component({
  selector: 'app-storage-location-dialog',
  standalone: true,
  imports: [
    MaterialModule,
    AsyncPipe,
    TableLoaderSpinnerComponent,
    SpinnerDirective,
  ],
  templateUrl: './storage-location-dialog.component.html',
  styleUrl: './storage-location-dialog.component.scss',
})
export class StorageLocationDialogComponent implements OnDestroy {
  private storageLocationService = inject(StorageLocationService);
  private storageQueryService = inject(StorageLocationQueryService);
  private roomManagementService = inject(RoomManagementService);
  private reagentService = inject(ReagentsService);
  private notificationService = inject(NotificationPopupService);

  public displayedColumns: string[] = ['room', 'name', 'reagents', 'actions'];
  public pageSize: number;
  public listLength = 100;
  public pageIndex = 0;
  public pageSizeOptions = inject(PAGE_SIZE_OPTIONS);

  private destroy$ = new Subject<void>();
  public storageLocationData$?: Observable<StorageLocationListData | undefined>;
  public listOfRooms$: Observable<RoomData[] | undefined>;

  constructor(
    @Inject(MAT_DIALOG_DATA) private id: number,
    private dialogRef: MatDialogRef<StorageLocationDialogComponent>
  ) {
    this.storageLocationData$ =
      this.storageLocationService.getListStorageLocation();
    this.listOfRooms$ = this.roomManagementService.roomData$;
    this.pageSize = this.storageQueryService.pageSize;
  }
  public isLoading = computed(() => this.storageQueryService.isLoading());

  onFilterRoom(value: string) {
    this.storageQueryService.setFilteringPageData({
      value,
      column: StorageLocationColumn.Room,
    });
  }

  onFilterName($event: Event) {
    const value = ($event.target as HTMLInputElement).value;
    this.storageQueryService.nameFilterSubject.next({
      value,
      column: StorageLocationColumn.Name,
    });
  }

  onAdd(storageId: number) {
    const reagentRequestId = this.id;
    this.reagentService
      .createReagentFromOrder(reagentRequestId, storageId)
      .pipe(take(1))
      .subscribe({
        next: () => {
          this.notificationService.success({
            title: 'Success',
            message: 'Reagent has been successfully created!',
            duration: 3000,
          });
          this.dialogRef.close(true);
        },
      });
  }

  handlePageEvent($event: PageEvent) {
    this.storageQueryService.setPageData($event);
  }

  ngOnDestroy(): void {
    this.storageQueryService.httpParams$.pipe(take(1)).subscribe(() => {
      this.storageQueryService['httpParamsSubject'].next({
        skip: 0,
        take: this.storageQueryService.pageSize,
        chronologicalDate: '',
        alphabeticalRoomName: '',
        alphabeticalStorageName: '',
        roomName: '',
        storageName: '',
        fullPath: '',
      });
    });
    this.destroy$.next();
    this.destroy$.complete();
  }
}
