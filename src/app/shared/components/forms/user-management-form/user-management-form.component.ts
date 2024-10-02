import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatOptionModule } from '@angular/material/core';
import { IUser, UserRoles } from '../../../models/user-models';

@Component({
  selector: 'app-user-management-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatGridListModule,
    MatOptionModule,
  ],
  templateUrl: './user-management-form.component.html',
  styleUrl: './user-management-form.component.scss',
})
export class UserManagementFormComponent implements OnInit {
  @Input() formTitle = 'Create New User'; // Form title
  @Input() userData: IUser = this.generateInitialUser(); // Generate initial user

  userForm!: FormGroup; // Form data obj
  emailEditable = true; // Email is editable by default in user creation mode
  showPasswordField = false; // Password fields toggle
  roles = Object.values(UserRoles); // user roles for select-options

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.emailEditable = this.userData.email === ''; // Email is editable if it's empty (user creation mode)

    // Initialize the form data obj
    this.userForm = this.fb.group({
      name: [this.userData.name, Validators.required],
      lastName: [this.userData.lastName, Validators.required],
      email: [
        { value: this.userData.email, disabled: !this.emailEditable },
        [Validators.required, Validators.email],
      ],
      role: [
        this.userData.email !== '' ? this.userData.role : null,
        Validators.required,
      ],
      password: [''],
    });
  }

  // Method to generate initial empty user with random ID
  private generateInitialUser(): IUser {
    return {
      id: Math.floor(Math.random() * 10000), // TODO: change ID init
      name: '',
      lastName: '',
      email: '',
      role: UserRoles.researcher, // TODO: default value ??
      password: '',
    };
  }

  // Toggle email edit option
  toggleEmailEdit(): void {
    this.emailEditable = !this.emailEditable;
    if (this.emailEditable) {
      this.userForm.get('email')?.enable();
    } else {
      this.userForm.get('email')?.disable();
    }
  }

  // Toggle password fields
  togglePasswordField(): void {
    this.showPasswordField = !this.showPasswordField;
    if (!this.showPasswordField) this.userForm.patchValue({ password: '' });
  }

  onDeleteUser(): void {
    console.log('User deletion triggered');
    // TODO: API CALL
  }

  // Handle form submission
  onSubmit(): void {
    // TODO : API CALL

    if (this.userForm.valid) {
      console.log('Form Data:', this.userForm.value);
      console.log('OK!');
      if (this.showPasswordField) {
        // TODO : RESET PASSWORD
      }
    } else {
      // TODO : ERR Handling
    }
    console.log('Current Form Data:', this.userForm.value);
  }
}
