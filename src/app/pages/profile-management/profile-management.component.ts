import { Component, inject, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import {
  trigger,
  style,
  transition,
  animate,
  query,
  stagger,
} from '@angular/animations';
import { Profile } from '../../auth/roles/types';
import { ChangePasswordService } from '../../auth/services/change-password.service';
import { AuthService } from '../../auth/services/authentication/auth.service';
import { RbacService } from '../../auth/services/authentication/rbac.service';
import { NotificationPopupComponent } from '../../shared/components/notification-popup/notification-popup.component';
import { catchError, of } from 'rxjs';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile-management',
  standalone: true,
  imports: [
    MatCardModule,
    MatButton,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    ReactiveFormsModule,
    NotificationPopupComponent,
    TranslateModule,
    CommonModule,
  ],
  templateUrl: './profile-management.component.html',
  styleUrl: './profile-management.component.scss',
  animations: [
    trigger('formSlideUp', [
      transition(':enter', [
        query('mat-form-field', [
          style({ transform: 'translateY(20px)', opacity: 0 }),
          stagger(150, [
            animate(
              '600ms ease-out',
              style({ transform: 'translateY(0)', opacity: 1 })
            ),
          ]),
        ]),
      ]),
      transition(':leave', [
        query('mat-form-field', [
          stagger(100, [
            animate(
              '500ms ease-in',
              style({ transform: 'translateY(20px)', opacity: 0 })
            ),
          ]),
        ]),
      ]),
    ]),
  ],
})
export class ProfilePageComponent implements OnInit {
  private changePasswordService = inject(ChangePasswordService);
  private authService = inject(AuthService);
  private rbacService = inject(RbacService);
  private fb: FormBuilder = inject(FormBuilder);
  private translate = inject(TranslateService);

  public get user(): Profile | null {
    return this.rbacService.getAuthenticatedUser() ?? null;
  }

  changePassword = false;

  //newPassword pattern;
  passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

  togglePasswordChange() {
    this.changePassword = !this.changePassword;
    this.changePasswordForm.reset();
  }

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile() {
    this.authService
      .getCurrentUser()
      .pipe(
        catchError((error) => {
          console.error('Error loading user profile:', error);
          return of(null);
        })
      )
      .subscribe();
  }

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
        this.onPasswordChange(oldPassword, newPassword).subscribe(() => {
          console.log('Password changed');
          this.togglePasswordChange();
        });
      } else {
        console.log('Password fields are missing');
      }
    } else {
      console.log('Form Invalid');
    }
  }
  onPasswordChange(oldPassword: string, newPassword: string) {
    return this.changePasswordService.changePassword({
      oldPassword,
      newPassword,
    });
  }
}
