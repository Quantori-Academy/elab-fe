import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Inject,
  OnInit,
} from '@angular/core';
import { MaterialModule } from '../../../../material.module';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { StorageLocationService } from '../../../storage-location/services/storage-location.service';
import { MoveReagentData } from '../../../../shared/models/reagent-model';
import { firstValueFrom, Observable } from 'rxjs';
import { NotificationPopupService } from '../../../../shared/services/notification-popup/notification-popup.service';
import {
  StorageLocationItem,
  StorageLocationListData,
} from '../../../storage-location/models/storage-location.interface';
import { StorageLocationQueryService } from '../../../storage-location/services/storage-location-query.service';
import { StorageLocationColumn } from '../../../storage-location/models/storage-location.enum';
import { AsyncPipe } from '@angular/common';
import { storageLocationAutoCompleteValidator } from '../../../../shared/validators/storage-location-autocomplete.validator';

@Component({
  selector: 'app-move-reagent',
  standalone: true,
  imports: [MaterialModule, FormsModule, AsyncPipe, ReactiveFormsModule],
  providers: [StorageLocationService, StorageLocationQueryService],
  templateUrl: './move-reagent.component.html',
  styleUrl: './move-reagent.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MoveReagentComponent implements OnInit {
  private storageLocationService = inject(StorageLocationService);
  private storageLocationQueryService = inject(StorageLocationQueryService);
  private notificationPopupService = inject(NotificationPopupService);
  private dialogRef = inject(MatDialogRef<MoveReagentComponent>);
  private fb = inject(FormBuilder);

  public movedReagents!: Map<number, Set<number>>;
  public storageLocations$?: Observable<StorageLocationListData>;
  public moveForm = this.fb.group({
    storageLocation: [
      '',
      [Validators.required, storageLocationAutoCompleteValidator()],
    ],
    destinationStorageId: [null as number | null, Validators.required],
  });

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: { movedReagents: Map<number, Set<number>> }
  ) {
    this.movedReagents = this.data.movedReagents;
  }

  ngOnInit(): void {
    this.storageLocations$ =
      this.storageLocationService.searchStorageLocationByName();
  }

  displayFn = (option: StorageLocationItem): string => {
    this.moveForm.get('destinationStorageId')?.setValue(option.id);
    return option ? `${option.room.name} ${option.name}` : '';
  };

  onRoomNameChange($event: Event) {
    const value = ($event.target as HTMLInputElement).value;
    this.storageLocationQueryService.nameFilterSubject.next({
      value,
      column: StorageLocationColumn.FullPath,
    });
  }

  async moveReagents() {
    if (this.moveForm.valid) {
      const destinationStorageId = this.moveForm.value.destinationStorageId!;

      const movePromises = Array.from(this.movedReagents.entries()).map(
        ([sourceStorageId, reagentSet]) => {
          const reagents = Array.from(reagentSet).map((id) => ({ id }));
          const data: MoveReagentData = {
            sourceStorageId,
            destinationStorageId,
            reagents,
          };

          return firstValueFrom(
            this.storageLocationService.moveReagentStorageLocation(data)
          );
        }
      );

      const httpResponses = await Promise.allSettled(movePromises);

      const rejectedRes = httpResponses.filter(
        (res) => res.status === 'rejected'
      );

      if (httpResponses.length === rejectedRes.length) {
        this.notificationPopupService.error({
          title: 'Error',
          message: "Reagents couldn't move to storage",
        });
        this.dialogRef.close(false);
      } else {
        if (!rejectedRes.length) {
          this.notificationPopupService.success({
            title: 'Success',
            message: 'Reagents successfully moved',
          });
        } else {
          this.notificationPopupService.warning({
            title: 'Warning',
            message: rejectedRes
              .map((res) => res.reason.error.message)
              .join('\n'),
          });
        }
        this.movedReagents.clear();
        this.dialogRef.close(true);
      }
    }
  }
}
