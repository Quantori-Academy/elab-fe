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
import { trigger, style, transition, animate, query, stagger } from '@angular/animations';
import { IUser, UserRoles } from '../../types/IUser';
import { Router } from '@angular/router';
import { MockProfileService } from '../../../core/services/mockProfile.service';

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
  ],
  templateUrl: './profile-management.component.html',
  styleUrl: './profile-management.component.scss',
  animations: [
    trigger('formSlideUp', [
      transition(':enter', [
        query('mat-form-field', [
          style({ transform: 'translateY(20px)', opacity: 0 }),
          stagger(150, [
            animate('600ms ease-out', style({ transform: 'translateY(0)', opacity: 1 }))
          ])
        ])
      ]), transition(':leave', [
        query('mat-form-field', [
          stagger(100, [
            animate('500ms ease-in', style({ transform: 'translateY(20px)', opacity: 0 }))
          ])
        ])
      ])
    ])
  ]
})
export class ProfilePageComponent implements OnInit {
  private mockProfileService:MockProfileService = inject(MockProfileService);
  private fb:FormBuilder = inject(FormBuilder);
  private router:Router = inject(Router);

  firstName = '';
  lastName = '';
  role = UserRoles.Researcher;
  readonly email = '';
  user!: IUser;
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

  loadProfile(): void {
    this.mockProfileService.getUserProfile().subscribe((user) => {
      this.user = user;
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
      validators: [this.passwordMatch(), this.currentPasswordMatching()],
    }
  );

  get controls() {
    return this.changePasswordForm.controls;
  }

  get userRole(): string {
    return UserRoles[this.role];
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

  currentPasswordMatching() {
    return (formGroup: AbstractControl): ValidationErrors | null => {
      const currentPasswordControl = formGroup.get('currentPassword');

      if (!currentPasswordControl || !this.user) {
        return null;
      }

      if (currentPasswordControl.hasError('required')) {
        return null;
      }
      const currentPassword = currentPasswordControl.value;

      // Comparing the entered current password with the actual user password
      if (currentPassword !== this.user.password) {
        currentPasswordControl.setErrors({ currentPasswordMismatch: true });
      } else {
        if (currentPasswordControl.hasError('currentPasswordMismatch')) {
          currentPasswordControl.setErrors(null);
        }
      }

      return null;
    };
  }

  onPasswordChange(newPassword: string): void {
    this.mockProfileService.updatePassword(newPassword).subscribe((success) => {
      if (success) {
        console.log(`Password changed to ${newPassword}`);
      }
    });
  }

  onSubmit() {
    if (this.changePasswordForm.valid) {
      const newPassword = this.controls['newPassword'].value;
      this.onPasswordChange(newPassword!);
    } else {
      console.log('Form Invalid');
    }
    return this.togglePasswordChange();
  }
}
