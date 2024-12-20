import {
  Component,
  computed,
  inject,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { ReagentsService } from '../../shared/services/reagents.service';
import {
  Reagent,
  ReagentListColumn,
  ReagentListResponse,
} from '../../shared/models/reagent-model';
import { PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { StructureDialogComponent } from './components/structure-dialog/structure-dialog.component';
import { MaterialModule } from '../../material.module';
import { MoleculeStructureComponent } from '../../shared/components/molecule-structure/molecule-structure.component';
import { Router, RouterLink } from '@angular/router';
import { TableLoaderSpinnerComponent } from '../../shared/components/table-loader-spinner/table-loader-spinner.component';
import { first, Observable, Subject, takeUntil } from 'rxjs';
import { ReagentsQueryService } from './services/reagents-query.service';
import { PAGE_SIZE_OPTIONS } from '../../shared/units/variables.units';
import { SpinnerDirective } from '../../shared/directives/spinner/spinner.directive';
import { RbacService } from '../../auth/services/authentication/rbac.service';
import { AddStructureComponent } from '../../shared/components/structure-editor/add-structure/add-structure.component';
import { MoveReagentComponent } from './components/move-reagent/move-reagent.component';
import { NoDataComponent } from '../../shared/components/no-data/no-data.component';
import { EditReagentComponent } from './components/edit-reagent/edit-reagent.component';
import { UploadReagentComponent } from './components/upload-reagent/upload-reagent.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

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
    NoDataComponent,
    RouterLink,
    TranslateModule
  ],
  providers: [ReagentsService, ReagentsQueryService],
  templateUrl: './reagents-list.component.html',
  styleUrl: './reagents-list.component.scss',
})
export class ReagentsListComponent implements OnInit, OnDestroy {
  @Input() storageLocationId?: number;
  @Input() showButton = true;
  private dialog = inject(MatDialog);
  private reagentsService = inject(ReagentsService);
  private reagentsQueryService = inject(ReagentsQueryService);
  private rbacService = inject(RbacService);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private destroy$ = new Subject<void>();
  private translate = inject(TranslateService);
  filterStructureValue = '';
  isFullStructure = false;

  public currentPage = 0;
  public pageSize = this.reagentsQueryService.pageSize;
  public isLoading = computed(() => this.reagentsQueryService.isLoading());
  public pageSizeOptions = inject(PAGE_SIZE_OPTIONS);
  public isResearcher = this.rbacService.isResearcher();
  public movedReagents = new Map<number, Set<number>>();
  public isOpenMoveForm = false;
  public moveForm = this.fb.group({
    sourceStorageId: ['', [Validators.required]],
    destinationStorageId: ['', [Validators.required]],
  });

  public displayedColumns: ReagentListColumn[] = [
    ...(this.isResearcher ? [ReagentListColumn.CHECKBOX] : []),
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

  isReagentsSelected(): boolean {
    return this.movedReagents.size !== 0;
  }

  selectMovedReagents(element: Reagent) {
    if (this.movedReagents.has(element.storageId)) {
      const movedReagentStorage = this.movedReagents.get(element.storageId);
      if (movedReagentStorage?.has(element.id!)) {
        movedReagentStorage.delete(element.id!);
      } else {
        movedReagentStorage?.add(element.id!);
      }

      if (!movedReagentStorage?.size) {
        this.movedReagents.delete(element.storageId);
      }
    } else {
      this.movedReagents.set(element.storageId, new Set([element.id!]));
    }
  }

  openMoveReagentDialog() {
    if (this.movedReagents.size) {
      this.dialog
        .open(MoveReagentComponent, {
          data: { movedReagents: this.movedReagents },
          width: '400px',
        })
        .afterClosed()
        .pipe(takeUntil(this.destroy$))
        .subscribe((value) => {
          if (value) {
            this.reagentsQueryService.reloadReagentList();
          }
        });
    }
  }

  private updateStructureFilter(value: string): void {
    this.reagentsQueryService.structureFilterSubject.next({
      value: value,
      column: ReagentListColumn.STRUCTURE,
      isFullStructure: this.isFullStructure,
    });
  }

  onEditReagent(element: Reagent) {
    this.dialog
      .open(EditReagentComponent, { data: element, width: '400px' })
      .afterClosed()
      .pipe(first())
      .subscribe((isEdited) => {
        if (isEdited) {
          this.reagentsQueryService.reloadReagentList();
        }
      });
  }

  onUploadReagent() {
    this.dialog
      .open(UploadReagentComponent, { width: '400px' })
      .afterClosed()
      .pipe(first())
      .subscribe((isUpload) => {
        if (isUpload) {
          this.reagentsQueryService.reloadReagentList();
        }
      });
  }

  onFilterName($event: Event) {
    const value = ($event.target as HTMLInputElement).value;
    this.reagentsQueryService.nameFilterSubject.next({
      value,
      column: ReagentListColumn.NAME,
    });
  }

  onFilterStructure(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.filterStructureValue = value;
    this.updateStructureFilter(value);
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

  openStructureEditor(
    enterAnimationDuration: string,
    exitAnimationDuration: string
  ) {
    const dialogRef = this.dialog.open(AddStructureComponent, {
      width: '650px',
      height: '600px',
      minWidth: '650px',
      minHeight: '600px',
      enterAnimationDuration,
      exitAnimationDuration,
      restoreFocus: false,
      data: { smiles: this.filterStructureValue },
    });

    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe((result) => {
        if (result) {
          this.filterStructureValue = result;
          this.updateStructureFilter(result);
        }
      });
  }

  toggleFullStructureSearch(): void {
    this.isFullStructure = !this.isFullStructure;
    this.updateStructureFilter(this.filterStructureValue);
  }

  redirectToCreatePage(page: 'reagent' | 'sample') {
    if (page === 'reagent') {
      this.router.navigate(['reagents/create-reagent']);
    } else {
      this.router.navigate(['reagents/create-sample']);
    }
  }

  redirectToReagentPage(reagent: Reagent) {
    this.router.navigate([`/reagents`, reagent.id]);
  }

  handlePageEvent($event: PageEvent) {
    this.reagentsQueryService.setPageData($event);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
