import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export function storageLocationAutoCompleteValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    return value && typeof value === 'string'
      ? { invalidOption: true }
      : null;
  };
}
