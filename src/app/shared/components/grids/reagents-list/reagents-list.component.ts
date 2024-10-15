import {
  AfterViewInit,
  Component,
  inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { mockReagentsListService } from '../../../services/mock-reagents-list.service';
import { Reagents } from '../../../models/reagent-model';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatButton } from '@angular/material/button';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-reagents-list',
  standalone: true,
  imports: [
    MatTableModule,
    MatIconModule,
    MatPaginatorModule,
    MatSortModule,
    MatButton,
    FormsModule
  ],
  templateUrl: './reagents-list.component.html',
  styleUrl: './reagents-list.component.scss',
})
export class ReagentsListComponent implements OnInit, AfterViewInit {
  private _liveAnnouncer = inject(LiveAnnouncer);
  private mockReagentsList = inject(mockReagentsListService);

  currentPage = 0;
  showfilter = false;
  filterValue = '';
  displayedColumns: string[] = [
    'name',
    'desc',
    'category',
    'quantity',
    'storageLocation',
    'structure',
    'actions',
  ];
  dataSource = new MatTableDataSource<Reagents>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngOnInit(): void {
    this.mockReagentsList.getReagentsList().subscribe((reagents) => {
      this.dataSource.data = reagents;
      this.dataSource.filterPredicate = (data: Reagents, filter: string) => {
        const name = data.name.toLowerCase(); 
        return name.includes(filter);
      };
    });
  }
  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  showFilterField() {
    this.showfilter = !this.showfilter;
    console.log(this.showfilter);
  }
  applyFilter() {
    this.dataSource.filter = this.filterValue.trim().toLowerCase();
  }
  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }
}
