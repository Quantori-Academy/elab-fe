import { Component } from '@angular/core';
import { User } from '../../../../auth/roles/types';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

// TODO : Change after interfaces were added to the dev branch
interface IUserInfo {
  id?: number;
  firstName: string;
  lastName: string;
  email: string; // Email / Username
  role: UserRoles;
  password?: string;
}

enum UserRoles {
  Admin = 'Admin',
  ProcurementOfficer = 'ProcurementOfficer',
  Researcher = 'Researcher',
}
//
@Component({
  selector: 'app-users-list',
  standalone: true,
  imports: [
    MatTableModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
  ],
  templateUrl: './users-list.component.html',
  styleUrl: './users-list.component.scss',
})
export class UsersListComponent {
  displayedColumns: string[] = [
    'firstName',
    'lastName',
    'email',
    'role',
    'actions',
  ];
  dataSource = new MatTableDataSource<IUserInfo>([
    {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      role: UserRoles['Admin' as keyof typeof UserRoles],
    },
    {
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane.smith@example.com',
      role: UserRoles.ProcurementOfficer,
    },
    {
      firstName: 'Alice',
      lastName: 'Johnson',
      email: 'alice.johnson@example.com',
      role: UserRoles.Researcher,
    },
    {
      firstName: 'Bob',
      lastName: 'Brown',
      email: 'bob.brown@example.com',
      role: UserRoles.Researcher,
    },
  ]);

  userRoles = Object.values(UserRoles);

  selectedRole = '';
  searchValue = '';

  constructor() {
    this.dataSource.filterPredicate = this.customFilterPredicate();
  }

  getInputValue(event: Event): string {
    return (event.target as HTMLInputElement).value || '';
  }

  applyFilter(value: string) {
    this.searchValue = value.trim().toLowerCase();
    this.applyCombinedFilter();
  }

  applyRoleFilter(role: string) {
    this.selectedRole = role;
    this.applyCombinedFilter();
  }

  applyCombinedFilter() {
    this.dataSource.filter = JSON.stringify({
      search: this.searchValue,
      role: this.selectedRole,
    });
  }

  customFilterPredicate() {
    return (data: IUserInfo, filter: string): boolean => {
      const filterData = JSON.parse(filter);
      const matchesName = `${data.firstName} ${data.lastName}`
        .toLowerCase()
        .includes(filterData.search);
      const matchesRole = filterData.role
        ? data.role === filterData.role
        : true;
      return matchesName && matchesRole;
    };
  }

  editUser(user: User) {
    console.log('Editing user:', user);
  }

  deleteUser(user: User) {
    console.log('Deleting user:', user);
  }
}
