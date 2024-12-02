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
import { AsyncPipe } from '@angular/common';
import { RoomData } from '../../models/storage-location.interface';
import { catchError, map, Observable, of, take, tap } from 'rxjs';
import { NotificationPopupService } from '../../../../shared/services/notification-popup/notification-popup.service';
import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { DeleteConfirmComponent } from '../../../../shared/components/delete-confirm/delete-confirm.component';
import { RbacService } from '../../../../auth/services/authentication/rbac.service';
import { PageEvent } from '@angular/material/paginator';
import { PAGE_SIZE_OPTIONS } from '../../../../shared/units/variables.units';
import { TableLoaderSpinnerComponent } from '../../../../shared/components/table-loader-spinner/table-loader-spinner.component';
import { NoDataComponent } from '../../../../shared/components/no-data/no-data.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-room-management',
  standalone: true,
  imports: [
    MaterialModule,
    MatTableModule,
    MatSortModule,
    MatSelectModule,
    AsyncPipe,
    // DatePipe,
    TableLoaderSpinnerComponent,
    NoDataComponent,
    TranslateModule,
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
  private translate = inject(TranslateService);

  public displayedColumns = ['room', 'description', 'storages'];
  public pageSizeOptions = inject(PAGE_SIZE_OPTIONS);
  public roomList$ = this.roomManagementService.roomData$;
  public isAdmin = false;

  ngOnInit(): void {
    this.defineIsAdmin();
  }
  private defineIsAdmin() {
    this.isAdmin = this.rbcService.isAdmin();
    if (this.isAdmin) {
      this.displayedColumns.push('actions');
    }
  }

  public openDialog() {
    this.dialog.open(AddEditRoomComponent, { width: '400px' });
  }

  public onEdit(element: RoomData) {
    this.dialog.open(AddEditRoomComponent, {
      data: element,
      width: '400px',
    });
  }

  public onDelete(element: RoomData) {
    this.dialog.open(DeleteConfirmComponent, {
      data: {
        message: this.translate.instant('ROOM_MANAGEMENT.DELETE_CONFIRMATION'),
        deleteHandler: () => this.deleteHandler(element.id!),
      },
      width: '400px',
    });
  }

  public deleteHandler(roomId: number): Observable<boolean> {
    return this.roomManagementService.deleteRoom(roomId).pipe(
      take(1),
      tap({
        next: () => {
          this.notificationPopupService.success({
            title: this.translate.instant('ROOM_MANAGEMENT.SUCCESS_TITLE'),
            message: this.translate.instant('ROOM_MANAGEMENT.SUCCESS_MESSAGE'),
          });
        },
        error: (error: HttpErrorResponse) => {
          if (error.status === HttpStatusCode.Conflict) {
            this.notificationPopupService.warning({
              title: this.translate.instant('ROOM_MANAGEMENT.WARNING_TITLE'),
              message: error.error.message,
              duration: 4000,
            });
          } else {
            this.notificationPopupService.error({
              title: this.translate.instant('ROOM_MANAGEMENT.ERROR_TITLE'),
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
    console.log($event);
  }
}
