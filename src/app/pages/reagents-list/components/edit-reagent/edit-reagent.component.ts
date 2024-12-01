import { ChangeDetectionStrategy, Component, Inject, inject } from '@angular/core';
import { MaterialModule } from '../../../../material.module';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ReagentsService } from '../../../../shared/services/reagents.service';
import { StorageLocationService } from '../../../storage-location/services/storage-location.service';
import { StorageLocationQueryService } from '../../../storage-location/services/storage-location-query.service';
import { NotificationPopupService } from '../../../../shared/services/notification-popup/notification-popup.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Subject, takeUntil } from 'rxjs';
import { storageLocationAutoCompleteValidator } from '../../../../shared/validators/storage-location-autocomplete.validator';
import { StorageLocationColumn } from '../../../storage-location/models/storage-location.enum';
import { StorageLocationItem } from '../../../storage-location/models/storage-location.interface';
import { Reagent } from '../../../../shared/models/reagent-model';
import { HttpErrorResponse } from '@angular/common/http';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-edit-reagent',
  standalone: true,
  imports: [MaterialModule, ReactiveFormsModule, AsyncPipe],
  providers: [StorageLocationService, StorageLocationQueryService],
  templateUrl: './edit-reagent.component.html',
  styleUrl: './edit-reagent.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditReagentComponent {
  private fb = inject(FormBuilder);
  private reagentsService = inject(ReagentsService);
  private storageLocationService = inject(StorageLocationService);
  private storageLocationQueryService = inject(StorageLocationQueryService);
  private notificationsService = inject(NotificationPopupService);
  private dialogRef = inject(MatDialogRef<EditReagentComponent>);
  public storageLocations$ = this.storageLocationService.searchStorageLocationByName();
  private destroy$ = new Subject<void>();

  public reagentRequestForm!: FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) public editionData: Reagent
  ) {
    this. reagentRequestForm = this.fb.group({
      quantityLeft: [this.editionData.quantityLeft, Validators.required],
      storageLocation: [
        {
          id: this.editionData.id,
          name: this.editionData.storage.name,
          room: { name: this.editionData.storage.room.name },
        },
        [Validators.required, storageLocationAutoCompleteValidator()],
      ],
      storageId: [this.editionData.id, Validators.required],
    });
  }

  public hasError(label: string, error: string): boolean | undefined {
    return this.reagentRequestForm.get(label)?.hasError(error);
  }

  displayFn = (option: StorageLocationItem): string => {
    this.reagentRequestForm.get('storageId')?.setValue(option.id);
    return option ? `${option.room.name} ${option.name}` : '';
  };

  onRoomNameChange($event: Event) {
    const value = ($event.target as HTMLInputElement).value;

    this.storageLocationQueryService.nameFilterSubject.next({
      value,
      column: StorageLocationColumn.FullPath,
    });
  }

  onSubmit() {
    console.log(this.reagentRequestForm.value)
    if (this.reagentRequestForm.valid) {
      const { quantityLeft, storageId }  = this.reagentRequestForm.value as {quantityLeft: number, storageId: number};
      const editedValue = { quantityLeft, storageId}

      this.reagentsService.editReagent(this.editionData.id!, editedValue)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.notificationsService.success({
              title: 'Success',
              message: `${this.editionData.category} edited successfully!`,
              duration: 3000,
            });
            this.dialogRef.close(true)
          },
          error: (error: HttpErrorResponse) => {
            this.notificationsService.error({
              title: 'Error',
              message: error.error.message,
              duration: 4000,
            });
          },
       });
    }
  }
}
