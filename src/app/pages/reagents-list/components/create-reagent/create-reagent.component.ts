import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnDestroy,
  OnInit,
  signal,
} from '@angular/core';
import {
  Unit,
  UnitLabels,
  ReagentRequest,
  Category,
  SelectedReagentSample,
} from '../../../../shared/models/reagent-model';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  Validators,
  ReactiveFormsModule,
  FormGroup,
} from '@angular/forms';
import { provideNativeDateAdapter } from '@angular/material/core';
import { ReagentsService } from '../../../../shared/services/reagents.service';
import { StorageLocationService } from '../../../storage-location/services/storage-location.service';
import { NotificationPopupService } from '../../../../shared/services/notification-popup/notification-popup.service';
import { MaterialModule } from '../../../../material.module';
import { map, Subscription, take } from 'rxjs';
import { StorageLocationItem } from '../../../storage-location/models/storage-location.interface';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { AddReagentSampleComponent } from '../add-reagent-sample/add-reagent-sample.component';
import { MoleculeStructureComponent } from '../../../../shared/components/molecule-structure/molecule-structure.component';

@Component({
  selector: 'app-create-reagent',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MaterialModule,
    MoleculeStructureComponent,
  ],
  templateUrl: './create-reagent.component.html',
  styleUrl: './create-reagent.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateReagentComponent implements OnInit, OnDestroy {
  private fb = inject(FormBuilder);
  private reagentsService = inject(ReagentsService);
  private storageLocationService = inject(StorageLocationService);
  private notificationsService = inject(NotificationPopupService);
  private activatedRoute = inject(ActivatedRoute);
  private router = inject(Router);
  public dialog = inject(MatDialog);
  private storageSubscription: Subscription | null = null;

  public isSample = false;
  public selectedReagentSample = signal<SelectedReagentSample[]>([]);
  public reagentRequestForm!: FormGroup;

  errorMessage = '';
  units = Object.keys(Unit).map((key) => ({
    value: Unit[key as keyof typeof Unit],
    viewValue: UnitLabels[Unit[key as keyof typeof Unit]],
  }));

  categories = Object.keys(Category).map((key) => ({
    value: Category[key as keyof typeof Category],
    viewValue: key,
  }));

  ngOnInit(): void {
    this.activatedRoute.data
      .pipe(take(1))
      .subscribe((data) => (this.isSample = data['isSample']));
    this.initializeForm();
  }

  public initializeForm(): void {
    this.reagentRequestForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      expirationDate: ['', Validators.required],
      structure: [''],
      casNumber: [
        '',
        [
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(10),
        ],
      ],
      quantityUnit: ['', Validators.required],
      totalQuantity: [null, Validators.required],
      quantityLeft: [null, Validators.required],
      storageLocation: ['', Validators.required],
      storageId: [null as number | null],
      ...(this.isSample
        ? {
            usedReagentSample: [[]],
          }
        : {
            producer: ['', Validators.required],
            catalogId: ['', Validators.required],
            catalogLink: [
              '',
              [
                Validators.required,
                Validators.pattern(/^(http|https):\/\/[^ "]+$/),
              ],
            ],
            pricePerUnit: [null, Validators.required],
          }),
    });
  }

  public hasError(label: string, error: string): boolean | undefined {
    return this.reagentRequestForm.get(label)?.hasError(error);
  }

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
        .pipe(map((storageData) => storageData.storages))
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

  public asSelectedReagentSample(reagent: SelectedReagentSample): {
    reagentId: number;
    quantityUsed: number;
  } {
    return {
      reagentId: reagent.reagentId,
      quantityUsed: reagent.quantityUsed,
    };
  }

  public setRequiredErrorReagents(): void {
    const hasRequiredError = this.hasError('usedReagentSample', 'required');
    const usedReagentSampleControl =
      this.reagentRequestForm.get('usedReagentSample');

    if (hasRequiredError) {
      usedReagentSampleControl?.setValidators([Validators.required]);
    } else {
      usedReagentSampleControl?.clearValidators();
    }

    usedReagentSampleControl?.updateValueAndValidity();
  }

  openAddReagentDialog() {
    this.dialog
      .open(AddReagentSampleComponent, {
        minWidth: '1000px',
        maxHeight: '700px',
        data: { selectedReagentSample: this.selectedReagentSample() },
      })
      .afterClosed()
      .pipe(take(1))
      .subscribe((result: SelectedReagentSample[]) => {
        if (result) {
          this.selectedReagentSample.set([...result]);
          this.reagentRequestForm
            .get('usedReagentSample')
            ?.setValue(result.map(this.asSelectedReagentSample));
          this.setRequiredErrorReagents();
        }
      });
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
          category: Category.reagent,
          expirationDate: finalExpirationDate,
          storageId: formRawValue.storageId,
        } as ReagentRequest;

        if (this.isSample) {
          if (formRawValue.usedReagentSample) {
            this.setRequiredErrorReagents();
          }
        }
        console.log('Form Value to Submit:', formValue);
        this.reagentsService.createReagent(formValue).subscribe({
          next: (resp) => {
            console.log('Reagent created successfully:', resp);
            this.notificationsService.success({
              title: 'Success',
              message: 'Reagent created successfully!',
              duration: 3000,
            });
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

  public redirectToReagentList() {
    return this.router.navigate(['reagents']);
  }

  ngOnDestroy() {
    if (this.storageSubscription) {
      this.storageSubscription.unsubscribe();
    }
  }
}
