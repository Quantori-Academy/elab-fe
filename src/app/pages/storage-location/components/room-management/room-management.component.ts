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
  ],
  templateUrl: './room-management.component.html',
  styleUrl: './room-management.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RoomManagementComponent implements OnInit {
  private dialog = inject(MatDialog);
  private roomManagementService = inject(RoomManagementService);
  private notificationPopupService = inject(NotificationPopupService);

  public displayedColumns = ['room', 'description', 'actions'];
  public roomList$ = this.roomManagementService.roomData$;

  ngOnInit(): void {
    this.roomManagementService.getListOfRooms().pipe(first()).subscribe();
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
}
