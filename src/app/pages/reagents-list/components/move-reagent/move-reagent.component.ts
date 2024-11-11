import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Inject,
} from '@angular/core';
import { MaterialModule } from '../../../../material.module';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { StorageLocationService } from '../../../storage-location/services/storage-location.service';
import { MoveReagentData } from '../../../../shared/models/reagent-model';
import { firstValueFrom } from 'rxjs';
import { NotificationPopupService } from '../../../../shared/services/notification-popup/notification-popup.service';

@Component({
  selector: 'app-move-reagent',
  standalone: true,
  imports: [MaterialModule, FormsModule],
  templateUrl: './move-reagent.component.html',
  styleUrl: './move-reagent.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MoveReagentComponent {
  private storageLocationService = inject(StorageLocationService);
  private notificationPopupService = inject(NotificationPopupService);
  private dialogRef = inject(MatDialogRef<MoveReagentComponent>);

  public destinationStorageId?: number;
  public movedReagents!: Map<number, Set<number>>;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: { movedReagents: Map<number, Set<number>> }
  ) {
    this.movedReagents = data.movedReagents;
  }

  async moveReagents() {
    if (this.destinationStorageId) {
      const movePromises = [];
      for (const [sourceStorageId, reagentSet] of this.movedReagents) {
        const data: MoveReagentData = {
          sourceStorageId,
          destinationStorageId: this.destinationStorageId,
          reagents: Array.from(reagentSet).map((id) => ({ id })),
        };
        const movePromise = firstValueFrom(
          this.storageLocationService.moveReagentStorageLocation(data)
        );
        movePromises.push(movePromise);
      }

      const httpResponses = await Promise.allSettled(movePromises);

      const rejectedRes = httpResponses.filter(
        (res) => res.status === 'rejected'
      );

      if (httpResponses.length === rejectedRes.length) {
        this.notificationPopupService.error({
          title: 'Error',
          message: "Reagents couldn't move to storages",
        });
        this.dialogRef.close(false);
      } else {
        if (!rejectedRes.length) {
          this.notificationPopupService.success({
            title: 'Success',
            message: 'Reagents successfully moved',
          });
        } else {
          this.notificationPopupService.success({
            title: 'Warning',
            message: rejectedRes.map((res) => res.reason).join(' '),
          });
        }
        this.movedReagents.clear();
        this.dialogRef.close(true);
      }
    }
  }
}
