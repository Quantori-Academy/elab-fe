import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
  OnDestroy,
} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { finalize, Subject, take, takeUntil } from 'rxjs';
import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { confirmPasswordValidator } from '../../shared/validators/confirm-password.validator';
import { ForgotPasswordService } from '../../auth/services/forgot-password/forgot-password.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIcon,
    MatProgressSpinnerModule,
    ReactiveFormsModule,
    TranslateModule,
  ],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResetPasswordComponent implements OnInit, OnDestroy {
  public resetPasswordForm!: FormGroup;
  public MIN_LENGTH = 8;
  public hide = {
    newPassword: true,
    confirmPassword: true,
  };
  public isLoading = signal(false);
  private resetToken: string | null = null;

  private fb = inject(FormBuilder);
  private router = inject(Router);
  private forgotPasswordService = inject(ForgotPasswordService);
  private destroy$ = new Subject<void>();

  constructor(private route: ActivatedRoute) {
    this.resetPasswordForm = this.fb.group(
      {
        newPassword: [
          '',
          [Validators.required, Validators.minLength(this.MIN_LENGTH)],
        ],
        confirmPassword: ['', [Validators.required]],
      },
      { validators: confirmPasswordValidator.bind(this) }
    );
  }

  ngOnInit(): void {
    this.route.queryParams.pipe(take(1)).subscribe((params) => {
      this.resetToken = params['reset_token'];
    });
  }

  public get confirmPassword(): AbstractControl {
    return this.resetPasswordForm.get('confirmPassword')!;
  }

  hasError(label: string, error: string): boolean | undefined {
    return this.resetPasswordForm.get(label)?.hasError(error);
  }

  redirectTo(path: string): void {
    this.router.navigate([path]);
  }

  onSubmit(): void {
    if (this.resetPasswordForm.valid) {
      this.isLoading.set(true);
      const formValue = this.resetPasswordForm.value;
      this.forgotPasswordService
        .resetPassword({
          resetToken: this.resetToken!,
          ...formValue,
        })
        .pipe(
          takeUntil(this.destroy$),
          finalize(() => this.isLoading.set(false))
        )
        .subscribe({
          next: () => this.redirectTo('login'),
          error: (error: HttpErrorResponse) => {
            if (error.status == HttpStatusCode.BadRequest) {
              this.confirmPassword.setErrors({ passwordNoMatch: true });
            }
          },
        });
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
