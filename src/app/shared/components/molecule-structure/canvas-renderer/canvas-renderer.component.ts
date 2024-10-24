import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  ViewChild,
} from '@angular/core';
import { first } from 'rxjs/operators';
import { RDKitLoaderService } from '../../../services/rdkit-loader.service';
import { NgClass, NgStyle } from '@angular/common';
import { DrawDetails } from '../molecule-structure.component';

@Component({
  selector: 'app-canvas-renderer',
  standalone: true,
  imports: [NgClass, NgStyle],
  templateUrl: './canvas-renderer.component.html',
  styleUrls: ['./canvas-renderer.component.scss'],
})
export class CanvasRendererComponent implements AfterViewInit {
  @Input() structure!: string;
  @Input() drawingDetails!: DrawDetails;

  @ViewChild('molCanvas', { read: ElementRef })
  canvasContainer!: ElementRef<HTMLCanvasElement>;

  constructor(private rdkit: RDKitLoaderService) {}

  ngAfterViewInit(): void {
    this.renderMolecule();
  }

  renderMolecule() {
    if (this.structure && this.drawingDetails) {
      this.rdkit
        .getRDKit()
        .pipe(first())
        .subscribe((rdkit) => {
          const mol = rdkit.get_mol(this.structure);
          try {
            if (!mol) {
              return;
            }

            mol.draw_to_canvas_with_highlights(
              this.canvasContainer.nativeElement,
              JSON.stringify(this.drawingDetails)
            );
          } finally {
            mol?.delete();
          }
        });
    }
  }
}
