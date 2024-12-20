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
import { RoomManagementService } from '../../services/room-management.service';
import { TranslateService, TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-add-edit-storage',
  standalone: true,
  imports: [
    MaterialModule,
    ReactiveFormsModule,
    MatDialogModule,
    AsyncPipe,
    TranslateModule,
  ],
  templateUrl: './add-edit-storage.component.html',
  styleUrl: './add-edit-storage.component.scss',
})
export class AddEditStorageComponent implements OnInit {
  readonly MAX_LENGTH = 300;
  readonly DEBOUNCE_TIME = 300;

  private fb = inject(FormBuilder);
  private storageLocationService = inject(StorageLocationService);
  private roomManagementService = inject(RoomManagementService);
  private notificationPopupService = inject(NotificationPopupService);
  private dialogRef = inject(MatDialogRef<AddEditStorageComponent>);
  private translate = inject(TranslateService);

  public storageForm: FormGroup = this.fb.group({
    roomName: ['', [Validators.required]],
    name: ['', [Validators.required, Validators.maxLength(this.MAX_LENGTH)]],
    description: [''],
  });
  public filteredRooms$ = this.roomManagementService.getListOfRooms();

  public originalValues: NewStorageLocation | undefined;

  constructor(
    @Inject(MAT_DIALOG_DATA) public editionData: StorageLocationItem | undefined
  ) {}

  ngOnInit(): void {
    if (this.editionData) {
      const editedData: NewStorageLocation = {
        roomName: this.editionData.room.name,
        name: this.editionData.name,
        description: this.editionData.description,
      };
      this.storageForm.patchValue(editedData);
      this.originalValues = { ...editedData };
      this.storageForm.get('roomName')?.disable();
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
      currentValues.name !== this.originalValues.name ||
      currentValues.description !== this.originalValues.description
    );
  }

  onSave() {
    if (this.storageForm.valid) {
      const formValue: NewStorageLocation = this.storageForm.value;

      if (this.editionData) {
        this.updateStorageLocation(formValue);
      } else {
        this.createStorageLocation(formValue);
      }
    }
  }

  createStorageLocation(formValue: NewStorageLocation) {
    this.storageLocationService
      .addNewStorageLocation(formValue)
      .pipe(take(1))
      .subscribe({
        next: () => {
          this.notificationPopupService.success({
            title: this.translate.instant('ADD_EDIT_STORAGE.SUCCESS_TITLE'),
            message: this.translate.instant('ADD_EDIT_STORAGE.SUCCESS_ADD'),
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
                title: this.translate.instant('ADD_EDIT_STORAGE.ERROR_TITLE'),
                message: error.error.message,
              });
              break;
          }
        },
      });
  }

  updateStorageLocation(formValue: NewStorageLocation) {
    const { name, description } = formValue;
    this.storageLocationService
      .editStorageLocation(this.editionData!.id, { name, description })
      .pipe(take(1))
      .subscribe({
        next: () => {
          this.notificationPopupService.success({
            title: this.translate.instant('ADD_EDIT_STORAGE.SUCCESS_TITLE'),
            message: this.translate.instant('ADD_EDIT_STORAGE.SUCCESS_EDIT'),
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
            case HttpStatusCode.Conflict:
              this.storageForm
                .get('name')
                ?.setErrors({ uniqueName: error.error.message });
              break;
            default:
              this.notificationPopupService.error({
                title: this.translate.instant('ADD_EDIT_STORAGE.ERROR_TITLE'),
                message: error.error.message,
              });
              break;
          }
        },
      });
  }
}
