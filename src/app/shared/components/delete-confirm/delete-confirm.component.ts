import { Component, inject, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MaterialModule } from '../../../material.module';
import { DialogRef } from '@angular/cdk/dialog';

@Component({
  selector: 'app-delete-confirm',
  standalone: true,
  imports: [MaterialModule, MatDialogModule],
  templateUrl: './delete-confirm.component.html',
  styleUrl: './delete-confirm.component.scss',
})
export class DeleteConfirmComponent implements OnInit {
  private dialogRef = inject(DialogRef<DeleteConfirmComponent>);

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: { message: string; deleteHandler: () => void } | undefined
  ) {}

  ngOnInit(): void {
    console.log(this.data);
  }

  public onDelete(): void {
    this.data?.deleteHandler();
    this.dialogRef.close();
  }
}
