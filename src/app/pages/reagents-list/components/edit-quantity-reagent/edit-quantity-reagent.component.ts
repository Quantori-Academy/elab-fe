import { Component, Inject, inject, OnDestroy, OnInit } from '@angular/core';
import { MaterialModule } from '../../../../material.module';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ReagentsService } from '../../../../shared/services/reagents.service';
import { NotificationPopupService } from '../../../../shared/services/notification-popup/notification-popup.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Subject, takeUntil } from 'rxjs';
import { Reagent } from '../../../../shared/models/reagent-model';
import { HttpErrorResponse } from '@angular/common/http';
import { AsyncPipe } from '@angular/common';
import { TranslateService, TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-edit-quantity-reagent',
  standalone: true,
  imports: [MaterialModule, ReactiveFormsModule, AsyncPipe, TranslateModule],
  templateUrl: './edit-quantity-reagent.component.html',
  styleUrls: ['./edit-quantity-reagent.component.scss'],
})
export class EditQuantityReagentComponent implements OnInit, OnDestroy {
  private fb = inject(FormBuilder);
  private reagentsService = inject(ReagentsService);
  private notificationsService = inject(NotificationPopupService);
  private dialogRef = inject(MatDialogRef<EditQuantityReagentComponent>);
  private destroy$ = new Subject<void>();
  private translate = inject(TranslateService);

  public reagentRequestForm!: FormGroup;
  public categoryTranslated!: string;

  constructor(@Inject(MAT_DIALOG_DATA) public editionData: Reagent) {
    this.reagentRequestForm = this.fb.group({
      quantityLeft: [
        this.editionData.quantityLeft,
        [Validators.required, Validators.pattern(/^[0-9]+$/)],
      ],
    });
  }

  ngOnInit(): void {
    this.categoryTranslated = this.translate.instant(
      'CATEGORIES.' + this.editionData.category.toUpperCase()
    );
  }

  public hasError(label: string, error: string): boolean | undefined {
    return this.reagentRequestForm.get(label)?.hasError(error);
  }

  onSubmit() {
    if (this.reagentRequestForm.valid) {
      const { quantityLeft } = this.reagentRequestForm.value as {
        quantityLeft: number;
      };
      const editedValue = { quantityLeft };

      this.reagentsService
        .editReagent(this.editionData.id!, editedValue)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (updatedData) => {
            const actionKey =
              quantityLeft === 0
                ? 'EDIT_QUANTITY_REAGENT.SUCCESS_MESSAGE_CONSUMED'
                : 'EDIT_QUANTITY_REAGENT.SUCCESS_MESSAGE_EDITED';

            this.notificationsService.success({
              title: this.translate.instant(
                'EDIT_QUANTITY_REAGENT.SUCCESS_TITLE'
              ),
              message: this.translate.instant(actionKey, {
                category: this.categoryTranslated,
              }),
              duration: 3000,
            });
            this.dialogRef.close(updatedData);
          },
          error: (error: HttpErrorResponse) => {
            this.notificationsService.error({
              title: this.translate.instant(
                'EDIT_QUANTITY_REAGENT.ERROR_TITLE'
              ),
              message: error.error.message,
              duration: 4000,
            });
          },
        });
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
