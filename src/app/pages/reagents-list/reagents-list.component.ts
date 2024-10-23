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
    this.reagentsService.getreagents().subscribe((reagents) => {
      this.dataSource.data = reagents;
      
      this.dataSource.filterPredicate = (data: Reagent, filter: string) => {
        const searchTerms = JSON.parse(filter);

        const nameMatches = data.name.toLowerCase().includes(searchTerms.name);

        const categoryMatches = searchTerms.category
          ? data.category.toLowerCase() === searchTerms.category
          : true;

        return nameMatches && categoryMatches;
      };
    });
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter() {
    const filter = {
      name: this.filterValue.trim().toLowerCase(),
      category: this.selectedCategory.toLowerCase(),
    };

    this.dataSource.filter = JSON.stringify(filter);

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

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
        this.reagentsService.getreagents().subscribe((reagents) => {
          console.log(reagents);
          this.dataSource.data = reagents;
        });
      }
    });
  }
}
