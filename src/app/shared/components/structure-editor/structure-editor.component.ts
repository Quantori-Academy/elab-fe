import { Component, ElementRef, ViewChild } from '@angular/core';

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
})
export class StructureEditorComponent {
  @ViewChild('ketcherFrame', { static: true })
  ketcherFrame!: ElementRef<HTMLIFrameElement>;

  get ketcher(): Ketcher | null {
    return this.ketcherFrame.nativeElement.contentWindow?.ketcher as Ketcher;
  }

  public async getSmiles(): Promise<string> {
    return await this.ketcher!.getSmiles();
  }
}
