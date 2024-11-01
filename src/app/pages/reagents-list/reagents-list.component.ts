import {
  AfterViewInit,
  Component,
  inject,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ReagentsService } from '../../shared/services/reagents.service';
import { Reagent } from '../../shared/models/reagent-model';
import { MatPaginator } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { StructureDialogComponent } from './components/structure-dialog/structure-dialog.component';
import { MaterialModule } from '../../material.module';
import { MoleculeStructureComponent } from '../../shared/components/molecule-structure/molecule-structure.component';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap } from 'rxjs';

@Component({
  selector: 'app-reagents-list',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    MaterialModule,
    MoleculeStructureComponent,
  ],
  templateUrl: './reagents-list.component.html',
  styleUrl: './reagents-list.component.scss',
})
export class ReagentsListComponent implements OnInit, AfterViewInit {
  @Input() storageLocationId?: number;
  public dialog = inject(MatDialog);
  private reagentsService = inject(ReagentsService);
  private router = inject(Router);
  isLoading$ = new BehaviorSubject<boolean>(false);

  selectedCategory = '';
  filterValue = '';
  currentPage = 0;
  sortDirection: 'asc' | 'desc' = 'asc';
  sortColumn = 'name';

  displayedColumns: string[] = [
    'name',
    'category',
    'structure',
    'quantity',
    // 'package',
    'quantityLeft',
    'cas',
    'location',
    'actions',
  ];

  dataSource = new MatTableDataSource<Reagent>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngOnInit(): void {
    // Initially load the reagents without sorting
    this.loadReagents(false).subscribe();
  }

  loadReagents(applySorting = true): Observable<Reagent[]> {
    console.log('Fetching reagents with filters:', {
      name: this.filterValue,
      category: this.selectedCategory,
      sortByName:
        applySorting && this.sortColumn === 'name'
          ? this.sortDirection
          : undefined,
      skip: this.paginator?.pageIndex,
      take: this.paginator?.pageSize,
    });

    this.isLoading$.next(true);
    return this.reagentsService.getReagents(
      this.filterValue,
      this.selectedCategory,
      applySorting && this.sortColumn === 'name' ? this.sortDirection : undefined,
      undefined,
      undefined,
      this.paginator?.pageIndex,
      this.paginator?.pageSize
    ).pipe(
      tap((reagents) => {
        this.dataSource.data = reagents;
        this.isLoading$.next(false);
      })
    );
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  applyFilter() {
    this.loadReagents().subscribe();
  }


  onSortChange(sort: Sort) {
    if (sort.active === 'name') {
      if (sort.direction === '') {
        this.sortDirection = 'asc';
      } else {
        this.sortDirection = sort.direction === 'asc' ? 'asc' : 'desc';
      }
    }

    this.sortColumn = sort.active;
    this.loadReagents().subscribe();
  }

  openStructure(structure: string) {
    this.dialog.open(StructureDialogComponent, {
      data: { structure },
      panelClass: 'image-dialog',
    });
  }

  redirectToCreatePage(page: 'reagent' | 'sample') {
    if (page === 'reagent') {
      this.router.navigate(['reagents/create-reagent']);
    } else {
      this.router.navigate(['reagents/create-sample']);
    }
  }
}
