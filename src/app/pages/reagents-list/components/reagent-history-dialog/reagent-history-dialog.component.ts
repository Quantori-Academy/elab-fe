import { Component, inject, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {
  Reagent,
  ReagentHistory,
} from '../../../../shared/models/reagent-model';
import { ReagentsService } from '../../../../shared/services/reagents.service';
import { MaterialModule } from '../../../../material.module';
import { AsyncPipe, DatePipe, UpperCasePipe } from '@angular/common';
import { BehaviorSubject, map } from 'rxjs';
import { TableLoaderSpinnerComponent } from '../../../../shared/components/table-loader-spinner/table-loader-spinner.component';
import { TranslateModule } from '@ngx-translate/core';
import { NoDataComponent } from '../../../../shared/components/no-data/no-data.component';

@Component({
  selector: 'app-reagent-history-dialog',
  standalone: true,
  imports: [
    MaterialModule,
    DatePipe,
    AsyncPipe,
    TableLoaderSpinnerComponent,
    TranslateModule,
    UpperCasePipe,
    NoDataComponent,
  ],
  templateUrl: './reagent-history-dialog.component.html',
  styleUrl: './reagent-history-dialog.component.scss',
})
export class ReagentHistoryDialogComponent implements OnInit {
  reagentService = inject(ReagentsService);
  reagentHistory$ = new BehaviorSubject<ReagentHistory[] | null>(null);

  public displayedColumns = [
    'action',
    'timestamp',
    'oldStorage',
    'newStorage',
    'oldQuantity',
    'newQuantity',
    'usedReagents',
  ];

  constructor(
    public dialogRef: MatDialogRef<ReagentHistoryDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Reagent
  ) {}

  ngOnInit(): void {
    this.reagentService
      .getReagentsHistory()
      .pipe(
        map((resp) =>
          resp.filter(
            (reagent) =>
              reagent.oldData?.id === this.data.id ||
              reagent.newData?.id === this.data.id
          )
        )
      )
      .subscribe((filteredData) => this.reagentHistory$.next(filteredData));
  }
}
