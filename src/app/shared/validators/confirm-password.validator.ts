import { AbstractControl } from '@angular/forms';

export const confirmPasswordValidator = (control: AbstractControl) => {
  const password = control.value.newPassword;
  const confirmPassword = control.value.confirmPassword;
  const confirmPasswordControl = control.get('confirmPassword');
  const confirmPasswordErrors = control.get('confirmPassword')?.errors;

  if (password && confirmPassword && password !== confirmPassword) {
    confirmPasswordControl?.setErrors({
      ...confirmPasswordErrors,
      passwordNoMatch: true,
    });
  } else {
    confirmPasswordControl?.setErrors(confirmPasswordErrors!);
  }
};
