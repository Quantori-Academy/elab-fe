import {
  Directive,
  ElementRef,
  Input,
  OnChanges,
  Renderer2,
} from '@angular/core';

@Directive({
  selector: '[appSpinner]',
  standalone: true,
})
export class SpinnerDirective implements OnChanges {
  @Input({ required: true }) appSpinner = false;
  private spinnerElement: HTMLElement;

  constructor(private elementRef: ElementRef, private renderer2: Renderer2) {
    this.spinnerElement = this.renderer2.createElement('span');
    this.renderer2.addClass(this.spinnerElement, 'loader');
  }

  ngOnChanges(): void {
    this.setBackground();
  }

  public setBackground() {
    const element = this.elementRef.nativeElement as HTMLTableElement;
    const tbody = element.querySelector('tbody');

    if (tbody) {
      if (this.appSpinner) {
        this.renderer2.setStyle(tbody, 'opacity', '0.5');
        this.renderer2.appendChild(tbody, this.spinnerElement);
      } else {
        this.renderer2.removeStyle(tbody, 'opacity');
        this.renderer2.removeChild(tbody, this.spinnerElement);
      }
    }
  }
}
