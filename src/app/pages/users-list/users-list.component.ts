import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { UserManagementService } from '../../auth/services/user-management/user-management.service';
import { IUserInfo, UserRoles } from '../../shared/models/user-models';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { UserManagementFormComponent } from './components/user-management-form/user-management-form.component';
import { MatButtonModule } from '@angular/material/button';
import { NotificationPopupService } from '../../shared/services/notification-popup/notification-popup.service';

@Component({
  selector: 'app-users-list',
  standalone: true,
  imports: [
    MatTableModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
  ],
  templateUrl: './users-list.component.html',
  styleUrl: './users-list.component.scss',
})
export class UsersListComponent implements OnInit, OnDestroy {
  private users: IUserInfo[] | null = null;
  private subscriptions = new Subscription();
  private notificationPopupService = inject(NotificationPopupService);

  userRoles = Object.values(UserRoles);
  selectedRole = '';
  searchValue = '';

  displayedColumns: string[] = [
    'firstName',
    'lastName',
    'email',
    'role',
    'actions',
  ];

  dataSource!: MatTableDataSource<IUserInfo>;

  constructor(
    private userManagementService: UserManagementService,
    public dialog: MatDialog
  ) {}

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    const allUsersSub = this.userManagementService.getAllUsers().subscribe({
      next: (response) => {
        this.users = response.sort(
          (a: IUserInfo, b: IUserInfo) =>
            a.role > b.role ? 1 : a.role < b.role ? -1 : 0 // Admin > P-Officer > Researcher
        );
        this.dataSource = new MatTableDataSource<IUserInfo>(response);
        this.dataSource.filterPredicate = this.customFilterPredicate();
      },
      error: (error) => {
        console.error('Error loading users:', error.message);
        this.notificationPopupService.error({
          title: 'Error',
          message: `Failed to load users: ${error.message}`,
          duration: 3000,
        });
      },
    });

    this.subscriptions.add(allUsersSub);
  }

  openCreateUserDialog(): void {
    const dialogRef = this.dialog.open(UserManagementFormComponent, {
      width: '450px',
    });

    const dialogSub = dialogRef.afterClosed().subscribe((result) => {
      if (result) this.loadUsers();
    });

    this.subscriptions.add(dialogSub);
  }

  // Filtering Methods
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
  //

  // Actions methods
  editUser(user: IUserInfo) {
    const dialogRef = this.dialog.open(UserManagementFormComponent, {
      width: '450px',
      data: {
        userData: user,
        formTitle: 'User Data',
      },
    });

    const dialogSub = dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadUsers();
      }
    });

    this.subscriptions.add(dialogSub);
  }

  deleteUser(user: IUserInfo) {
    if (!confirm('Confirm action -> Delete user:')) return;
    const deleteSub = this.userManagementService.deleteUser(user.id).subscribe({
      next: () => {
        this.notificationPopupService.info({
          title: '',
          message: 'User deleted successfully!',
          duration: 3000,
        });
        this.loadUsers();
      },
      error: (error: Error) => {
        console.error('Delete user failed', error);
      },
    });
    this.subscriptions.add(deleteSub);
  }
  //

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
