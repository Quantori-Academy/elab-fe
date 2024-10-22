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
} from '../../../shared/models/reagent-model';
import { CommonModule } from '@angular/common';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatGridListModule } from '@angular/material/grid-list';
import {
  MatOptionModule,
  provideNativeDateAdapter,
} from '@angular/material/core';
import { ReagentsService } from '../../../shared/services/reagents.service';
import { StorageService } from '../../../shared/services/storage.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { NotificationPopupService } from '../../../shared/services/notification-popup/notification-popup.service';
import { MaterialModule } from '../../../material.module';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-new-reagent-form',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatGridListModule,
    MatOptionModule,
    MatDatepickerModule,
    MaterialModule,
  ],
  templateUrl: './new-reagent-form.component.html',
  styleUrl: './new-reagent-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewReagentFormComponent implements OnDestroy{
  private fb = inject(FormBuilder);
  private reagentsService = inject(ReagentsService);
  private storageService = inject(StorageService);
  private notificationsService = inject(NotificationPopupService);
  private storageSubscription: Subscription | null = null;


  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { structure: string },
    private dialogRef: MatDialogRef<NewReagentFormComponent>
  ) {}

  units = Object.keys(Unit).map((key) => ({
    value: Unit[key as keyof typeof Unit],
    viewValue: UnitLabels[Unit[key as keyof typeof Unit]],
  }));

  categories = Object.keys(Category).map((key) => ({
    value: Category[key as keyof typeof Category],
    viewValue: key,
  }));

  errorMessage = '';
  reagentRequestForm = this.fb.group({
    name: ['', Validators.required],
    category: [Category, Validators.required],
    structure: ['', Validators.required],
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
    storageId: [''],
  });

  // by typeing storage's name we fetch it's object, then use id to fill storageId field in newRequestForm;
  onRoomNameChange() {
    const storageName = this.reagentRequestForm.get('storageLocation')?.value;
  
    if (storageName) {
      // Unsubscribe from any previous subscription to avoid memory leaks
      if (this.storageSubscription) {
        this.storageSubscription.unsubscribe();
      }
  
      // Fetch the storage by storage name
      this.storageSubscription = this.storageService.getStorageBy(storageName).subscribe({
        next: (response) => {
          console.log('API Response:', response);
  
          const matchingStorage = response['find'](
            (storage: Storage) =>
              storage['name'].toLowerCase() === storageName.toLowerCase()
          );
  
          if (matchingStorage) {
            console.log('Found matching storage:', matchingStorage);
  
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
            this.errorMessage = `No matching storage found for storage name: ${storageName}`;
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
          storageId: parseInt(formRawValue.storageId!, 10),
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
