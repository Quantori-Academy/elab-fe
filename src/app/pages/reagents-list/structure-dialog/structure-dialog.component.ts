import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-structure-dialog',
  standalone: true,
  imports: [MatIconModule, MatButtonModule],
  templateUrl: './structure-dialog.component.html',
  styleUrl: './structure-dialog.component.scss'
})
export class StructureDialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { structure: string },
    private dialogRef: MatDialogRef<StructureDialogComponent>
  ) {}

  onClose(): void {
    this.dialogRef.close();
  }
}
