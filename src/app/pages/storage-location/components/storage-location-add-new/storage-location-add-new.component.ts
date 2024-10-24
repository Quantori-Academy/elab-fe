import { Component, inject } from '@angular/core';
import { MaterialModule } from '../../../../material.module';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { StorageLocationService } from '../../services/storage-location.service';
import { AsyncPipe } from '@angular/common';
import { NewStorageLocation } from '../../models/storage-location.interface';
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
export class StorageLocationAddNewComponent {
  readonly MAX_LENGTH = 300;
  readonly DEBOUNCE_TIME = 300;

  private fb = inject(FormBuilder);
  private storageLocationService = inject(StorageLocationService);
  private notificationPopupService = inject(NotificationPopupService);
  private dialogRef = inject(MatDialogRef<StorageLocationAddNewComponent>);

  public addStorageForm: FormGroup = this.fb.group({
    roomName: ['', [Validators.required]],
    name: ['', [Validators.required, Validators.maxLength(this.MAX_LENGTH)]],
    description: [''],
  });
  public filteredRooms$ = this.storageLocationService.listOfRooms;

  public hasError(label: string, error: string): boolean | undefined {
    return this.addStorageForm.get(label)?.hasError(error);
  }

  public getErrorMessage(label: string, error: string): string {
    return this.addStorageForm.get(label)?.getError(error);
  }

  onSave() {
    if (this.addStorageForm.valid) {
      const formValue: NewStorageLocation = this.addStorageForm.value;

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
                this.addStorageForm
                  .get('roomName')
                  ?.setErrors({ roomError: error.error.message });
                break;
              case HttpStatusCode.NotFound:
                this.addStorageForm
                  .get('roomName')
                  ?.setErrors({ roomNotFound: error.error.message });
                break;
              case HttpStatusCode.Conflict:
                this.addStorageForm
                  .get('name')
                  ?.setErrors({ uniqueName: error.error.message });
                break;
              default:
                break;
            }
          },
        });
    }
  }
}
