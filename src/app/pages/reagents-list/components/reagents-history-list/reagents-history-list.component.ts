import { Component, inject } from '@angular/core';
import { ReagentHistory } from '../../../../shared/models/reagent-model';
import { ReagentsService } from '../../../../shared/services/reagents.service';
import { MaterialModule } from '../../../../material.module';
import { AsyncPipe, DatePipe } from '@angular/common';
import { Observable } from 'rxjs';
import { TableLoaderSpinnerComponent } from '../../../../shared/components/table-loader-spinner/table-loader-spinner.component';

@Component({
  selector: 'app-reagents-history-list',
  standalone: true,
  imports: [MaterialModule, DatePipe, AsyncPipe, TableLoaderSpinnerComponent],
  templateUrl: './reagents-history-list.component.html',
  styleUrls: ['./reagents-history-list.component.scss'],
})
export class ReagentsHistoryListComponent {
  reagentService = inject(ReagentsService);
  reagent$: Observable<ReagentHistory[]>;

  displayedColumns = [
    'name',
    'category',
    'action',
    'timestamp',
    'oldStorage',
    'newStorage',
    'oldQuantity',
    'newQuantity',
    'usedReagents',
  ];

  constructor() {
    this.reagent$ = this.reagentService.getReagentsHistory();
  }
}
