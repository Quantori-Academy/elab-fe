import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Inject,
} from '@angular/core';
import { ReagentsService } from '../../../../shared/services/reagents.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AsyncPipe } from '@angular/common';
import { Observable, of } from 'rxjs';
import { MaterialModule } from '../../../../material.module';
import { MoleculeStructureComponent } from '../../../../shared/components/molecule-structure/molecule-structure.component';
import { TableLoaderSpinnerComponent } from '../../../../shared/components/table-loader-spinner/table-loader-spinner.component';
import { Reagent } from '../../../../shared/models/reagent-model';

@Component({
  selector: 'app-reagent-page',
  standalone: true,
  imports: [
    AsyncPipe,
    MaterialModule,
    // DatePipe,
    MoleculeStructureComponent,
    TableLoaderSpinnerComponent,
  ],
  templateUrl: './reagent-page.component.html',
  styleUrl: './reagent-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReagentPageComponent {
  private ReagentsService = inject(ReagentsService);
  reagent$: Observable<Reagent | null> = of(null);

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { id: string },
    private dialogRef: MatDialogRef<ReagentPageComponent>
  ) {
    if (data && data.id) {
      this.reagent$ = this.ReagentsService.getReagentById(data.id);
    }
  }
  onClose() {
    this.dialogRef.close();
  }
}
