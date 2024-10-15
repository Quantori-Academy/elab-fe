import {
  AfterViewInit,
  Component,
  inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { mockReagentsListService } from '../../shared/services/mock-reagents-list.service';
import { Reagents } from '../../shared/models/reagent-model';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatButton } from '@angular/material/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatLabel } from '@angular/material/form-field';
import { MatSelect } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { MatGridListModule } from '@angular/material/grid-list';

@Component({
  selector: 'app-reagents-list',
  standalone: true,
  imports: [
    MatTableModule,
    MatIconModule,
    MatPaginatorModule,
    MatSortModule,
    MatButton,
    FormsModule,
    MatFormFieldModule,
    MatLabel,
    MatSelect,
    MatOptionModule,
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatGridListModule,
    MatOptionModule,
  ],
  templateUrl: './reagents-list.component.html',
  styleUrl: './reagents-list.component.scss',
})
export class ReagentsListComponent implements OnInit, AfterViewInit {
  private _liveAnnouncer = inject(LiveAnnouncer);
  private mockReagentsList = inject(mockReagentsListService);

  selectedCategory = '';
  filterValue = '';
  currentPage = 0;
  displayedColumns: string[] = [
    'name',
    'desc',
    'category',
    'quantity',
    'storageLocation',
    'structure',
    'dateOfCreation',
    'actions',
  ];

  dataSource = new MatTableDataSource<Reagents>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngOnInit(): void {
    this.mockReagentsList.getReagentsList().subscribe((reagents) => {
      this.dataSource.data = reagents;

      this.dataSource.filterPredicate = (data: Reagents, filter: string) => {
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

  // sorts name and categories if hovered on column head
  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

  // openCreateReagentDialog() {} //this for create new reagent form
}
