import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  inject,
  OnDestroy,
} from '@angular/core';
import {
  Unit,
  UnitLabels,
  ReagentRequest,
  Category,
} from '../../../../shared/models/reagent-model';
import { CommonModule } from '@angular/common';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { provideNativeDateAdapter } from '@angular/material/core';
import { ReagentsService } from '../../../../shared/services/reagents.service';
import { StorageLocationService } from '../../../storage-location/services/storage-location.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NotificationPopupService } from '../../../../shared/services/notification-popup/notification-popup.service';
import { MaterialModule } from '../../../../material.module';
import { Subscription } from 'rxjs';
import { StorageLocationItem } from '../../../storage-location/models/storage-location.interface';

@Component({
  selector: 'app-new-reagent-form',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [CommonModule, ReactiveFormsModule, MaterialModule],
  templateUrl: './new-reagent-form.component.html',
  styleUrls: ['./new-reagent-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewReagentFormComponent implements OnDestroy {
  private fb = inject(FormBuilder);
  private reagentsService = inject(ReagentsService);
  private storageLocationService = inject(StorageLocationService); // Use StorageLocationService
  private notificationsService = inject(NotificationPopupService);
  private storageSubscription: Subscription | null = null;

  errorMessage = '';
  units = Object.keys(Unit).map((key) => ({
    value: Unit[key as keyof typeof Unit],
    viewValue: UnitLabels[Unit[key as keyof typeof Unit]],
  }));

  categories = Object.keys(Category).map((key) => ({
    value: Category[key as keyof typeof Category],
    viewValue: key,
  }));

  reagentRequestForm = this.fb.group({
    name: ['', Validators.required],
    category: [Category, Validators.required],
    structure: [''],
    casNumber: [
      '',
      [Validators.required, Validators.minLength(5), Validators.maxLength(10)],
    ],
    producer: ['', Validators.required],
    catalogId: ['', Validators.required],
    catalogLink: [
      '',
      [Validators.required, Validators.pattern(/^(http|https):\/\/[^ "]+$/)],
    ],
    pricePerUnit: [null, Validators.required],
    quantityUnit: ['', Validators.required],
    totalQuantity: [null, Validators.required],
    description: ['', Validators.required],
    quantityLeft: [null, Validators.required],
    expirationDate: ['', Validators.required],
    storageLocation: ['', Validators.required],
    storageId: [null as number | null],
  });

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { structure: string },
    private dialogRef: MatDialogRef<NewReagentFormComponent>
  ) {}

  // Use the first service (StorageLocationService) to fetch storage data
  onRoomNameChange() {
    const storageName = this.reagentRequestForm.get('storageLocation')?.value;

    if (storageName) {
      // Unsubscribe from previous subscription to avoid memory leaks
      if (this.storageSubscription) {
        this.storageSubscription.unsubscribe();
      }

      // Fetch the list of storages by storage location name
      this.storageSubscription = this.storageLocationService
        .getListStorageLocation()
        .subscribe({
          next: (storages: StorageLocationItem[]) => {
            const matchingStorage = storages.find(
              (storage) =>
                storage.name.toLowerCase() === storageName.toLowerCase()
            );

            if (matchingStorage) {
              // Patch the storageId in the form
              this.reagentRequestForm.patchValue({
                storageId: matchingStorage.id,
              });
              console.log(
                'Storage ID:',
                this.reagentRequestForm.get('storageId')?.value
              );
            } else {
              this.errorMessage = `No matching storage found for storage name: ${storageName}`;
              console.warn(
                'No matching storage found for storage name:',
                storageName
              );
            }
          },
          error: (error) => {
            console.error('Error fetching storages:', error);
            this.errorMessage = 'Failed to fetch storages. Please try again.';
          },
        });
    }
  }

  ngOnDestroy() {
    if (this.storageSubscription) {
      this.storageSubscription.unsubscribe();
    }
  }

  onSubmit() {
    if (this.reagentRequestForm.valid) {
      const formRawValue = { ...this.reagentRequestForm.value };

      // Validate expirationDate and format it as needed
      if (formRawValue.expirationDate) {
        const expirationDateValue = new Date(formRawValue.expirationDate);
        const formattedExpirationDate = expirationDateValue.toISOString();
        const finalExpirationDate = formattedExpirationDate.split('.')[0] + 'Z';

        delete formRawValue.storageLocation;

        const formValue = {
          ...formRawValue,
          expirationDate: finalExpirationDate,
          storageId: formRawValue.storageId,
        } as ReagentRequest;

        console.log('Form Value to Submit:', formValue);

        this.reagentsService.createReagent(formValue).subscribe({
          next: (resp) => {
            console.log('Reagent created successfully:', resp);
            this.notificationsService.success({
              title: 'Success',
              message: 'Reagent created successfully!',
              duration: 3000,
            });
            this.dialogRef.close(true);
          },
          error: (error) => {
            console.error('Error creating reagent:', error);
            this.notificationsService.error({
              title: 'Error',
              message: 'Failed to create reagent. Please try again.',
              duration: 3000,
            });
          },
        });
      } else {
        console.error('Expiration date is not defined or invalid.');
      }
    } else {
      console.log('Form is invalid');
    }
  }

  onClose(): void {
    this.dialogRef.close();
  }
}
