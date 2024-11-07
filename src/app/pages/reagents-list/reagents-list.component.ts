import {
  Component,
  computed,
  inject,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ReagentsService } from '../../shared/services/reagents.service';
import {
  Reagent,
  ReagentListColumn,
  ReagentListFilteredData,
} from '../../shared/models/reagent-model';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { StructureDialogComponent } from './components/structure-dialog/structure-dialog.component';
import { MaterialModule } from '../../material.module';
import { MoleculeStructureComponent } from '../../shared/components/molecule-structure/molecule-structure.component';
import { Router } from '@angular/router';
import { TableLoaderSpinnerComponent } from '../../shared/components/table-loader-spinner/table-loader-spinner.component';
import {
  debounceTime,
  distinctUntilChanged,
  Observable,
  Subject,
  takeUntil,
  tap,
} from 'rxjs';
import { ReagentsQueryService } from './services/reagents-query.service';
import { PAGE_SIZE_OPTIONS } from '../../shared/units/variables.units';
import { SpinnerDirective } from '../../shared/directives/spinner/spinner.directive';

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
    SpinnerDirective,
  ],
  templateUrl: './reagents-list.component.html',
  styleUrl: './reagents-list.component.scss',
})
export class ReagentsListComponent implements OnInit, OnDestroy {
  @Input() storageLocationId?: number;
  private readonly DEBOUNCE_TIME = 1000;
  private dialog = inject(MatDialog);
  private reagentsService = inject(ReagentsService);
  private reagentsQueryService = inject(ReagentsQueryService);
  private router = inject(Router);
  private filterSubject = new Subject<ReagentListFilteredData>();
  private destroy$ = new Subject<void>();

  public currentPage = 0;
  public pageSize = this.reagentsQueryService.pageSize;
  public isLoading = computed(() => this.reagentsQueryService.isLoading());
  public pageSizeOptions = inject(PAGE_SIZE_OPTIONS);

  public displayedColumns: ReagentListColumn[] = [
    ReagentListColumn.NAME,
    ReagentListColumn.CATEGORY,
    ReagentListColumn.STRUCTURE,
    ReagentListColumn.QUANTITY,
    ReagentListColumn.QUANTITYLEFT,
    ReagentListColumn.CAS,
    ReagentListColumn.LOCATION,
    ReagentListColumn.ACTIONS,
  ];

  public reagents$?: Observable<Reagent[] | undefined>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngOnInit(): void {
    this.reagents$ = this.storageLocationId
      ? this.reagentsService.getReagents(this.storageLocationId)
      : this.reagentsService.getReagents();
    this.setFilterName();
  }

  private setFilterName() {
    this.filterSubject
      .pipe(
        tap(() => this.reagentsQueryService.isLoading.set(true)),
        debounceTime(this.DEBOUNCE_TIME),
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      )
      .subscribe((filterData) => {
        this.reagentsQueryService.setFilteringPageData(filterData);
      });
  }

  onFilterName($event: Event) {
    const value = ($event.target as HTMLInputElement).value;
    this.filterSubject.next({ value, column: ReagentListColumn.NAME });
  }

  onFilterCategory(value: string) {
    this.reagentsQueryService.setFilteringPageData({
      value,
      column: ReagentListColumn.CATEGORY,
    });
  }

  onSortChange(sort: Sort) {
    this.reagentsQueryService.setSortingPageData(sort);
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

  handlePageEvent($event: PageEvent) {
    this.reagentsQueryService.setPageData($event);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
