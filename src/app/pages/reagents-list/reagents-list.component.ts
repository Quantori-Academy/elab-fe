import {
  AfterViewInit,
  Component,
  inject,
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
import { NewReagentFormComponent } from './components/new-reagent-form/new-reagent-form.component';
import { MaterialModule } from '../../material.module';
import { MoleculeStructureComponent } from '../../shared/components/molecule-structure/molecule-structure.component';

@Component({
  selector: 'app-reagents-list',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule, MaterialModule, MoleculeStructureComponent],
  templateUrl: './reagents-list.component.html',
  styleUrl: './reagents-list.component.scss',
})
export class ReagentsListComponent implements OnInit, AfterViewInit {
  public dialog = inject(MatDialog);
  private reagentsService = inject(ReagentsService);

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
  openCreateReagentDialog() {
    const dialogRef = this.dialog.open(NewReagentFormComponent, {
      data: {},
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadReagents(); // Reload reagents after creating a new one
      }
    });
  }
}
