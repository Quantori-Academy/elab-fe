import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MaterialModule } from '../../../material.module';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { StorageLocationAddNewComponent } from '../../components/storage-location-add-new/storage-location-add-new.component';

@Component({
  selector: 'app-storage-location',
  standalone: true,
  imports: [StorageLocationAddNewComponent, MaterialModule, MatDialogModule],
  templateUrl: './storage-location.component.html',
  styleUrl: './storage-location.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StorageLocationComponent {
  readonly dialog = inject(MatDialog);

  public openDialog(): void {
    this.dialog.open(StorageLocationAddNewComponent);
  }
}
