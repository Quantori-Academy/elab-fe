import { Component, Inject, inject } from '@angular/core';
import { MaterialModule } from '../../../../material.module';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ReagentsService } from '../../../../shared/services/reagents.service';
import { NotificationPopupService } from '../../../../shared/services/notification-popup/notification-popup.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Subject, takeUntil } from 'rxjs';
import { Reagent } from '../../../../shared/models/reagent-model';
import { HttpErrorResponse } from '@angular/common/http';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-edit-quantity-reagent',
  standalone: true,
  imports: [MaterialModule, ReactiveFormsModule, AsyncPipe],
  templateUrl: './edit-quantity-reagent.component.html',
  styleUrl: './edit-quantity-reagent.component.scss'
})
export class EditQuantityReagentComponent {
  private fb = inject(FormBuilder);
  private reagentsService = inject(ReagentsService);
  private notificationsService = inject(NotificationPopupService);
  private dialogRef = inject(MatDialogRef<EditQuantityReagentComponent>);
  private destroy$ = new Subject<void>();

  public reagentRequestForm!: FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) public editionData: Reagent
  ) {
    this.reagentRequestForm = this.fb.group({
      quantityLeft: [this.editionData.quantityLeft, Validators.required]
    });
  }

  public hasError(label: string, error: string): boolean | undefined {
    return this.reagentRequestForm.get(label)?.hasError(error);
  }

  onSubmit() {
    if (this.reagentRequestForm.valid) {
      const { quantityLeft } = this.reagentRequestForm.value as { quantityLeft: number};
      const editedValue = { quantityLeft };

      this.reagentsService.editReagent(this.editionData.id!, editedValue)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (updatedData) => {
            const action = quantityLeft === 0 ? 'is completely consumed' : 'edited successfully!';

            this.notificationsService.success({
              title: 'Success',
              message: `${this.editionData.category} ${action}`,
              duration: 3000,
            });
            this.dialogRef.close(updatedData);
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
