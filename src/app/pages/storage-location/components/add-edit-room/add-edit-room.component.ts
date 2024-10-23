import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NotificationPopupService } from '../../../../shared/services/notification-popup/notification-popup.service';
import { MaterialModule } from '../../../../material.module';
import { MatDialogModule } from '@angular/material/dialog';
import { RoomManagementService } from '../../services/room-management.service';
import { RoomData } from '../../models/storage-location.interface';
import { take } from 'rxjs';
import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';

@Component({
  selector: 'app-add-edit-room',
  standalone: true,
  imports: [MaterialModule, ReactiveFormsModule, MatDialogModule],
  templateUrl: './add-edit-room.component.html',
  styleUrl: './add-edit-room.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddEditRoomComponent {
  private readonly MAX_LENGTH = 300;
  private fb = inject(FormBuilder);
  private roomManagementService = inject(RoomManagementService);
  private notificationPopupService = inject(NotificationPopupService);

  public roomForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.maxLength(this.MAX_LENGTH)]],
    description: [''],
  });

  public hasError(label: string, error: string): boolean | undefined {
    return this.roomForm.get(label)?.hasError(error);
  }

  public getErrorMessage(label: string, error: string): string {
    return this.roomForm.get(label)?.getError(error);
  }

  public onSave(): void {
    if (this.roomForm.valid) {
      const roomData: RoomData = this.roomForm.value;

      this.roomManagementService
        .addNewRoom(roomData)
        .pipe(take(1))
        .subscribe({
          next: () => {
            this.notificationPopupService.success({
              title: 'Success',
              message: 'Room is added successfully',
            });
          },
          error: (error: HttpErrorResponse) => {
            if (
              error.status == HttpStatusCode.BadRequest ||
              error.status == HttpStatusCode.Conflict
            ) {
              this.roomForm
                .get('name')
                ?.setErrors({ serverError: error.error.message });
            } else {
              this.notificationPopupService.error({
                title: 'Error',
                message: error.error.message,
              });
            }
          },
        });
    }
  }
}
