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
import { MatSort, Sort } from '@angular/material/sort';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { StructureDialogComponent } from './components/structure-dialog/structure-dialog.component';
import { NewReagentFormComponent } from './components/new-reagent-form/new-reagent-form.component';
import { MaterialModule } from '../../material.module';

@Component({
  selector: 'app-reagents-list',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule, MaterialModule],
  templateUrl: './reagents-list.component.html',
  styleUrl: './reagents-list.component.scss',
})
export class ReagentsListComponent implements OnInit, AfterViewInit {
  private _liveAnnouncer = inject(LiveAnnouncer);
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
  @ViewChild(MatSort) sort!: MatSort;


  ngOnInit(): void {
    this.loadReagents();
  }

  loadReagents() {
     console.log("Fetching reagents with filters:", {
        name: this.filterValue,
        category: this.selectedCategory,
        sortByName: this.sortColumn === 'name' ? this.sortDirection : undefined,
        skip: this.paginator?.pageIndex,
        take: this.paginator?.pageSize
    });

    // Fetch reagents with current filters and sorting options
    this.reagentsService
      .getReagents(
        this.filterValue,
        this.selectedCategory,
        this.sortColumn === 'name' ? this.sortDirection : undefined,
        //columns not added yet
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
    this.dataSource.sort = this.sort;
  }

  applyFilter() {
    this.loadReagents();
  }

  // custom Sorting, but backend doesn support it yet? swagger doesn't show sorted results too
  // onSortChange(sort: Sort) {
  //   this.sortColumn = sort.active; // Set the current sorting column
  //   this.sortDirection = sort.direction === '' ? 'asc' : sort.direction;
  //   this.loadReagents(); // Fetch the sorted data
  //   this.announceSortChange(sort); // Announce the sort change
  // }

  
  // sorts name and categories, if hovered on column head shows sorting direction
  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
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
