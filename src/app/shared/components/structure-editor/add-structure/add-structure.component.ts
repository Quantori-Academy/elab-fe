import {
  Component,
  ViewChild,
} from '@angular/core';
import { StructureEditorComponent } from '../structure-editor.component';
import {
  MatDialogRef,
} from '@angular/material/dialog';
import { MaterialModule } from '../../../../material.module';

@Component({
  selector: 'app-add-structure',
  standalone: true,
  imports: [StructureEditorComponent, MaterialModule],
  templateUrl: './add-structure.component.html',
  styleUrl: './add-structure.component.scss',
})
export class AddStructureComponent {
  @ViewChild(StructureEditorComponent)
  private structureEditor!: StructureEditorComponent;

  constructor(
    public dialogRef: MatDialogRef<AddStructureComponent>
  ) {}

  async getSmilesFromEditor(event: Event): Promise<void> {
    event.preventDefault();
    const smiles = await this.structureEditor.getSmiles();
    this.dialogRef.close(smiles);
  }

}
