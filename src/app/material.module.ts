import { NgModule } from '@angular/core';
import {
  MatAutocompleteModule,
  MatOption,
} from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_FORM_FIELD_DEFAULT_OPTIONS,
  MatFormField,
} from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelect } from '@angular/material/select';

@NgModule({
  imports: [
    MatButtonModule,
    MatFormField,
    MatInputModule,
    MatIcon,
    MatPaginatorModule,
    MatAutocompleteModule,
    MatSelect,
    MatOption,
  ],
  exports: [
    MatButtonModule,
    MatFormField,
    MatInputModule,
    MatIcon,
    MatPaginatorModule,
    MatAutocompleteModule,
    MatSelect,
    MatOption,
  ],
  providers: [
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: { appearance: 'outline' },
    },
  ],
})
export class MaterialModule {}
