import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddEditRoomComponent } from '../add-edit-room/add-edit-room.component';
import { MaterialModule } from '../../../../material.module';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatSelectModule } from '@angular/material/select';
import { RoomManagementService } from '../../services/room-management.service';
import { AsyncPipe, DatePipe } from '@angular/common';
import { RoomData } from '../../models/storage-location.interface';

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
export class RoomManagementComponent {
  private dialog = inject(MatDialog);
  private roomManagementService = inject(RoomManagementService);

  public displayedColumns = ['room', 'description', 'actions'];
  public roomList$ = this.roomManagementService.getListOfRooms();

  public openDialog() {
    this.dialog.open(AddEditRoomComponent);
  }

  public onEdit(element: RoomData) {
    this.dialog.open(AddEditRoomComponent, {
      data: element,
    });
  }
  public onDelete(element: RoomData) {
    console.log('deleted element', element);
  }
}
