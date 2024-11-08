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
import { TableLoaderSpinnerComponent } from '../../shared/components/table-loader-spinner/table-loader-spinner.component';
import { Observable } from 'rxjs';
import { RbacService } from '../../auth/services/authentication/rbac.service';

@Component({
  selector: 'app-reagents-list',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    MaterialModule,
    MoleculeStructureComponent,
    TableLoaderSpinnerComponent,
  ],
  templateUrl: './reagents-list.component.html',
  styleUrl: './reagents-list.component.scss',
})
export class ReagentsListComponent implements OnInit, AfterViewInit {
  @Input() storageLocationId?: number;
  public dialog = inject(MatDialog);
  private reagentsService = inject(ReagentsService);
  private rbacService = inject(RbacService);
  private router = inject(Router);

  public isResearcher = this.rbacService.isResearcher();
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
  reagents$: Observable<Reagent[] | undefined>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor() {
    this.reagents$ = this.reagentsService.getReagents();
  }

  ngOnInit(): void {
    // Initially load the reagents without sorting
    this.loadReagents(false);
  }

  loadReagents(applySorting = true) {
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

    this.reagentsService
      .getReagents(
        this.filterValue,
        this.selectedCategory,
        applySorting && this.sortColumn === 'name'
          ? this.sortDirection
          : undefined,
        undefined, // sortByCreationDate
        undefined, // sortByUpdatedDate
        this.paginator?.pageIndex,
        this.paginator?.pageSize
      )
      .subscribe((reagents) => {
        this.dataSource.data = reagents;
      });
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  applyFilter() {
    this.loadReagents();
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
    this.loadReagents();
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
