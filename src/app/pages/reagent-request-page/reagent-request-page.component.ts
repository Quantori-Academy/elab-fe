import { Component, computed, inject, OnInit, ViewChild } from '@angular/core';
import { ReagentRequestService } from './reagent-request-page.service';
import { ReagentRequestList } from './reagent-request-page.interface';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { MaterialModule } from '../../material.module';
import { MoleculeStructureComponent } from '../../shared/components/molecule-structure/molecule-structure.component';
import { StructureDialogComponent } from '../reagents-list/components/structure-dialog/structure-dialog.component';
import { StatusFilter } from '../../shared/models/status.type';
import { SpinnerDirective } from '../../shared/directives/spinner/spinner.directive';
// import { MatTableDataSource } from '@angular/material/table';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { TableLoaderSpinnerComponent } from '../../shared/components/table-loader-spinner/table-loader-spinner.component';

@Component({
  selector: 'app-reagents-request-page',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    MaterialModule,
    MoleculeStructureComponent,
    SpinnerDirective,
    TableLoaderSpinnerComponent,
  ],
  templateUrl: './reagent-request-page.component.html',
  styleUrls: ['./reagent-request-page.component.scss'],
})
export class ReagentsRequestPageComponent implements OnInit {
  public dialog = inject(MatDialog);
  private reagentRequestService = inject(ReagentRequestService);
  public isLoading = computed(() => this.reagentRequestService.isLoading());
  // dataSource$ = new BehaviorSubject<ReagentRequestList[]>([]);
  private dataSourceSubject = new BehaviorSubject<ReagentRequestList[] | null>(
    null
  );
  selectedStatus: StatusFilter = '';
  currentPage = 0;
  sortDirection: 'asc' | 'desc' = 'asc';
  sortColumn: 'createdAt' | 'quantity' | 'updatedAt' = 'createdAt';
  filterName = '';
  displayedColumns = [
    'name',
    'structureSmiles',
    'casNumber',
    'desiredQuantity',
    'status',
    'createdAt',
    'updatedAt',
    'actions',
  ];
  totalItems = 0;
  pageSize = 10;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  // dataSource = new MatTableDataSource<ReagentRequestList>();
  dataSource$: Observable<ReagentRequestList[] | null> =
    this.dataSourceSubject.asObservable();

  ngOnInit(): void {
    this.loadReagentRequests();
  }

  loadReagentRequests() {
    const skip = this.currentPage * this.pageSize;
    this.reagentRequestService
      .getReagentRequests(
        this.selectedStatus || undefined,
        this.sortColumn === 'quantity' ? this.sortDirection : undefined,
        this.sortColumn === 'createdAt' ? this.sortDirection : undefined,
        this.sortColumn === 'updatedAt' ? this.sortDirection : undefined,
        skip,
        this.pageSize,
        this.filterName || undefined
      )
      .pipe(
        tap((requests) => {
          this.totalItems = requests.length;
          this.dataSourceSubject.next(requests);
        }),
        catchError((err) => {
          console.error('Error:', err);
          return of([]);
        })
      )
      .subscribe();
  }

  onPageChange(event: PageEvent) {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadReagentRequests();
  }

  applyFilter() {
    this.currentPage = 0;
    if (this.paginator) {
      this.paginator.firstPage();
    }
    this.loadReagentRequests();
  }

  onSortChange(sort: Sort) {
    if (['createdAt', 'quantity', 'updatedAt'].includes(sort.active)) {
      this.sortColumn = sort.active as 'createdAt' | 'quantity' | 'updatedAt';
      this.sortDirection = sort.direction === 'asc' ? 'asc' : 'desc';
    } else {
      this.sortColumn = 'createdAt';
      this.sortDirection = 'asc';
    }
    this.loadReagentRequests();
  }

  openStructure(structure: string) {
    this.dialog.open(StructureDialogComponent, {
      data: { structure },
      panelClass: 'image-dialog',
    });
  }
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
