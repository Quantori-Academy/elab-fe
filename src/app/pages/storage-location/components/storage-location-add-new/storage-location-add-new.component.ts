import { Component, Inject, inject, OnInit } from '@angular/core';
import { MaterialModule } from '../../../../material.module';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { StorageLocationService } from '../../services/storage-location.service';
import { AsyncPipe } from '@angular/common';
import {
  NewStorageLocation,
  StorageLocationItem,
} from '../../models/storage-location.interface';
import { take } from 'rxjs';
import { NotificationPopupService } from '../../../../shared/services/notification-popup/notification-popup.service';
import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';

@Component({
  selector: 'app-storage-location-add-new',
  standalone: true,
  imports: [MaterialModule, ReactiveFormsModule, MatDialogModule, AsyncPipe],
  templateUrl: './storage-location-add-new.component.html',
  styleUrl: './storage-location-add-new.component.scss',
})
export class StorageLocationAddNewComponent implements OnInit {
  readonly MAX_LENGTH = 300;
  readonly DEBOUNCE_TIME = 300;

  private fb = inject(FormBuilder);
  private storageLocationService = inject(StorageLocationService);
  private notificationPopupService = inject(NotificationPopupService);
  private dialogRef = inject(MatDialogRef<StorageLocationAddNewComponent>);

  public storageForm: FormGroup = this.fb.group({
    roomName: ['', [Validators.required]],
    name: ['', [Validators.required, Validators.maxLength(this.MAX_LENGTH)]],
    description: [''],
  });
  public filteredRooms$ = this.storageLocationService.listOfRooms;

  public originalValues: NewStorageLocation | undefined;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: StorageLocationItem | undefined
  ) {}

  ngOnInit(): void {
    if (this.data) {
      const editedData: NewStorageLocation = {
        roomName: this.data.room.name,
        name: this.data.name,
        description: this.data.description,
      };
      this.storageForm.patchValue(editedData);
      this.originalValues = { ...editedData };
    }
  }

  public hasError(label: string, error: string): boolean | undefined {
    return this.storageForm.get(label)?.hasError(error);
  }

  public getErrorMessage(label: string, error: string): string {
    return this.storageForm.get(label)?.getError(error);
  }

  hasFormChanged(): boolean {
    if (!this.originalValues) return false;
    const currentValues = this.storageForm.value;
    return (
      currentValues.roomName !== this.originalValues.roomName ||
      currentValues.name !== this.originalValues.name ||
      currentValues.description !== this.originalValues.description
    );
  }

  onSave() {
    if (this.storageForm.valid) {
      const formValue: NewStorageLocation = this.storageForm.value;

      if (this.data) {
        console.log(formValue);
        this.dialogRef.close(false);
      } else {
        this.storageLocationService
          .addNewStorageLocation(formValue)
          .pipe(take(1))
          .subscribe({
            next: () => {
              this.notificationPopupService.success({
                title: 'Success',
                message: 'Storage Location added',
              });
              this.dialogRef.close(true);
            },
            error: (error: HttpErrorResponse) => {
              switch (error.status) {
                case HttpStatusCode.BadRequest:
                  this.storageForm
                    .get('roomName')
                    ?.setErrors({ roomError: error.error.message });
                  break;
                case HttpStatusCode.NotFound:
                  this.storageForm
                    .get('roomName')
                    ?.setErrors({ roomNotFound: error.error.message });
                  break;
                case HttpStatusCode.Conflict:
                  this.storageForm
                    .get('name')
                    ?.setErrors({ uniqueName: error.error.message });
                  break;
                default:
                  this.notificationPopupService.error({
                    title: 'Error',
                    message: error.error.message,
                  });
                  break;
              }
            },
          });
      }
    }
  }
}
