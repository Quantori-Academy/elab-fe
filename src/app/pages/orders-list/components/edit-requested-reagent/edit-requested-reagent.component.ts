import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Inject,
  OnInit,
} from '@angular/core';
import { MaterialModule } from '../../../../material.module';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ReagentRequestList } from '../../../reagent-request/reagent-request-page/reagent-request-page.interface';
import { ReagentRequestService } from '../../../reagent-request/reagent-request-page/reagent-request-page.service';
import { NotificationPopupService } from '../../../../shared/services/notification-popup/notification-popup.service';
import { take } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  Package,
  PackageLabels,
} from '../../../../shared/models/reagent-model';

@Component({
  selector: 'app-edit-requested-reagent',
  standalone: true,
  imports: [MaterialModule, ReactiveFormsModule],
  templateUrl: './edit-requested-reagent.component.html',
  styleUrl: './edit-requested-reagent.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditRequestedReagentComponent implements OnInit {
  private fb = inject(FormBuilder);
  private reagentRequestService = inject(ReagentRequestService);
  private notificationPopupService = inject(NotificationPopupService);

  packages = Object.keys(Package).map((key) => ({
    value: Package[key as keyof typeof Package],
    viewValue: PackageLabels[Package[key as keyof typeof Package]],
  }));
  private initialPackageValue: string | null = null;
  constructor(
    @Inject(MAT_DIALOG_DATA) private ReagentRequest: ReagentRequestList,
    private dialogRef: MatDialogRef<EditRequestedReagentComponent>
  ) {}

  public reagentRequestForm: FormGroup = this.fb.group({
    desiredQuantity: ['', [Validators.required]],
    package: [],
  });

  ngOnInit(): void {
    if (this.ReagentRequest) {
      this.initialPackageValue = this.ReagentRequest.package || null;
      this.reagentRequestForm.patchValue({
        desiredQuantity: this.ReagentRequest.desiredQuantity,
        package: this.initialPackageValue,
      });
    }
  }

  onEdit() {
    if (this.reagentRequestForm.valid) {
      const currentPackageValue = this.reagentRequestForm.get('package')?.value;
      const requestPayload: Partial<ReagentRequestList> = {
        desiredQuantity: this.reagentRequestForm.get('desiredQuantity')?.value,
      };

      // Include `package` only if it has changed
      if (currentPackageValue !== this.initialPackageValue) {
        requestPayload.package = currentPackageValue;
      }

      this.editReagentRequest(requestPayload);
    }
  }

  editReagentRequest(formValue: Partial<ReagentRequestList>) {
    this.reagentRequestService
      .editReagentRequest(this.ReagentRequest.id, formValue)
      .pipe(take(1))
      .subscribe({
        next: () => {
          this.notificationPopupService.success({
            title: 'Success',
            message: 'Reagent Request has been updated',
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
  public hasError(label: string, error: string): boolean | undefined {
    return this.reagentRequestForm.get(label)?.hasError(error);
  }
  onClose() {
    this.dialogRef.close();
  }
}
