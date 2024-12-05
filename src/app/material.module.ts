import { NgModule } from '@angular/core';
import {
  MatAutocompleteModule,
  MatOption,
} from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import {
  MAT_FORM_FIELD_DEFAULT_OPTIONS,
  MatError,
  MatFormField,
  MatLabel,
} from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatToolbar } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelect } from '@angular/material/select';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule } from '@angular/material/dialog';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { MatMenuModule } from '@angular/material/menu';

@NgModule({
  imports: [
    MatButtonModule,
    MatFormField,
    MatInputModule,
    MatPaginatorModule,
    MatAutocompleteModule,
    MatSelect,
    MatOption,
    MatToolbar,
    MatIcon,
    MatSortModule,
    MatIconModule,
    MatSidenavModule,
    MatTableModule,
    MatSelectModule,
    MatOptionModule,
    MatGridListModule,
    MatListModule,
    MatError,
    MatDatepickerModule,
    MatLabel,
    MatDialogModule,
    MatProgressSpinnerModule,
    MatCardModule,
    MatCheckboxModule,
    MatExpansionModule,
    MatTooltipModule,
    ClipboardModule
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
  ],
  exports: [
    MatButtonModule,
    MatFormField,
    MatGridListModule,
    MatInputModule,
    MatSortModule,
    MatDatepickerModule,
    MatIcon,
    MatTableModule,
    MatPaginatorModule,
    MatAutocompleteModule,
    MatSelect,
    MatOption,
    MatToolbar,
    MatIconModule,
    MatSidenavModule,
    MatSelectModule,
    MatOptionModule,
    MatListModule,
    MatError,
    MatLabel,
    MatDialogModule,
    MatProgressSpinnerModule,
    MatCardModule,
    MatCheckboxModule,
    MatExpansionModule,
    MatTooltipModule,
    ClipboardModule
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
  ],
  providers: [
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: { appearance: 'outline' },
    },
  ],
})
export class MaterialModule {}
