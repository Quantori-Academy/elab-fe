import { Component, Inject, ViewChild } from '@angular/core';
import { StructureEditorComponent } from '../structure-editor.component';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MaterialModule } from '../../../../material.module';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-add-structure',
  standalone: true,
  imports: [StructureEditorComponent, MaterialModule, TranslateModule],
  templateUrl: './add-structure.component.html',
  styleUrl: './add-structure.component.scss',
})
export class AddStructureComponent {
  @ViewChild(StructureEditorComponent)
  private structureEditor!: StructureEditorComponent;

  constructor(
    public dialogRef: MatDialogRef<AddStructureComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { smiles: string }
  ) {}

  async getSmilesFromEditor(event: Event): Promise<void> {
    event.preventDefault();
    const smiles = await this.structureEditor.getSmiles();
    this.dialogRef.close(smiles);
  }
}
