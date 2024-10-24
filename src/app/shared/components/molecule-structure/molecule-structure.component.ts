import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  ViewChild,
} from '@angular/core';
import { Observable } from 'rxjs';
import { first, shareReplay } from 'rxjs/operators';
import { RDKitModule } from '../../../../rdkit';
import { RDKitLoaderService } from '../../services/rdkit-loader.service';
import { NgClass, NgIf, NgStyle } from '@angular/common';
import { MolDrawOptions } from './mol-draw-options';
import { CanvasRendererComponent } from './canvas-renderer/canvas-renderer.component';

export interface DrawDetails {
  width: number;
  height: number;
  bondLineWidth: number;
  addStereoAnnotation: boolean
};


@Component({
  selector: 'app-molecule-structure',
  standalone: true,
  imports: [NgClass, NgStyle, NgIf, CanvasRendererComponent],
  templateUrl: './molecule-structure.component.html',
  styleUrls: ['./molecule-structure.component.scss'],
})
export class MoleculeStructureComponent implements AfterViewInit {
  @Input() width!: number;
  @Input() height!: number;
  @Input() structure!: string;
  @Input() molDrawOptions?: MolDrawOptions;

  drawDetails!: DrawDetails;
  rdkit$!: Observable<RDKitModule>;
  error: string | null = null;
  loading = true;

  @ViewChild('molCanvas', { read: ElementRef })
  canvasContainer!: ElementRef<HTMLCanvasElement>;

  constructor(private rdkitService: RDKitLoaderService) {
    this.rdkit$ = this.rdkitService.getRDKit().pipe(shareReplay(1));
    this.rdkit$.pipe(first()).subscribe({
      next: () => {
        this.loading = false;
        this.error = null;
      },
      error: (error) => {
        this.loading = false;
        console.error(error);
        this.error = 'RDKit failed to load';
      },
    });
  }

  ngAfterViewInit(): void {
    this.renderStructure();
  }

  renderStructure() {
    if (!this.structure) {
      this.error = 'No structure provided';
      return;
    }

    this.rdkit$.pipe(first()).subscribe((rdkit) => {
      const mol = rdkit.get_mol(this.structure);
      if (!mol) {
        this.error = 'Invalid structure';
        return;
      }

      this.drawDetails = {
        width: this.width,
        height: this.height,
        bondLineWidth: 1,
        addStereoAnnotation: true,
        ...(this.molDrawOptions || {}),
      };

      mol?.delete();
    });
  }
}
