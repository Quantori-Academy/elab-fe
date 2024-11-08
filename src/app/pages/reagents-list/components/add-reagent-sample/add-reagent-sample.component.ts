import {
  Component,
  ViewChild,
  OnInit,
  AfterViewInit,
  inject,
  Inject,
  ChangeDetectionStrategy,
  OnDestroy,
} from '@angular/core';
import { MaterialModule } from '../../../../material.module';
import { MoleculeStructureComponent } from '../../../../shared/components/molecule-structure/molecule-structure.component';
import { MatTableDataSource } from '@angular/material/table';
import {
  Reagent,
  SelectedReagentSample,
} from '../../../../shared/models/reagent-model';
import { MatPaginator } from '@angular/material/paginator';
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
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-add-reagent-sample',
  standalone: true,
  imports: [
    FormsModule,
    MaterialModule,
    MoleculeStructureComponent,
    ReactiveFormsModule,
    NgIf,
  ],
  templateUrl: './add-reagent-sample.component.html',
  styleUrl: './add-reagent-sample.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddReagentSampleComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  public displayedColumns: string[] = [
    'name',
    'category',
    'structure',
    'quantity',
    'quantityLeft',
    'isSelect',
    'selectQuantity',
  ];
  public selectedCategory = '';
  public filterValue = '';
  public currentPage = 0;
  public sortDirection: 'asc' | 'desc' = 'asc';
  public sortColumn = 'name';
  public selectedReagentSample: SelectedReagentSample[] = [];

  private reagentsService = inject(ReagentsService);
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<AddReagentSampleComponent>);
  private destroy$ = new Subject<void>();

  public formSelection = this.fb.group({ reagents: this.fb.array([]) });

  public dataSource = new MatTableDataSource<Reagent>();

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: { selectedReagentSample: SelectedReagentSample[] }
  ) {
    this.selectedReagentSample = data.selectedReagentSample;
  }

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
      .pipe(takeUntil(this.destroy$))
      .subscribe((reagents) => {
        this.setReagentsFormArray(reagents);
        this.dataSource.data = reagents;
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
            ? { serverError: true }
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

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  applyFilter() {
    this.loadReagents();
  }

  public hasError(
    index: number,
    label: string,
    error: string
  ): boolean | undefined {
    return this.reagentsFormArray.at(index).get(label)?.hasError(error);
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

  public onSave(): void {
    if (this.formSelection.valid) {
      this.dialogRef.close(this.getSelectedReagentSample);
    } else {
      this.formSelection.markAllAsTouched();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
