import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ReagentsService } from '../../../../shared/services/reagents.service';
import { finalize, Subscription } from 'rxjs';
import { NotificationPopupService } from '../../../../shared/services/notification-popup/notification-popup.service';
import { HttpErrorResponse, HttpEventType } from '@angular/common/http';
import { MaterialModule } from '../../../../material.module';
import { DragDropFileDirective } from '../../../../shared/directives/drag-drop-file/drag-drop-file.directive';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-upload-reagent',
  standalone: true,
  imports: [MaterialModule, DragDropFileDirective],
  templateUrl: './upload-reagent.component.html',
  styleUrl: './upload-reagent.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UploadReagentComponent {
  private reagentService = inject(ReagentsService);
  private notificationPopupService = inject(NotificationPopupService);
  private dialogRef = inject(MatDialogRef<UploadReagentComponent>)

  public uploadProgress = signal(0);
  public uploadSub!: Subscription;

  onFileDropped($event: File) {
    this.uploadFile($event);
  }

  fileBrowseHandler($event: Event) {
    const input = $event.target as HTMLInputElement;
    if (input?.files?.[0]) {
      this.uploadFile(input.files[0]);
    }
  }

  uploadFile(file: File) {
    if (file) {
      const formData = new FormData();
      formData.append('file', file);

      this.reagentService.uploadReagent(formData)
        .pipe(
          finalize(() => this.reset())
        ).subscribe({
          next: (event) => {
            if (event.type == HttpEventType.UploadProgress) {
              this.uploadProgress.set(Math.round(100 * (event.loaded / event.total!)));
            }
            if (event.type == HttpEventType.Response) {
              this.notificationPopupService.success({
                title: 'Success',
                message: "File uploaded successfully",
              })
              this.dialogRef.close(true)
            }
          },
          error: (error: HttpErrorResponse) => {
            this.notificationPopupService.error(error.error)
          }
        });
    }
  }

  cancelUpload() {
    this.uploadSub.unsubscribe();
  }

  reset() {
    this.uploadProgress.set(0);
  }
}
