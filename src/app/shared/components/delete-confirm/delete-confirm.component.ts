import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Inject,
} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MaterialModule } from '../../../material.module';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-delete-confirm',
  standalone: true,
  imports: [MaterialModule, MatDialogModule],
  templateUrl: './delete-confirm.component.html',
  styleUrl: './delete-confirm.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeleteConfirmComponent {
  private dialogRef = inject(MatDialogRef<DeleteConfirmComponent>);

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: { message: string; deleteHandler: () => Observable<boolean>  }
  ) {}

  public onDelete(): void {
    this.data?.deleteHandler()?.subscribe((isDeleted) => {
      this.dialogRef.close(isDeleted);
    });
  }
}
