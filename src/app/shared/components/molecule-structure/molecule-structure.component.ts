import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnChanges,
  SimpleChanges,
  ViewChild
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
export class MoleculeStructureComponent implements OnChanges, AfterViewInit {
  @Input() width = 100;
  @Input() height = 100;
  @Input() structure!: string;
  @Input() molDrawOptions?: MolDrawOptions;
  @Input() refreshDelay?: number;

  drawDetails!: DrawDetails;
  rdkit$!: Observable<RDKitModule>;
  error: string | null = null;
  loading = true;
  refreshTimeout?: ReturnType<typeof setTimeout>;

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

  ngOnChanges(changes: SimpleChanges): void {
    if (
      !Object.keys(changes).some(
        (k) => changes[k].currentValue !== changes[k].previousValue
      )
    ) {
      return;
    }

    if (this.refreshDelay) {
      if (this.refreshTimeout) {
        clearTimeout(this.refreshTimeout);
      }
      this.refreshTimeout = setTimeout(
        () => this.renderStructure(),
        this.refreshDelay
      );
    } else {
      this.renderStructure();
    }
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
