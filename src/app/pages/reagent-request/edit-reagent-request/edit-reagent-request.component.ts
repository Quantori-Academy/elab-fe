import { Component, Inject, inject, OnInit } from '@angular/core';
import { MaterialModule } from '../../../material.module';
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
import { ReagentRequestService } from '../reagent-request-page/reagent-request-page.service';
import { AsyncPipe } from '@angular/common';
import { ReagentRequestList } from '../reagent-request-page/reagent-request-page.interface';
import { take } from 'rxjs';
import { NotificationPopupService } from '../../../shared/services/notification-popup/notification-popup.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-edit-reagent-request',
  standalone: true,
  imports: [MaterialModule, ReactiveFormsModule, MatDialogModule, AsyncPipe],
  templateUrl: './edit-reagent-request.component.html',
  styleUrls: ['./edit-reagent-request.component.scss'],
})
export class EditReagentRequestComponent implements OnInit {
  readonly MAX_LENGTH = 300;

  private fb = inject(FormBuilder);
  private reagentRequestService = inject(ReagentRequestService);
  private notificationPopupService = inject(NotificationPopupService);
  private dialogRef = inject(MatDialogRef<EditReagentRequestComponent>);

  public reagentRequestForm: FormGroup = this.fb.group({
    desiredQuantity: ['', [Validators.required]],
    status: ['', [Validators.required]],
  });

  public originalValues: Partial<ReagentRequestList> | undefined;

  constructor(
    @Inject(MAT_DIALOG_DATA) public editionData: ReagentRequestList
  ) {}

  ngOnInit(): void {
    if (this.editionData) {
      const editedData = {
        desiredQuantity: this.editionData.desiredQuantity,
        status: this.editionData.status,
      };
      this.reagentRequestForm.patchValue(editedData);
      this.originalValues = { ...editedData };
    }
  }

  public hasError(label: string, error: string): boolean | undefined {
    return this.reagentRequestForm.get(label)?.hasError(error);
  }

  public getErrorMessage(label: string, error: string): string {
    return this.reagentRequestForm.get(label)?.getError(error);
  }

  hasFormChanged(): boolean {
    if (!this.originalValues) return false;
    const currentValues = this.reagentRequestForm.value;
    return (
      currentValues.desiredQuantity !== this.originalValues.desiredQuantity ||
      currentValues.status !== this.originalValues.status
    );
  }

  onSave() {
    if (this.reagentRequestForm.valid) {
      const formValue = this.reagentRequestForm.value;

      this.updateReagentRequest(formValue);
    }
  }

  updateReagentRequest(formValue: Partial<ReagentRequestList>) {
    this.reagentRequestService
      .updateReagentRequest(this.editionData.id, formValue)
      .pipe(take(1))
      .subscribe({
        next: () => {
          this.notificationPopupService.success({
            title: 'Success',
            message: 'Reagent Request updated',
          });
          this.dialogRef.close(true);
        },
        error: (error: HttpErrorResponse) => {
          this.notificationPopupService.error({
            title: 'Error',
            message: error.error.message,
          });
        },
      });
  }
}
