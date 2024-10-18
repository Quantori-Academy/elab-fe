import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatGridListModule } from '@angular/material/grid-list';
import { provideNativeDateAdapter } from '@angular/material/core';
import { ReagentsService } from '../../../shared/services/reagents.service';
import { ReagentRequest } from '../../../shared/models/reagent-model';
import { StorageService } from '../../../shared/services/storage.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { NotificationPopupService } from '../../../shared/services/notification-popup/notification-popup.service';
import { MaterialModule } from '../../../material.module';

@Component({
  selector: 'app-new-reagent-form',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatGridListModule,
    MatDatepickerModule,
    MaterialModule,
  ],
  templateUrl: './new-reagent-form.component.html',
  styleUrl: './new-reagent-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewReagentFormComponent {
  private fb = inject(FormBuilder);
  private reagentsService = inject(ReagentsService);
  private storageService = inject(StorageService);
  private notificationsService = inject(NotificationPopupService);
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { structure: string },
    private dialogRef: MatDialogRef<NewReagentFormComponent>
  ) {}

  // will move this outside the component later
  units = [
    { value: 'mol', viewValue: 'Molar (mol)' },
    { value: 'mmol', viewValue: 'Millimole (mmol)' },
    { value: 'µg', viewValue: 'Microgram (µg)' },
    { value: 'mg', viewValue: 'Milligram (mg)' },
    { value: 'g', viewValue: 'Gram (g)' },
    { value: 'kg', viewValue: 'Kilogram (kg)' },
    { value: 'L', viewValue: 'Liter (L)' },
    { value: 'mL', viewValue: 'Milliliter (mL)' },
    { value: 'cm³', viewValue: 'Cubic Centimeter (cm³)' },
    { value: 'M', viewValue: 'Molarity (M)' },
    { value: 'percent', viewValue: 'Percent (%)' },
    { value: 'ppm', viewValue: 'Parts per Million (ppm)' },
    { value: 'ppb', viewValue: 'Parts per Billion (ppb)' },
    { value: 'g/mL', viewValue: 'Density (g/mL)' },
  ];

  urlPattern = /^(http|https):\/\/[^ "]+$/;

  reagentRequestForm = this.fb.group({
    name: ['', Validators.required],
    casNumber: [
      '',
      [Validators.required, Validators.minLength(5), Validators.maxLength(10)],
    ],
    producer: ['', Validators.required],
    catalogId: ['', Validators.required],
    catalogLink: [
      '',
      [Validators.required, Validators.pattern(this.urlPattern)],
    ],
    pricePerUnit: [null, Validators.required],
    quantityUnit: ['', Validators.required],
    totalQuantity: [null, Validators.required],
    description: ['', Validators.required],
    quantityLeft: [null, Validators.required],
    expirationDate: ['', Validators.required],
    storageLocation: ['', Validators.required],
    storageId: [''],
  });

  // by typeing storage's name we fetch it's object, then use id to fill storageId field in newRequestForm;
  onRoomNameChange() {
    const storageName = this.reagentRequestForm.get('storageLocation')?.value;

    if (storageName) {
      // Fetch the storage by storage name
      this.storageService.getStorageBy(storageName).subscribe({
        next: (response) => {
          console.log('API Response:', response);

          const matchingStorage = response['find'](
            (storage: Storage) =>
              storage['name'].toLowerCase() === storageName.toLowerCase()
          );

          if (matchingStorage) {
            console.log('Found matching storage:', matchingStorage);

            // Update the form with the storage ID

            if (matchingStorage.id) {
              this.reagentRequestForm.patchValue({
                storageId: matchingStorage.id,
              });

              console.log(
                'Storage ID:',
                this.reagentRequestForm.get('storageId')?.value
              );
            } else {
              console.error('No storage ID found in the response.');
            }
          } else {
            console.warn(
              'No matching storage found for storage name:',
              storageName
            );
          }
        },
        error: (error) => {
          console.error('Error fetching storage:', error);
        },
      });
    }
  }
  onSubmit() {
    if (this.reagentRequestForm.valid) {
      const formRawValue = { ...this.reagentRequestForm.value };

      // Checks if expirationDate is defined and valid
      if (formRawValue.expirationDate) {
        const expirationDateValue = new Date(formRawValue.expirationDate);
        const formattedExpirationDate = expirationDateValue.toISOString();
        const finalExpirationDate = formattedExpirationDate.split('.')[0] + 'Z';

        // deleting cuz request only needs id, not actual name of location
        delete formRawValue.storageLocation;

        const formValue = {
          ...formRawValue,
          expirationDate: finalExpirationDate,
          storageId: parseInt(formRawValue.storageId!, 10),
          pricePerUnit: formRawValue.pricePerUnit ?? 0, // Default to 0 if null or undefined
          totalQuantity: formRawValue.totalQuantity ?? 0, // Default to 0 if null or undefined
          quantityLeft: formRawValue.quantityLeft ?? 0,
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
