import { Component, inject } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ReagentRequestService } from '../reagent-request-page/reagent-request-page.service';
import { NotificationPopupService } from '../../../shared/services/notification-popup/notification-popup.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../material.module';
import { ReagentRequestCreate } from '../reagent-request-page/reagent-request-page.interface';

@Component({
  selector: 'app-create-reagent-request',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MaterialModule],
  templateUrl: './create-reagent-request.component.html',
  styleUrls: ['./create-reagent-request.component.scss'],
})
export class CreateReagentRequestComponent {
  private fb = inject(FormBuilder);
  private reagentRequestService = inject(ReagentRequestService);
  private notificationsService = inject(NotificationPopupService);
  private router = inject(Router);

  reagentRequestForm = this.fb.nonNullable.group({
    name: ['', Validators.required],
    desiredQuantity: [0, [Validators.required, Validators.min(1)]],
    quantityUnit: ['', Validators.required],
    structureSmiles: [''],
    casNumber: [''],
    userComments: [''],
    package: [''],
  });

  units = [
    { value: 'ml', viewValue: 'ml' },
    { value: 'g', viewValue: 'g' },
  ];

  onSubmit() {
    if (this.reagentRequestForm.valid) {
      const formValue = this.reagentRequestForm.getRawValue();

      const reagentRequest: ReagentRequestCreate = {
        ...formValue,
        status: 'Pending',
        desiredQuantity: Number(formValue.desiredQuantity),
      };
      this.reagentRequestService
        .createReagentRequest(reagentRequest)
        .subscribe({
          next: () => {
            this.notificationsService.success({
              title: 'Success',
              message: 'Reagent request created successfully!',
              duration: 3000,
            });
            this.router.navigate(['/reagent-request-page']);
          },
          error: (error) => {
            console.error('Error creating reagent request:', error);
            this.notificationsService.error({
              title: 'Error',
              message: 'Failed to create reagent request. Please try again.',
              duration: 3000,
            });
          },
        });
    } else {
      console.log('Form is invalid');
    }
  }

  cancel() {
    this.router.navigate(['/reagent-request-page']);
  }
}
