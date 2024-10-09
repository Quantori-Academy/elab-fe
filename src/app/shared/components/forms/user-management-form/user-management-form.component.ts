import { Component, Input, OnInit, OnDestroy } from '@angular/core';
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
import { IUserInfo, UserRoles } from '../../../models/user-models';
import { UserManagementService } from '../../../../auth/services/user-management/user-management.service';
import { Subscription } from 'rxjs';

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
export class UserManagementFormComponent implements OnInit, OnDestroy {
  @Input() formTitle = 'Create New User'; // Form title
  @Input() userData: IUserInfo = this.generateInitialUser(); // Generate initial user

  private subscriptions = new Subscription(); // Observable subscriptions collections
  userForm!: FormGroup; // Form data obj
  roles = Object.values(UserRoles); // user roles for select-options
  userCreation!: boolean; // flag to determine user modification/creation modes
  emailEditable = true; // Email is editable by default in user creation mode
  formErrMsgs: string[] | null = null; // Failure Err messages

  constructor(
    private fb: FormBuilder,
    private userManagementService: UserManagementService
  ) {}

  ngOnInit(): void {
    this.emailEditable = this.userCreation = this.userData.email === ''; // Email is editable if it's empty (user creation mode)

    // Initialize the form data obj
    this.userForm = this.fb.group({
      firstName: [
        { value: this.userData.firstName, disabled: !this.userCreation },
        [Validators.required],
      ],
      lastName: [
        {
          value: this.userData.lastName,
          disabled: !this.userCreation,
        },
        [Validators.required],
      ],
      email: [
        { value: this.userData.email, disabled: !this.emailEditable },
        [Validators.required, Validators.email],
      ],
      role: [
        this.userData.email !== '' ? this.userData.role : null,
        Validators.required,
      ],
    });
  }

  // Method to generate initial empty user with random ID
  private generateInitialUser(): IUserInfo {
    return {
      id: -1, // placeholder -> id will not be sent as Data
      firstName: '',
      lastName: '',
      email: '',
      role: UserRoles.Researcher,
    };
  }

  // Toggle email edit option
  // toggleEmailEdit(): void {
  //   if (this.emailEditable && !this.userForm.get('email')?.valid) return;
  //   this.emailEditable = !this.emailEditable;
  //   if (this.emailEditable) {
  //     this.userForm.get('email')?.enable();
  //   } else {
  //     this.userForm.get('email')?.disable();
  //   }
  // }

  // Toggle password fields
  // togglePasswordField(): void {
  //   this.showPasswordField = !this.showPasswordField;
  //   if (!this.showPasswordField) this.userForm.patchValue({ password: '' });
  // }

  onDeleteUser(): void {
    if (!confirm('Confirm action -> Delete user:')) return;
    const deleteSub = this.userManagementService
      .deleteUser(this.userData.id)
      .subscribe({
        next: () => {
          alert('User deleted successfully!');
          // TODO: change to proper reroute path
        },
        error: (error: Error) => {
          console.error('Delete user failed', error);
        },
      });
    this.subscriptions.add(deleteSub);
  }

  // Handle form submission
  onSubmit(): void {
    if (this.userForm.valid) {
      this.formErrMsgs = null;

      // if (this.showPasswordField) {
      //   // TODO : RESET PASSWORD
      // }
      if (this.userCreation) {
        // user-creation
        const createSub = this.userManagementService
          .createUser(this.userForm.value)
          .subscribe({
            next: () => {
              alert('User has been created successfully!');
              this.userForm.reset();
            },
            error: (error) => {
              this.formErrMsgs = error.message.split(',');
            },
          });
        this.subscriptions.add(createSub);
      } else {
        // user-modification
        const updateSub = this.userManagementService
          .updateUser(this.userData.id, this.userForm.value)
          .subscribe({
            next: () => {
              alert('User updated successfully!');
            },
            error: (error) => {
              this.formErrMsgs = error.message.split(',');
            },
          });
        this.subscriptions.add(updateSub);
      }
    }
  }
  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
