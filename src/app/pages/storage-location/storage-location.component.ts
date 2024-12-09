import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { StorageManagementComponent } from './components/storage-management/storage-management.component';
import { RoomManagementComponent } from './components/room-management/room-management.component';
import { RbacService } from '../../auth/services/authentication/rbac.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-storage-location',
  standalone: true,
  imports: [
    MatTabsModule,
    StorageManagementComponent,
    RoomManagementComponent,
    TranslateModule,
  ],
  templateUrl: './storage-location.component.html',
  styleUrl: './storage-location.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StorageLocationComponent {
  private rbacService = inject(RbacService);
  public isAdmin = this.rbacService.isAdmin();
}
