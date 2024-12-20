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
  Category,
  SelectedReagentSample,
  SampleRequestError,
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
import { Observable, Subject, take, takeUntil } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { AddReagentSampleComponent } from '../add-reagent-sample/add-reagent-sample.component';
import { MoleculeStructureComponent } from '../../../../shared/components/molecule-structure/molecule-structure.component';
import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { AddStructureComponent } from '../../../../shared/components/structure-editor/add-structure/add-structure.component';
import { StorageLocationQueryService } from '../../../storage-location/services/storage-location-query.service';
import { StorageLocationColumn } from '../../../storage-location/models/storage-location.enum';
import {
  StorageLocationItem,
  StorageLocationListData,
} from '../../../storage-location/models/storage-location.interface';
import { storageLocationAutoCompleteValidator } from '../../../../shared/validators/storage-location-autocomplete.validator';
import { DISPLAY_EXTENSION } from '../../../../shared/units/display.units';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-create-reagent',
  standalone: true,
  providers: [
    provideNativeDateAdapter(),
    StorageLocationService,
    StorageLocationQueryService,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MaterialModule,
    MoleculeStructureComponent,
    TranslateModule,
  ],
  templateUrl: './create-reagent.component.html',
  styleUrl: './create-reagent.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateReagentComponent implements OnInit, OnDestroy {
  private fb = inject(FormBuilder);
  private reagentsService = inject(ReagentsService);
  private storageLocationService = inject(StorageLocationService);
  private storageLocationQueryService = inject(StorageLocationQueryService);
  private notificationsService = inject(NotificationPopupService);
  private activatedRoute = inject(ActivatedRoute);
  private router = inject(Router);
  private dialog = inject(MatDialog);
  private displayExtension = inject(DISPLAY_EXTENSION);
  private destroy$ = new Subject<void>();
  private translate = inject(TranslateService);

  public isSample = false;
  public selectedReagentSample = signal<SelectedReagentSample[]>([]);
  public hasReagentSampleError = signal(false);
  public reagentRequestForm!: FormGroup;
  public storageLocations$?: Observable<StorageLocationListData>;
  public isTablet = signal(false);

  get itemType(): string {
    return this.isSample
      ? this.translate.instant('CREATE_REAGENT.SAMPLE')
      : this.translate.instant('CREATE_REAGENT.REAGENT');
  }

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
    this.storageLocations$ =
      this.storageLocationService.searchStorageLocationByName();
    this.displayExtension
      .pipe(takeUntil(this.destroy$))
      .subscribe((display) => this.isTablet.set(display.isTablet));
  }

  public initializeForm(): void {
    this.reagentRequestForm = this.fb.group({
      name: ['', Validators.required],
      description: [null],
      expirationDate: [null],
      structure: [null],
      quantityUnit: ['', Validators.required],
      totalQuantity: [null, Validators.required],
      storageLocation: [
        '',
        [Validators.required, storageLocationAutoCompleteValidator()],
      ],
      storageId: [null as number | null, Validators.required],
      ...(this.isSample
        ? {
            usedReagentSample: [[]],
          }
        : {
            quantityLeft: [null, Validators.required],
            casNumber: [
              null,
              [Validators.minLength(5), Validators.maxLength(10)],
            ],
            producer: [null],
            catalogId: [null],
            catalogLink: [
              null,
              [Validators.pattern(/^(http|https):\/\/[^ "]+$/)],
            ],
            pricePerUnit: [null],
          }),
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

    if (!usedReagentSampleControl?.value.length) {
      if (!hasRequiredError) {
        usedReagentSampleControl?.setValidators([Validators.required]);
      }
    } else {
      usedReagentSampleControl?.clearValidators();
    }

    usedReagentSampleControl?.updateValueAndValidity();
  }

  public setSampleRequestError(errorReagents: SampleRequestError[]) {
    errorReagents.forEach((errorReagent) => {
      const errorSelectedReagent = this.selectedReagentSample().find(
        (reagent) => reagent.reagentId === errorReagent.reagentId
      );
      if (errorSelectedReagent) {
        errorSelectedReagent.errorMessage = errorReagent.errorMessage;
      }
    });
  }

  public openAddReagentDialog() {
    this.dialog
      .open(AddReagentSampleComponent, {
        height: '600px',
        width: this.isTablet() ? '600px' : '800px',
        maxWidth: this.isTablet() ? '600px' : '800px',
        maxHeight: '600px',
        data: { selectedReagentSample: [...this.selectedReagentSample()] },
      })
      .afterClosed()
      .pipe(take(1))
      .subscribe((result: SelectedReagentSample[]) => {
        if (result) {
          this.selectedReagentSample.set(result);
          this.reagentRequestForm
            .get('usedReagentSample')
            ?.setValue(result.map(this.asSelectedReagentSample));
          this.setRequiredErrorReagents();
          this.hasReagentSampleError.set(false);
        }
      });
  }

  onSubmit() {
    if (this.isSample) {
      this.setRequiredErrorReagents();
    }
    if (this.reagentRequestForm.valid) {
      let formRawValue = { ...this.reagentRequestForm.value };
      delete formRawValue.storageLocation;
      // Validate expirationDate and format it as needed
      if (formRawValue.expirationDate) {
        const expirationDateValue = new Date(formRawValue.expirationDate);
        const formattedExpirationDate = expirationDateValue.toISOString();
        const finalExpirationDate = formattedExpirationDate.split('.')[0] + 'Z';
        formRawValue = {
          ...formRawValue,
          expirationDate: finalExpirationDate,
        };
      }
      if (this.isSample) {
        formRawValue.quantityLeft = formRawValue.totalQuantity;
      }

      const formRequest = this.isSample
        ? this.reagentsService.createSample(formRawValue)
        : this.reagentsService.createReagent(formRawValue);
      formRequest.pipe(takeUntil(this.destroy$)).subscribe({
        next: () => {
          this.notificationsService.success({
            title: this.translate.instant('CREATE_REAGENT.SUCCESS_TITLE'),
            message: this.translate.instant('CREATE_REAGENT.SUCCESS_MESSAGE', {
              item: this.translate.instant(
                `CATEGORIES.${this.isSample ? 'SAMPLE' : 'REAGENT'}`
              ),
            }),
            duration: 3000,
          });
          this.redirectToReagentList();
        },
        error: (error: HttpErrorResponse) => {
          if (this.isSample && error.status === HttpStatusCode.BadRequest) {
            this.hasReagentSampleError.set(true);
            this.setSampleRequestError(error.error.details);
          }
          this.notificationsService.error({
            title: this.translate.instant('CREATE_REAGENT.ERROR_TITLE'),
            message: error.error.message,
            duration: 4000,
          });
        },
      });
    }
  }

  openStructureEditor() {
    const dialogRef = this.dialog.open(AddStructureComponent, {
      width: '650px',
      height: '600px',
      minWidth: '650px',
      minHeight: '600px',
      restoreFocus: false,
      data: { smiles: this.reagentRequestForm.get('structure')?.value },
    });

    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe((result) => {
        if (result) {
          this.reagentRequestForm.patchValue({ structure: result });
        }
      });
  }

  public redirectToReagentList() {
    return this.router.navigate(['reagents']);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
