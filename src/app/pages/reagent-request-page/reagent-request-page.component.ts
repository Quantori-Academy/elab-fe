import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { MaterialModule } from '../../material.module';
import { MoleculeStructureComponent } from '../../shared/components/molecule-structure/molecule-structure.component';

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
})
export class ReagentsRequestPageComponent implements OnInit {
  public dialog = inject(MatDialog);
  // private reagentRequestService = inject(ReagentRequestService);

  selectedStatus = '' as 'Pending' | 'Ordered' | 'Declined' | 'Fulfilled' | '';
  currentPage = 0;
  sortDirection = 'asc' as 'asc' | 'desc';
  sortColumn = 'createdAt' as 'createdAt' | 'quantity' | 'updatedAt';
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

  // dataSource = new MatTableDataSource<ReagentRequest>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngOnInit(): void {
    this.loadReagentRequests();
  }

  loadReagentRequests() {
    // in progress
  }
}
