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
import { StructureDialogComponent } from './structure-dialog/structure-dialog.component';
import { NewReagentFormComponent } from './new-reagent-form/new-reagent-form.component';
import { StorageService } from '../../shared/services/storage.service';
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
  private storageService = inject(StorageService);
  selectedCategory = '';
  filterValue = '';
  currentPage = 0;
  displayedColumns: string[] = [
    'name',
    'structure',
    'cas',
    'quantity',
    'package',
    'quantityLeft',
    'room',
    'location',
    'actions',
  ];

  dataSource = new MatTableDataSource<Reagent>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngOnInit(): void {
    this.reagentsService.getReagentsList().subscribe((reagents) => {
      this.dataSource.data = reagents;

      this.dataSource.filterPredicate = (data: Reagent, filter: string) => {
        const searchTerms = JSON.parse(filter);

        const nameMatches = data.name.toLowerCase().includes(searchTerms.name);

        // const categoryMatches = searchTerms.category
        //   ? data.category.toLowerCase() === searchTerms.category
        //   : true;

        return nameMatches;
        // && categoryMatches;
      };
    });
    this.storageService.getAllStorages().subscribe({
      next: (resp) => {
        console.log(resp);
      },
      error: (err) => {
        console.log(err);
      },
    });

    // this.reagentsService.getAllReagents().subscribe()
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

    // After the dialog closes, refresh the list if a reagent was created, but since it's mockdata, it shows up same
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.reagentsService.getReagentsList().subscribe((reagents) => {
          this.dataSource.data = reagents;
        });
      }
    });
  }
}
