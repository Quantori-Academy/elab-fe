import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  inject,
  OnInit,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NotificationPopupService } from '../../../../shared/services/notification-popup/notification-popup.service';
import { MaterialModule } from '../../../../material.module';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
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
export class AddEditRoomComponent implements OnInit {
  private readonly MAX_LENGTH = 300;
  private fb = inject(FormBuilder);
  private roomManagementService = inject(RoomManagementService);
  private notificationPopupService = inject(NotificationPopupService);
  private dialogRef = inject(MatDialogRef<AddEditRoomComponent>);

  public roomForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.maxLength(this.MAX_LENGTH)]],
    description: [''],
  });
  public originalValues: RoomData | undefined;

  constructor(@Inject(MAT_DIALOG_DATA) public editionData?: RoomData) {}

  ngOnInit(): void {
    if (this.editionData) {
      this.roomForm.patchValue(this.editionData);
    }
  }

  public hasError(label: string, error: string): boolean | undefined {
    return this.roomForm.get(label)?.hasError(error);
  }

  public getErrorMessage(label: string, error: string): string {
    return this.roomForm.get(label)?.getError(error);
  }

  hasFormChanged(): boolean {
    if (!this.originalValues) return false;
    const currentValues = this.roomForm.value;
    return (
      currentValues.name !== this.originalValues.name ||
      currentValues.description !== this.originalValues.description
    );
  }

  public onSave(): void {
    if (this.roomForm.valid) {
      const roomData: RoomData = this.roomForm.value;
      if (this.editionData) {
        this.updateRoom(roomData);
      } else {
        this.createRoom(roomData);
      }
    }
  }

  private createRoom(roomData: RoomData) {
    this.roomManagementService
      .addNewRoom(roomData)
      .pipe(take(1))
      .subscribe({
        next: () => {
          this.showSuccessMessage('Room is added successfully');
          this.dialogRef.close(true);
        },
        error: (error: HttpErrorResponse) => this.handleError(error),
      });
  }

  private updateRoom(roomData: RoomData) {
    this.roomManagementService
      .editRoom(this.editionData!.id!, roomData)
      .pipe(take(1))
      .subscribe({
        next: () => {
          this.showSuccessMessage('Room is edited successfully');
          this.dialogRef.close(true);
        },
        error: (error: HttpErrorResponse) => this.handleError(error),
      });
  }

  private handleError(error: HttpErrorResponse) {
    const nameControl = this.roomForm.get('name');
    if (
      [
        HttpStatusCode.BadRequest,
        HttpStatusCode.Conflict,
        HttpStatusCode.NotFound,
      ].includes(error.status)
    ) {
      nameControl?.setErrors({ serverError: error.error.message });
    } else {
      this.notificationPopupService.error({
        title: 'Error',
        message: error.error.message,
      });
    }
  }

  private showSuccessMessage(message: string) {
    this.notificationPopupService.success({
      title: 'Success',
      message,
    });
  }
}
