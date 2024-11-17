import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Inject,
} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AsyncPipe } from '@angular/common';
import { Observable, of } from 'rxjs';
import { MaterialModule } from '../../../../material.module';
import { MoleculeStructureComponent } from '../../../../shared/components/molecule-structure/molecule-structure.component';
import { TableLoaderSpinnerComponent } from '../../../../shared/components/table-loader-spinner/table-loader-spinner.component';
import { ReagentRequestService } from '../../../reagent-request/reagent-request-page/reagent-request-page.service';
import { ReagentRequestList } from '../../../reagent-request/reagent-request-page/reagent-request-page.interface';

@Component({
  selector: 'app-reagent-page',
  standalone: true,
  imports: [
    AsyncPipe,
    MaterialModule,
    MoleculeStructureComponent,
    TableLoaderSpinnerComponent,
  ],
  templateUrl: './reagent-page.component.html',
  styleUrl: './reagent-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReagentPageComponent {
  private ReagentsService = inject(ReagentRequestService);
  reagent$: Observable<ReagentRequestList | null> = of(null);

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { id: number },
    private dialogRef: MatDialogRef<ReagentPageComponent>
  ) {
    if (data && data.id) {
      console.log(data.id)
      this.reagent$ = this.ReagentsService.getReagentRequestById(data.id);
    }
  }

  onClose() {
    this.dialogRef.close();
  }
}
