import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddEditRoomComponent } from '../add-edit-room/add-edit-room.component';
import { MaterialModule } from '../../../../material.module';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatSelectModule } from '@angular/material/select';
import { RoomManagementService } from '../../services/room-management.service';
import { AsyncPipe, DatePipe } from '@angular/common';
import { RoomData } from '../../models/storage-location.interface';
import { first, take } from 'rxjs';
import { NotificationPopupService } from '../../../../shared/services/notification-popup/notification-popup.service';
import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { DeleteConfirmComponent } from '../../../../shared/components/delete-confirm/delete-confirm.component';
import { RbacService } from '../../../../auth/services/authentication/rbac.service';
import { PageEvent } from '@angular/material/paginator';
import { PAGE_SIZE_OPTIONS } from '../../../../shared/units/variables.units';
import { TableLoaderSpinnerComponent } from '../../../../shared/components/table-loader-spinner/table-loader-spinner.component';

@Component({
  selector: 'app-room-management',
  standalone: true,
  imports: [
    MaterialModule,
    MatTableModule,
    MatSortModule,
    MatSelectModule,
    AsyncPipe,
    DatePipe,
    TableLoaderSpinnerComponent,
  ],
  templateUrl: './room-management.component.html',
  styleUrl: './room-management.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RoomManagementComponent implements OnInit {
  private dialog = inject(MatDialog);
  private roomManagementService = inject(RoomManagementService);
  private notificationPopupService = inject(NotificationPopupService);
  private rbcService = inject(RbacService);

  public displayedColumns = ['room', 'description', 'storages'];
  public pageSizeOptions = inject(PAGE_SIZE_OPTIONS);
  public roomList$ = this.roomManagementService.roomData$;
  public isAdmin = false;

  ngOnInit(): void {
    this.roomManagementService.getListOfRooms().pipe(first()).subscribe();
    this.defineIsAdmin();
  }
  private defineIsAdmin() {
    this.isAdmin = this.rbcService.isAdmin();
    if (this.isAdmin) {
      this.displayedColumns.push('actions');
    }
  }

  public getRandomStorageNumber(): number {
    return Math.floor(Math.random() * 10);
  }

  public openDialog() {
    this.dialog.open(AddEditRoomComponent);
  }

  public onEdit(element: RoomData) {
    this.dialog.open(AddEditRoomComponent, {
      data: element,
    });
  }

  public onDelete(element: RoomData) {
    this.dialog.open(DeleteConfirmComponent, {
      data: {
        message: 'Are you sure you want to delete the room?',
        deleteHandler: () => this.deleteHandler(element.id!),
      },
    });
  }

  public deleteHandler(roomId: number) {
    this.roomManagementService
      .deleteRoom(roomId)
      .pipe(take(1))
      .subscribe({
        next: () => {
          this.notificationPopupService.success({
            title: 'Success',
            message: 'Room is deleted successfully',
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
    console.log($event);
  }
}
