import {
  Component,
  ChangeDetectionStrategy,
  inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { MaterialModule } from '../../material.module';
import { MoleculeStructureComponent } from '../../shared/components/molecule-structure/molecule-structure.component';
import { StatusFilter } from '../../shared/models/status.type';

@Component({
  selector: 'app-reagents-request-page',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    MaterialModule,
    MoleculeStructureComponent,
  ],
  templateUrl: './reagent-request-page.component.html',
  styleUrls: ['./reagent-request-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReagentsRequestPageComponent implements OnInit {
  public dialog = inject(MatDialog);

  selectedStatus: StatusFilter = '';
  currentPage = 0;
  sortDirection: 'asc' | 'desc' = 'asc';
  sortColumn: 'createdAt' | 'quantity' | 'updatedAt' = 'createdAt';
  filterName = '';

  displayedColumns = [
    'name',
    'structureImage',
    'casNumber',
    'desiredQuantity',
    'status',
    'userComments',
    'procurementComments',
    'createdAt',
    'updatedAt',
  ];

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngOnInit(): void {
    this.loadReagentRequests();
  }

  loadReagentRequests() {
    // in progress
  }

  onPageChange(event: PageEvent) {
    this.currentPage = event.pageIndex;
    this.loadReagentRequests();
  }
}
