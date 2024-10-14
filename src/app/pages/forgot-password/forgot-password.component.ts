import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnDestroy,
  signal,
} from '@angular/core';
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
import { NgClass } from '@angular/common';
import { ForgotPasswordService } from '../../auth/services/forgot-password/forgot-password.service';
import { finalize, Subject, takeUntil } from 'rxjs';
import { MatIcon } from '@angular/material/icon';
import {
  EmailSendResponse,
  EmailSendSuccess,
} from '../../auth/models/forgot-password.interface';
import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { fadeInOutEmailSuccess } from '../../shared/animations/fadeInOut/fadeInOut.animation';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

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
    MatProgressSpinnerModule,
    ReactiveFormsModule,
    NgClass,
  ],
  providers: [ForgotPasswordService],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss',
  animations: [fadeInOutEmailSuccess],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ForgotPasswordComponent implements OnDestroy {
  public forgotPasswordForm!: FormGroup;
  public isLoading = signal(false);
  public sendEmailSuccess = signal<EmailSendSuccess>({
    isSuccess: false,
    message: '',
  });

  private fb = inject(FormBuilder);
  private router = inject(Router);
  private forgotPasswordService = inject(ForgotPasswordService);
  private destroy$ = new Subject<void>();

  constructor() {
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  public get email(): AbstractControl {
    return this.forgotPasswordForm.get('email')!;
  }

  hasError(label: string, error: string): boolean | undefined {
    return this.forgotPasswordForm.get(label)?.hasError(error);
  }

  redirectTo(path: string): void {
    this.router.navigate([path]);
  }

  onSubmit(): void {
    if (this.forgotPasswordForm.valid) {
      this.isLoading.set(true);
      const { email } = this.forgotPasswordForm.value;
      this.forgotPasswordService
        .sendEmail(email)
        .pipe(
          takeUntil(this.destroy$),
          finalize(() => this.isLoading.set(false))
        )
        .subscribe({
          next: (res: EmailSendResponse) => {
            this.sendEmailSuccess.set({
              isSuccess: true,
              message: res.message,
            });
          },
          error: (error: HttpErrorResponse) => {
            if (error.status === HttpStatusCode.NotFound) {
              this.email.setErrors({ emailNotExist: true });
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
