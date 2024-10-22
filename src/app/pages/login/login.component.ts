import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { MaterialModule } from '../../material.module';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { debounceTime } from 'rxjs';
import { AuthService } from '../../auth/services/authentication/auth.service';
import { Router } from '@angular/router';
import { MatIcon } from '@angular/material/icon';
import { LogoutService } from '../../auth/services/logout/logout.service';
import { HttpErrorResponse } from '@angular/common/http';

let initialEmailValue = '';
const savedForm = localStorage.getItem('login-email');

if (savedForm) {
  const loadedForm = JSON.parse(savedForm);
  initialEmailValue = loadedForm.email;
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [MaterialModule, ReactiveFormsModule, MatIcon, MatCardModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  private destroyRef = inject(DestroyRef);
  private router = inject(Router);
  public hide = {
    newPassword: true,
    confirmPassword: true,
  };
  public errorVisible = true;

  constructor(
    private authLogin: AuthService,
    private logoutService: LogoutService
  ) {}

  form = new FormGroup({
    email: new FormControl(initialEmailValue, {
      validators: [Validators.email, Validators.required],
    }),
    password: new FormControl('', {
      validators: [Validators.required, Validators.minLength(8)],
    }),
  });

  get emailIsInvalid() {
    return (
      this.form.controls.email.touched &&
      this.form.controls.email.dirty &&
      this.form.controls.email.invalid
    );
  }

  get emailTouched() {
    return this.form.controls.email.touched;
  }

  get passwordIsInvalid() {
    return (
      this.form.controls.password.touched &&
      this.form.controls.password.dirty &&
      this.form.controls.password.invalid
    );
  }

  get passwordTouched() {
    return this.form.controls.password.touched;
  }

  errorMessage = signal('');

  ngOnInit() {
    const subscription = this.form.valueChanges
      .pipe(debounceTime(500))
      .subscribe({
        next: (value) => {
          localStorage.setItem(
            'login-email',
            JSON.stringify({ email: value.email })
          );
        },
      });

    this.destroyRef.onDestroy(() => subscription.unsubscribe());
  }

  onSubmit() {
    if (this.form.invalid) {
      return;
    }
    const enteredEmail = this.form.value.email || '';
    const enteredPassword = this.form.value.password || '';

    if (enteredEmail && enteredPassword) {
      this.authLogin.onLoginUser(enteredEmail, enteredPassword).subscribe({
        next: () => {
          this.router.navigate(['/dashboard']);
        },
        error: (error: HttpErrorResponse | unknown) => {
          console.error('Login error:', error);

          if (error instanceof HttpErrorResponse) {
            if (error.status === 401) {
              this.errorMessage.set('Incorrect Password or Email');
            } else if (error.status === 0) {
              if (!navigator.onLine) {
                this.errorMessage.set('No internet connection');
              } else {
                this.errorMessage.set('CORS Error');
              }
            } else {
              this.errorMessage.set('Connection/network Error');
            }
          } else {
            this.errorMessage.set('Unknown error');
          }
        },
      });
    } else {
      console.log('error');
    }
  }

  navigateToForgotPassword() {
    return this.router.navigate(['/forgot-password']);
  }

  onTemporaryLogout() {
    this.router.createUrlTree(['/login']);
    this.logoutService.onLogoutUser();
  }

  closeError() {
    this.errorMessage.set('');
  }
}
