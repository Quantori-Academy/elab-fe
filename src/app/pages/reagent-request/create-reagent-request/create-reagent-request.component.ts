import { Component, inject } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ReagentRequestService } from '../reagent-request-page/reagent-request-page.service';
import { NotificationPopupService } from '../../../shared/services/notification-popup/notification-popup.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../material.module';
import { ReagentRequestCreate } from '../reagent-request-page/reagent-request-page.interface';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AddStructureComponent } from '../../../shared/components/structure-editor/add-structure/add-structure.component';
import {
  Unit,
  UnitLabels,
  Package,
  PackageLabels,
} from '../../../shared/models/reagent-model';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { RbacService } from '../../../auth/services/authentication/rbac.service';

@Component({
  selector: 'app-create-reagent-request',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MaterialModule,
    MatDatepickerModule,
    MatNativeDateModule,
    TranslateModule,
  ],
  templateUrl: './create-reagent-request.component.html',
  styleUrl: './create-reagent-request.component.scss',
})
export class CreateReagentRequestComponent {
  private fb = inject(FormBuilder);
  private rbacService = inject(RbacService);
  private reagentRequestService = inject(ReagentRequestService);
  private notificationsService = inject(NotificationPopupService);
  private router = inject(Router);
  private dialog = inject(MatDialog);
  private translate = inject(TranslateService);
  private dialogRef = inject(MatDialogRef<CreateReagentRequestComponent>, { optional: true });
  isProcurementOfficer = this.rbacService.isProcurementOfficer();
  isResearcher = this.rbacService.isResearcher();
  reagentRequestForm = this.fb.nonNullable.group({
    name: ['', Validators.required],
    desiredQuantity: [null, [Validators.required, Validators.min(1)]],
    quantityUnit: ['', Validators.required],
    structureSmiles: [null],
    casNumber: [null],
    userComments: [null],
    packageType: [null],
    orderId: [null],
    producer: [null],
    catalogId: [null],
    catalogLink: [null],
    pricePerUnit: [null],
    expirationDate: [null],
  });

  units = Object.keys(Unit).map((key) => ({
    value: Unit[key as keyof typeof Unit],
    viewValue: UnitLabels[Unit[key as keyof typeof Unit]],
  }));

  packages = Object.keys(Package).map((key) => ({
    value: Package[key as keyof typeof Package],
    viewValue: PackageLabels[Package[key as keyof typeof Package]],
  }));

  onSubmit() {
    if (this.reagentRequestForm.valid) {
      const formValue = this.reagentRequestForm.getRawValue();

      const reagentRequest: ReagentRequestCreate = {
        name: formValue.name,
        desiredQuantity: Number(formValue.desiredQuantity),
        quantityUnit: formValue.quantityUnit,
        hide: this.isProcurementOfficer,
        status: 'Pending',
        ...(formValue.packageType ? { package: formValue.packageType } : {}),
        ...(formValue.structureSmiles
          ? { structureSmiles: formValue.structureSmiles }
          : {}),
        ...(formValue.casNumber ? { casNumber: formValue.casNumber } : {}),
        ...(formValue.userComments
          ? { userComments: formValue.userComments }
          : {}),
        ...(formValue.orderId ? { orderId: Number(formValue.orderId) } : {}),
        ...(formValue.producer ? { producer: formValue.producer } : {}),
        ...(formValue.catalogId ? { catalogId: formValue.catalogId } : {}),
        ...(formValue.catalogLink
          ? { catalogLink: formValue.catalogLink }
          : {}),
        ...(formValue.pricePerUnit
          ? { pricePerUnit: Number(formValue.pricePerUnit) }
          : {}),
        ...(formValue.expirationDate
          ? { expirationDate: formValue.expirationDate }
          : {}),
      };

      this.reagentRequestService
        .createReagentRequest(reagentRequest)
        .subscribe({
          next: (createdReagentRequest) => {
            this.notificationsService.success({
              title: this.translate.instant(
                'CREATE_REAGENT_REQUEST.SUCCESS_TITLE'
              ),
              message: this.translate.instant(
                'CREATE_REAGENT_REQUEST.SUCCESS_MESSAGE'
              ),
              duration: 3000,
            });
            if (this.isProcurementOfficer && this.dialogRef){
              this.dialogRef.close(createdReagentRequest);
            }
            if (this.isResearcher){
              this.cancel();
            }
          },
          error: (error) => {
            console.error('Error creating reagent request:', error);
            this.notificationsService.error({
              title: this.translate.instant(
                'CREATE_REAGENT_REQUEST.ERROR_TITLE'
              ),
              message: this.translate.instant(
                'CREATE_REAGENT_REQUEST.ERROR_MESSAGE'
              ),
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

  openStructureEditor() {
    const dialogRef = this.dialog.open(AddStructureComponent, {
      width: '650px',
      height: '600px',
      minWidth: '650px',
      minHeight: '600px',
      restoreFocus: false,
      data: { smiles:  this.reagentRequestForm.get('structureSmiles')?.value }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.reagentRequestForm.patchValue({ structureSmiles: result });
      }
    });
  }
}
