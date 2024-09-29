import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { confirmPasswordValidator } from '../../../shared/validators/confirm-password.validator';
import { NgIf } from '@angular/common';
import { ForgotPasswordService } from '../../services/forgot-password/forgot-password.service';
import { NewPassword } from '../../models/forgot-password.interface';
import { take } from 'rxjs';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [
    RouterOutlet,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIcon,
    ReactiveFormsModule,
    NgIf,
  ],
  providers: [ForgotPasswordService],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ForgotPasswordComponent {
  public newPasswordForm!: FormGroup;
  public MIN_LENGTH = 8;
  public hide = {
    newPassword: true,
    confirmPassword: true,
  };

  private fb = inject(FormBuilder);
  private router = inject(Router);
  private forgotPasswordService = inject(ForgotPasswordService);

  constructor() {
    this.newPasswordForm = this.fb.group(
      {
        email: ['', [Validators.required, Validators.email]],
        newPassword: [
          '',
          [Validators.required, Validators.minLength(this.MIN_LENGTH)],
        ],
        confirmPassword: ['', [Validators.required]],
      },
      { validators: confirmPasswordValidator.bind(this) }
    );
  }

  public get email(): AbstractControl {
    return this.newPasswordForm.get('email')!;
  }

  public get newPassword(): AbstractControl {
    return this.newPasswordForm.get('newPassword')!;
  }

  public get confirmPassword(): AbstractControl {
    return this.newPasswordForm.get('confirmPassword')!;
  }

  hasError(label: string, error: string): boolean | undefined {
    return this.newPasswordForm.get(label)?.hasError(error);
  }

  onCancel(): void {
    this.router.navigate(['login']);
  }

  onSubmit(): void {
    if (this.newPasswordForm.valid) {
      const { email, newPassword } = this.newPasswordForm.value;
      const newPasswordObj: NewPassword = { email, newPassword };
      const isPasswordChanged =
        this.forgotPasswordService.changePassword(newPasswordObj);

      isPasswordChanged.pipe(take(1)).subscribe((value) => {
        if (value) {
          this.router.navigate(['login']);
        } else {
          this.email.setErrors({ emailNotExist: true });
        }
      });
    }
  }
}
