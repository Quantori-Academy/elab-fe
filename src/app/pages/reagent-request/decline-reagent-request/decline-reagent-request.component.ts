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
import { take } from 'rxjs/operators';
import { NotificationPopupService } from '../../../shared/services/notification-popup/notification-popup.service';
import { ReagentRequestList } from '../reagent-request-page/reagent-request-page.interface';
import { HttpErrorResponse } from '@angular/common/http';
import { TranslateService, TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-decline-reagent-request',
  standalone: true,
  imports: [
    MaterialModule,
    ReactiveFormsModule,
    MatDialogModule,
    TranslateModule,
  ],
  templateUrl: './decline-reagent-request.component.html',
  styleUrl: './decline-reagent-request.component.scss',
})
export class DeclineReagentRequestComponent implements OnInit {
  readonly MAX_LENGTH = 300;

  private fb = inject(FormBuilder);
  private reagentRequestService = inject(ReagentRequestService);
  private notificationPopupService = inject(NotificationPopupService);
  private dialogRef = inject(MatDialogRef<DeclineReagentRequestComponent>);
  private translate = inject(TranslateService);

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
            title: this.translate.instant(
              'DECLINE_REAGENT_REQUEST.SUCCESS_TITLE'
            ),
            message: this.translate.instant(
              'DECLINE_REAGENT_REQUEST.SUCCESS_MESSAGE'
            ),
          });
          this.dialogRef.close(true);
        },
        error: (error: HttpErrorResponse) => {
          this.notificationPopupService.error({
            title: this.translate.instant(
              'DECLINE_REAGENT_REQUEST.ERROR_TITLE'
            ),
            message: error.error.message,
          });
        },
      });
  }

  get translatedStatus(): string {
    const status = this.reagentRequestForm.get('status')?.value;
    return status
      ? this.translate.instant('ORDERS_LIST.STATUS.' + status.toUpperCase())
      : '';
  }
}
