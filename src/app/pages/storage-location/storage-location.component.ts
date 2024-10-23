import { Component } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { StorageManagementComponent } from './components/storage-management/storage-management.component';
import { RoomManagementComponent } from './components/room-management/room-management.component';

@Component({
  selector: 'app-storage-location',
  standalone: true,
  imports: [MatTabsModule, StorageManagementComponent, RoomManagementComponent],
  templateUrl: './storage-location.component.html',
  styleUrl: './storage-location.component.scss',
})
export class StorageLocationComponent {}
