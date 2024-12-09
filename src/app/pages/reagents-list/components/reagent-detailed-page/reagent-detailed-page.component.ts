import { Component, inject, OnInit } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { BehaviorSubject, first, Observable, of, switchMap } from 'rxjs';
import { MaterialModule } from '../../../../material.module';
import { MoleculeStructureComponent } from '../../../../shared/components/molecule-structure/molecule-structure.component';
import { TableLoaderSpinnerComponent } from '../../../../shared/components/table-loader-spinner/table-loader-spinner.component';
import { ActivatedRoute, Router } from '@angular/router';
import { ReagentsService } from '../../../../shared/services/reagents.service';
import { Reagent } from '../../../../shared/models/reagent-model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Clipboard } from '@angular/cdk/clipboard';
import { MatDialog } from '@angular/material/dialog';
import { DeleteReagentComponent } from '../../../../shared/components/delete-reagent/delete-reagent.component';
import { RbacService } from '../../../../auth/services/authentication/rbac.service';
import { ReagentHistoryDialogComponent } from '../reagent-history-dialog/reagent-history-dialog.component';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { ReagentsQueryService } from '../../services/reagents-query.service';
import { EditReagentComponent } from '../edit-reagent/edit-reagent.component';

@Component({
  selector: 'app-reagent-detailed-page',
  standalone: true,
  imports: [
    AsyncPipe,
    MaterialModule,
    MoleculeStructureComponent,
    TableLoaderSpinnerComponent,
    TranslateModule,
  ],
  templateUrl: './reagent-detailed-page.component.html',
  styleUrl: './reagent-detailed-page.component.scss',
})
export class ReagentDetailedPageComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private reagentSubject = new BehaviorSubject<Reagent | null>(null);
  reagent$: Observable<Reagent | null> = this.reagentSubject.asObservable();
  private reagentsService = inject(ReagentsService);
  private reagentsQueryService = inject(ReagentsQueryService);
  private rbacService = inject(RbacService);
  public isProcurementOfficer = this.rbacService.isProcurementOfficer();
  private _snackBar = inject(MatSnackBar);
  private clipBoard = inject(Clipboard);
  private dialog = inject(MatDialog);
  private translate = inject(TranslateService);

  ngOnInit() {
    this.route.paramMap
      .pipe(
        switchMap((params) => {
          const id = params.get('id');
          return id ? this.reagentsService.getReagentById(id) : of(null);
        })
      )
      .subscribe((reagent) => {
        this.reagentSubject.next(reagent);
      });
  }

  onCopyStructure() {
    this._snackBar.open(
      this.translate.instant('REAGENT_DETAILED_PAGE.STRUCTURE_COPIED'),
      '',
      {
        duration: 1000,
      }
    );

    this.reagent$.pipe(first()).subscribe((reagent) => {
      if (reagent && reagent.structure) {
        this.clipBoard.copy(reagent.structure);
      }
    });
  }

  onEditReagent(reagent: Reagent) {
    this.dialog
      .open(EditReagentComponent, { data: reagent, width: '400px' })
      .afterClosed()
      .pipe(
        first(),
        switchMap((updatedData) =>
          updatedData ? this.reagentsService.getReagentById(reagent.id.toString()) : of(null)
        )
      )
      .subscribe((updatedReagent) => {
        if (updatedReagent) {
          if (updatedReagent.quantityLeft === 0) {
            this.onClose();
          } else {
            this.reagentSubject.next(updatedReagent);
          }
        }
      });
  }
  onHistory(reagent: Reagent) {
    this.dialog.open(ReagentHistoryDialogComponent, {
      data: reagent,
      minWidth:'75vw'
    });
  }
  onDeleteReagent(reagent: Reagent) {
    this.dialog
      .open(DeleteReagentComponent, {
        data: reagent,
        width: '400px',
        restoreFocus: false,
      })
      .afterClosed()
      .subscribe((successfulDeletion) => {
        if (successfulDeletion) this.onClose();
      });
  }

  onClose() {
    this.router.navigate([`/reagents`]);
  }
}
