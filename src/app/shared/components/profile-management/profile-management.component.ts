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
import { Profile } from '../../../auth/roles/types';
import { Router } from '@angular/router';
import { ChangePasswordService } from '../../../core/services/change-password.service';
import { AuthService } from '../../../auth/services/authentication/auth.service';
import { RbacService } from '../../../auth/services/authentication/rbac.service';
import { NotificationPopupComponent } from '../notification-popup/notification-popup.component';

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
  private router: Router = inject(Router);

  user: null | Profile = null;
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
      .then((user) => {
        // since getCurrentUser() is returning void, ts suggested to first convert user to unknown
        this.user = user as unknown as Profile;
      })
      .catch((error) => {
        console.error('Error loading user profile:', error);
      });
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
      validators: [
        this.passwordMatch(),
        // this.currentPasswordMatching()
      ],
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

  // this might not be necessary if backend is doing it already
  // currentPasswordMatching() {
  //   return (formGroup: AbstractControl): ValidationErrors | null => {
  //     const currentPasswordControl = formGroup.get('currentPassword');

  //     if (!currentPasswordControl || !this.user) {
  //       return null;
  //     }

  //     if (currentPasswordControl.hasError('required')) {
  //       return null;
  //     }
  //     const currentPassword = currentPasswordControl.value;

  //     // Comparing the entered current password with the actual user password
  //     if (currentPassword !== this.user.password) {
  //       currentPasswordControl.setErrors({ currentPasswordMismatch: true });
  //     } else {
  //       if (currentPasswordControl.hasError('currentPasswordMismatch')) {
  //         currentPasswordControl.setErrors(null);
  //       }
  //     }

  //     return null;
  //   };
  // }

  onPasswordChange(oldPassword: string, newPassword: string) {
    this.changePasswordService.changePassword({ oldPassword, newPassword });
  }

  onSubmit() {
    if (this.changePasswordForm.valid) {
      const newPassword = this.controls['newPassword'].value;
      const oldPassword = this.controls['currentPassword'].value;
      this.onPasswordChange(oldPassword!, newPassword!);
    } else {
      console.log('Form Invalid');
    }
    return this.togglePasswordChange();
  }
}
