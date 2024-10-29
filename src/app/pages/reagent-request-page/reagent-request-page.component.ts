import {
  AfterViewInit,
  Component,
  inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ReagentRequestService } from './reagent-request.service';
import { ReagentRequest } from './reagent-request.interface';
import { MatPaginator } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { MaterialModule } from '../../material.module';
import { MoleculeStructureComponent } from '../../shared/components/molecule-structure/molecule-structure.component';
import { StructureDialogComponent } from '../reagents-list/components/structure-dialog/structure-dialog.component';

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
export class ReagentsRequestPageComponent implements OnInit, AfterViewInit {
  public dialog = inject(MatDialog);
  private reagentRequestService = inject(ReagentRequestService);

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

  dataSource = new MatTableDataSource<ReagentRequest>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngOnInit(): void {
    this.loadReagentRequests(false);
  }

  loadReagentRequests(applySorting = true) {
    console.log('Fetching reagent requests with filters:', {
      status: this.selectedStatus,
      sortByCreatedDate:
        applySorting && this.sortColumn === 'createdAt'
          ? this.sortDirection
          : undefined,
      sortByQuantity:
        applySorting && this.sortColumn === 'quantity'
          ? this.sortDirection
          : undefined,
      sortByUpdatedDate:
        applySorting && this.sortColumn === 'updatedAt'
          ? this.sortDirection
          : undefined,
      skip: this.currentPage * (this.paginator ? this.paginator.pageSize : 10),
      take: this.paginator ? this.paginator.pageSize : 10,
      name: this.filterName || undefined,
    });

    this.reagentRequestService
      .getReagentRequests(
        this.selectedStatus || undefined,
        this.sortColumn === 'quantity' ? this.sortDirection : undefined,
        this.sortColumn === 'createdAt' ? this.sortDirection : undefined,
        this.sortColumn === 'updatedAt' ? this.sortDirection : undefined,
        this.currentPage * (this.paginator ? this.paginator.pageSize : 10),
        this.paginator ? this.paginator.pageSize : 10,
        this.filterName || undefined
      )
      .subscribe({
        next: (requests) => {
          this.dataSource.data = requests;
        },
        error: (err) => {
          console.error('Error:', err);
        },
      });
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.paginator.page.subscribe((event) => {
      this.currentPage = event.pageIndex;
      this.loadReagentRequests();
    });
  }

  applyFilter() {
    this.currentPage = 0;
    this.paginator.firstPage();
    this.loadReagentRequests();
  }

  onSortChange(sort: Sort) {
    if (['createdAt', 'quantity', 'updatedAt'].includes(sort.active)) {
      this.sortColumn = sort.active as 'createdAt' | 'quantity' | 'updatedAt';
      this.sortDirection = sort.direction === 'asc' ? 'asc' : 'desc';
      this.loadReagentRequests();
    } else {
      this.sortColumn = 'createdAt';
      this.sortDirection = 'asc';
      this.loadReagentRequests();
    }
  }

  openStructure(structure: string) {
    this.dialog.open(StructureDialogComponent, {
      data: { structure },
      panelClass: 'image-dialog',
    });
  }

  // Currently in progress

  // openCreateReagentRequestDialog() {
  //   const dialogRef = this.dialog.open(NewReagentFormComponent, {
  //     data: {},
  //   });

  //   dialogRef.afterClosed().subscribe((result) => {
  //     if (result) {
  //       this.loadReagentRequests();
  //     }
  //   });
  // }
}
