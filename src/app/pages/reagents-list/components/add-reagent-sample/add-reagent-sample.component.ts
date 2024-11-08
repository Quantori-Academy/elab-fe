import {
  Component,
  OnInit,
  inject,
  Inject,
  ChangeDetectionStrategy,
  OnDestroy,
  computed,
} from '@angular/core';
import { MaterialModule } from '../../../../material.module';
import { MoleculeStructureComponent } from '../../../../shared/components/molecule-structure/molecule-structure.component';
import { MatTableDataSource } from '@angular/material/table';
import {
  Reagent,
  ReagentListColumn,
  SelectedReagentSample,
} from '../../../../shared/models/reagent-model';
import { PageEvent } from '@angular/material/paginator';
import { ReagentsService } from '../../../../shared/services/reagents.service';
import { Sort } from '@angular/material/sort';
import {
  FormArray,
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Subject, takeUntil } from 'rxjs';
import { ReagentsQueryService } from '../../services/reagents-query.service';
import { PAGE_SIZE_OPTIONS } from '../../../../shared/units/variables.units';
import { TableLoaderSpinnerComponent } from '../../../../shared/components/table-loader-spinner/table-loader-spinner.component';

@Component({
  selector: 'app-add-reagent-sample',
  standalone: true,
  imports: [
    FormsModule,
    MaterialModule,
    MoleculeStructureComponent,
    ReactiveFormsModule,
    TableLoaderSpinnerComponent,
  ],
  providers: [ReagentsService, ReagentsQueryService],
  templateUrl: './add-reagent-sample.component.html',
  styleUrl: './add-reagent-sample.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddReagentSampleComponent implements OnInit, OnDestroy {
  private reagentsService = inject(ReagentsService);
  private reagentsQueryService = inject(ReagentsQueryService);
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<AddReagentSampleComponent>);
  private destroy$ = new Subject<void>();

  public displayedColumns: string[] = [
    'name',
    'category',
    'structure',
    'quantity',
    'quantityLeft',
    'isSelect',
    'selectQuantity',
  ];
  public currentPage = 0;
  public reagentsSize = 0;
  public pageSize = this.reagentsQueryService.pageSize;
  public isLoading = computed(() => this.reagentsQueryService.isLoading());
  public pageSizeOptions = inject(PAGE_SIZE_OPTIONS);
  public selectedReagentSample: SelectedReagentSample[] = [];

  public formSelection = this.fb.group({ reagents: this.fb.array([]) });

  public dataSource = new MatTableDataSource<Reagent>();

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: { selectedReagentSample: SelectedReagentSample[] }
  ) {
    this.selectedReagentSample = data.selectedReagentSample;
  }

  ngOnInit(): void {
    // Initially load the reagents without sorting
    this.reagentsService
      .getReagents()
      .pipe(takeUntil(this.destroy$))
      .subscribe((reagentsResponse) => {
        this.setReagentsFormArray(reagentsResponse.reagents);
        this.dataSource.data = reagentsResponse.reagents;
        this.reagentsSize = reagentsResponse.size;
      });
  }

  public setReagentsFormArray(reagents: Reagent[]) {
    const formArray = this.formSelection.get('reagents') as FormArray;

    reagents.forEach((reagent, index) => {
      const selectedReagent = this.hasSelectedReagent(reagent.id!);

      const reagentControl = this.fb.group({
        reagentId: [reagent.id],
        isSelect: [selectedReagent?.isSelect ? true : false],
        quantityUsed: [
          selectedReagent?.quantityUsed || 0,
          [
            Validators.min(0),
            Validators.max(reagent.quantityLeft || 0),
            Validators.required,
          ],
        ],
        quantityUnit: [reagent.quantityUnit],
        name: [reagent.name],
        structure: [reagent.structure],
      });

      const quantityUsedControl = reagentControl.get('quantityUsed');
      const isSelectControl = reagentControl.get('isSelect');

      if (!isSelectControl?.value) {
        quantityUsedControl?.disable();
      }

      if (selectedReagent?.errorMessage) {
        quantityUsedControl?.setValidators(() =>
          quantityUsedControl.value === selectedReagent.quantityUsed
            ? { serverError: selectedReagent.errorMessage }
            : null
        );
        quantityUsedControl?.updateValueAndValidity();
        quantityUsedControl?.markAsTouched();
      }

      isSelectControl?.valueChanges
        .pipe(takeUntil(this.destroy$))
        .subscribe((isSelected) => {
          if (isSelected) {
            quantityUsedControl?.enable();
          } else {
            quantityUsedControl?.disable();
          }
        });

      formArray.setControl(index, reagentControl);
    });
  }

  public get reagentsFormArray(): FormArray {
    return this.formSelection.get('reagents') as FormArray;
  }

  public get getSelectedReagentSample(): SelectedReagentSample[] {
    const reagents = this.reagentsFormArray.value as SelectedReagentSample[];

    reagents.forEach((reagent) => {
      if (reagent.isSelect) {
        const hasSelectedReagent = this.hasSelectedReagent(reagent.reagentId);
        if (hasSelectedReagent) {
          hasSelectedReagent.quantityUsed = reagent.quantityUsed;
        } else {
          this.selectedReagentSample.push(reagent);
        }
      } else {
        const index = this.selectedReagentSample.findIndex(
          (selectedReagent) => selectedReagent.reagentId === reagent.reagentId
        );
        if (index !== -1) {
          this.selectedReagentSample.splice(index, 1);
        }
      }
    });
    return this.selectedReagentSample;
  }

  public hasSelectedReagent(
    reagentId: number
  ): SelectedReagentSample | undefined {
    return this.selectedReagentSample.find(
      (reagent) => reagent.reagentId === reagentId
    );
  }

  public hasError(
    index: number,
    label: string,
    error: string
  ): boolean | undefined {
    return this.reagentsFormArray.at(index).get(label)?.hasError(error);
  }

  public onSave(): void {
    if (this.formSelection.valid) {
      this.dialogRef.close(this.getSelectedReagentSample);
    } else {
      this.formSelection.markAllAsTouched();
    }
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

  handlePageEvent($event: PageEvent) {
    this.reagentsQueryService.setPageData($event);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
