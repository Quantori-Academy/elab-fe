import { Component, ElementRef, ViewChild, AfterViewInit, OnInit, signal } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { TableLoaderSpinnerComponent } from "../table-loader-spinner/table-loader-spinner.component";

interface Ketcher {
  getSmiles(): Promise<string>;
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

  onLoaded() {
    this.loading.set(false);
  }
}
