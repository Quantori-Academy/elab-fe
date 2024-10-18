import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';
import { catchError, of } from 'rxjs';
import { ChangePasswordService } from '../../auth/services/change-password.service';
import { MaterialModule } from '../../material.module';
import { AuthService } from '../../auth/services/authentication/auth.service';

@Component({
  selector: 'app-first-password-change',
  standalone: true,
  imports: [
    MatCardModule,
    MatButton,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    ReactiveFormsModule,
    MaterialModule,
  ],
  templateUrl: './first-password-change.component.html',
  styleUrls: ['./first-password-change.component.scss'],
})
export class FirstPasswordChangeComponent {
  private changePasswordService = inject(ChangePasswordService);
  private fb: FormBuilder = inject(FormBuilder);
  private router = inject(Router);
  private authService = inject(AuthService);

  passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

  changePasswordForm = this.fb.group(
    {
      currentPassword: ['', Validators.required],
      newPassword: [
        '',
        [Validators.required, Validators.pattern(this.passwordPattern)],
      ],
      confirmPassword: ['', Validators.required],
    },
    {
      validators: [this.passwordMatch()],
    }
  );

  hide = {
    newPassword: true,
    confirmPassword: true,
  };

  get controls() {
    return this.changePasswordForm.controls;
  }

  passwordMatch() {
    return (formGroup: AbstractControl): ValidationErrors | null => {
      const newPasswordControl = formGroup.get('newPassword');
      const confirmPasswordControl = formGroup.get('confirmPassword');

      if (!newPasswordControl || !confirmPasswordControl) {
        return null;
      }

      const newPassword = newPasswordControl.value;
      const confirmPassword = confirmPasswordControl.value;

      if (newPassword !== confirmPassword) {
        confirmPasswordControl.setErrors({ passwordsMatching: true });
      } else {
        if (confirmPasswordControl.hasError('passwordsMatching')) {
          confirmPasswordControl.setErrors(null);
        }
      }

      return null;
    };
  }

  onSubmit() {
    if (this.changePasswordForm.valid) {
      const newPassword = this.controls['newPassword'].value;
      const oldPassword = this.controls['currentPassword'].value;

      if (oldPassword && newPassword) {
        this.changePasswordService
          .changePassword({
            oldPassword,
            newPassword,
          })
          .pipe(
            catchError(() => {
              console.error('Failed to change password');
              return of(null);
            })
          )
          .subscribe((user) => {
            if (user) {
              const cachedUser =
                this.authService.rbacService.getAuthenticatedUser();
              if (cachedUser) {
                cachedUser.isPasswordResetRequired = false;
                this.authService.rbacService.setAuthenticatedUser(cachedUser);
              }

              this.router.navigate(['/dashboard']);
            }
          });
      }
    }
  }
}
