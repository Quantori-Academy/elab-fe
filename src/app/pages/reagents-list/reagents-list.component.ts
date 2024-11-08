import { Component, computed, inject, Input, OnInit } from '@angular/core';
import { ReagentsService } from '../../shared/services/reagents.service';
import {
  ReagentListColumn,
  ReagentListResponse,
} from '../../shared/models/reagent-model';
import { PageEvent } from '@angular/material/paginator';
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
import { ReagentsQueryService } from './services/reagents-query.service';
import { PAGE_SIZE_OPTIONS } from '../../shared/units/variables.units';
import { SpinnerDirective } from '../../shared/directives/spinner/spinner.directive';
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
    SpinnerDirective,
  ],
  providers: [ReagentsService, ReagentsQueryService],
  templateUrl: './reagents-list.component.html',
  styleUrl: './reagents-list.component.scss',
})
export class ReagentsListComponent implements OnInit {
  @Input() storageLocationId?: number;
  private dialog = inject(MatDialog);
  private reagentsService = inject(ReagentsService);
  private reagentsQueryService = inject(ReagentsQueryService);
  private rbacService = inject(RbacService);
  private router = inject(Router);

  public currentPage = 0;
  public pageSize = this.reagentsQueryService.pageSize;
  public isLoading = computed(() => this.reagentsQueryService.isLoading());
  public pageSizeOptions = inject(PAGE_SIZE_OPTIONS);
  public isResearcher = this.rbacService.isResearcher();

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

  public reagentsResponse$?: Observable<ReagentListResponse | undefined>;

  ngOnInit(): void {
    this.reagentsResponse$ = this.storageLocationId
      ? this.reagentsService.getReagents(this.storageLocationId)
      : this.reagentsService.getReagents();
  }

  onFilterName($event: Event) {
    const value = ($event.target as HTMLInputElement).value;
    this.reagentsQueryService.nameFilterSubject.next({
      value,
      column: ReagentListColumn.NAME,
    });
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
}
