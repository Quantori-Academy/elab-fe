import { Component, Inject, inject } from '@angular/core';
import { ReagentsService } from '../../services/reagents.service';
import { MaterialModule } from '../../../material.module';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Reagent } from '../../models/reagent-model';
import { NotificationPopupService } from '../../services/notification-popup/notification-popup.service';
import { HttpErrorResponse } from '@angular/common/http';
import { TranslateService, TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-delete-reagent',
  standalone: true,
  imports: [ReactiveFormsModule, MaterialModule, TranslateModule],
  templateUrl: './delete-reagent.component.html',
  styleUrl: './delete-reagent.component.scss',
})
export class DeleteReagentComponent {
  deleteForm: FormGroup;
  private reagentsService = inject(ReagentsService);
  private notificationsService = inject(NotificationPopupService);
  private translate = inject(TranslateService);

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<DeleteReagentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Reagent
  ) {
    this.deleteForm = this.fb.group({
      reagentName: [data.name],
    });
  }

  onSubmit(): void {
    this.reagentsService.deleteReagent(this.data.id.toString()).subscribe({
      next: () => {
        this.notificationsService.success({
          title: this.translate.instant('DELETE_REAGENT.SUCCESS_TITLE'),
          message: this.translate.instant('DELETE_REAGENT.SUCCESS_MESSAGE', {
            name: this.data.name,
          }),
          duration: 3000,
        });
        this.dialogRef.close(true);
      },
      error: (error: HttpErrorResponse) => {
        this.notificationsService.error({
          title: this.translate.instant('DELETE_REAGENT.ERROR_TITLE'),
          message: error.error.message,
          duration: 4000,
        });
        this.dialogRef.close(false);
      },
    });
  }
}
