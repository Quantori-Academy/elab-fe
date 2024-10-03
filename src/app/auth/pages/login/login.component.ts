import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { MaterialModule } from '../../../material.module';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { debounceTime } from 'rxjs';
import { AuthService } from '../../services/authentication/auth.service';
import { Router } from '@angular/router';
import { MatIcon } from '@angular/material/icon';

let initialEmailValue = '';
const savedForm = window.localStorage.getItem('login-email');

if (savedForm) {
  const loadedForm = JSON.parse(savedForm);
  initialEmailValue = loadedForm.email;
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [MaterialModule, ReactiveFormsModule, MatIcon],
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

  constructor(private authLogin: AuthService) {}

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

  ngOnInit() {
    const subscription = this.form.valueChanges
      .pipe(debounceTime(500))
      .subscribe({
        next: (value) => {
          window.localStorage.setItem(
            'login-email',
            JSON.stringify({ email: value.email })
          );
        },
      });

    this.destroyRef.onDestroy(() => subscription.unsubscribe());
  }

  resetForm() {
    this.form.reset({
      email: '',
      password: '',
    });
    window.localStorage.removeItem('login-email');
  }

  onSubmit() {
    if (this.form.invalid) {
      return;
    }
    const enteredEmail = this.form.value.email || '';
    const enteredPassword = this.form.value.password || '';

    if (enteredEmail && enteredPassword) {
      this.authLogin.onLoginUser(enteredEmail, enteredPassword);
      this.resetForm();
    } else {
      console.log('error');
    }
  }

  navigateToForgotPassword() {
    return this.router.navigate(['forgot-password']);
  }
}
