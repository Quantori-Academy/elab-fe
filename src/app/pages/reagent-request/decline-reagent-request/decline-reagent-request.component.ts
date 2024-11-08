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
import { take } from 'rxjs/operators';
import { NotificationPopupService } from '../../../shared/services/notification-popup/notification-popup.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-decline-reagent-request',
  standalone: true,
  imports: [MaterialModule, ReactiveFormsModule, MatDialogModule, AsyncPipe],
  templateUrl: './decline-reagent-request.component.html',
  styleUrls: ['./decline-reagent-request.component.scss'],
})
export class DeclineReagentRequestComponent implements OnInit {
  readonly MAX_LENGTH = 300;

  private fb = inject(FormBuilder);
  private reagentRequestService = inject(ReagentRequestService);
  private notificationPopupService = inject(NotificationPopupService);
  private dialogRef = inject(MatDialogRef<DeclineReagentRequestComponent>);

  public reagentRequestForm: FormGroup = this.fb.group({
    status: [{ value: 'Declined', disabled: true }, [Validators.required]],
    procurementComments: ['', [Validators.maxLength(this.MAX_LENGTH)]],
  });

  constructor(
    @Inject(MAT_DIALOG_DATA) public editionData: ReagentRequestList
  ) {}

  ngOnInit(): void {
    if (this.editionData) {
      this.reagentRequestForm.patchValue({
        procurementComments: this.editionData.procurementComments || '',
      });
    }
  }

  onSave() {
    if (this.reagentRequestForm.valid) {
      const formValue = {
        ...this.reagentRequestForm.getRawValue(),
        status: 'Declined',
      };

      this.declineReagentRequest(formValue);
    }
  }

  declineReagentRequest(formValue: Partial<ReagentRequestList>) {
    this.reagentRequestService
      .declineReagentRequest(this.editionData.id, formValue)
      .pipe(take(1))
      .subscribe({
        next: () => {
          this.notificationPopupService.success({
            title: 'Success',
            message: 'Reagent Request declined',
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
