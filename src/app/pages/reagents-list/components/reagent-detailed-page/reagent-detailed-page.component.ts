import {
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { first, Observable, of, switchMap } from 'rxjs';
import { MaterialModule } from '../../../../material.module';
import { MoleculeStructureComponent } from '../../../../shared/components/molecule-structure/molecule-structure.component';
import { TableLoaderSpinnerComponent } from '../../../../shared/components/table-loader-spinner/table-loader-spinner.component';
import { ActivatedRoute, Router } from '@angular/router';
import { ReagentsService } from '../../../../shared/services/reagents.service';
import { Reagent } from '../../../../shared/models/reagent-model';
import { MatSnackBar} from '@angular/material/snack-bar';
import {Clipboard} from '@angular/cdk/clipboard';

@Component({
  selector: 'app-reagent-detailed-page',
  standalone: true,
  imports: [
    AsyncPipe,
    MaterialModule,
    MoleculeStructureComponent,
    TableLoaderSpinnerComponent,
  ],
  templateUrl: './reagent-detailed-page.component.html',
  styleUrl: './reagent-detailed-page.component.scss',
})
export class ReagentDetailedPageComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private reagentsService = inject(ReagentsService);
  copied = false;
  reagent$: Observable<Reagent | null> = of(null);
  private _snackBar = inject(MatSnackBar);
  private clipBoard = inject(Clipboard);

  ngOnInit() {
    this.reagent$ = this.route.paramMap.pipe(
      switchMap((params) => {
        const id = params.get('id');
        return id ? this.reagentsService.getReagentById(id) : of(null);
      })
    );
  }

  onCopyStructure() {
    this._snackBar.open('Structure copied', '', {
      duration: 1000
    });

    this.reagent$.pipe(first()).subscribe(reagent => {
      if (reagent && reagent.structure) {
        this.clipBoard.copy(reagent.structure);
      }
    });

  }

  // onEdit(reagent: Reagent) {}

  // onDelete(reagent: Reagent) {}

  onClose() {
    this.router.navigate([`/reagents`]);
  }
}

// private route = inject(ActivatedRoute);
// private reagentsService = inject(ReagentsService);
// private reagentsRequestService = inject(ReagentRequestService);
// reagent$: Observable<Reagent | null> = this.route.paramMap.pipe(
//   switchMap(params => {
//     const id = params.get('id')!.toString();
//     return this.reagentsService.getReagentById(id);
//   })
// );

// constructor(
//   @Inject(MAT_DIALOG_DATA) public data: { id: number },
//   private dialogRef: MatDialogRef<ReagentPageComponent>
// ) {
//   if (data && data.id) {
//     this.reagent$ = this.ReagentsService.getReagentRequestById(data.id);
//   }
// }
//   onClose() {
//   this.dialogRef.close();
// }
