import { Component, ElementRef, ViewChild, AfterViewInit, OnInit, Input, signal } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { TableLoaderSpinnerComponent } from "../table-loader-spinner/table-loader-spinner.component";

interface Ketcher {
  getSmiles(): Promise<string>;
  setMolecule(molecule: string): void;
}

declare global {
  interface Window {
    ketcher: Ketcher;
  }
}

@Component({
  selector: 'app-structure-editor',
  standalone: true,
  templateUrl: './structure-editor.component.html',
  styleUrls: ['./structure-editor.component.scss'],
  imports: [TableLoaderSpinnerComponent],
})
export class StructureEditorComponent implements OnInit, AfterViewInit {
  @ViewChild('ketcherFrame', { static: false })
  ketcherFrame!: ElementRef<HTMLIFrameElement>;
  @Input() initialSmiles: string | null = null;

  ketcherUrl!: SafeResourceUrl;
  loading = signal(true);

  constructor(private sanitizer: DomSanitizer) {}

  ngOnInit() {
    this.ketcherUrl = this.sanitizer.bypassSecurityTrustResourceUrl('/ketcher/index.html');
  }

  ngAfterViewInit() {
    if (this.ketcherFrame) {
      this.ketcherFrame.nativeElement.onload = () => this.onLoaded();
    }
  }

  get ketcher(): Ketcher | null {
    return this.ketcherFrame?.nativeElement.contentWindow?.ketcher || null;
  }

  public async getSmiles(): Promise<string> {
      return await this.ketcher!.getSmiles();
  }

  private async loadPreviousSmiles(): Promise<void> {
    if (this.ketcher && this.initialSmiles) {
      this.ketcher.setMolecule(this.initialSmiles);
    }
  }

  onLoaded() {
    this.loading.set(false);
    this.loadPreviousSmiles();
  }
}
