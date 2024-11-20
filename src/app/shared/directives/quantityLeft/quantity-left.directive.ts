import {
  Directive,
  ElementRef,
  Input,
  Renderer2,
  OnChanges,
} from '@angular/core';

@Directive({
  selector: '[appQuantityLeft]',
  standalone: true,
})
export class QuantityLeftDirective implements OnChanges {
  @Input({ required: true }) appQuantityLeft!: number;
  @Input({ required: true }) appQuantity!: number;

  constructor(private elementRef: ElementRef, private renderer2: Renderer2) {}

  ngOnChanges(): void {
    this.setBackgroundColor();
  }

  setBackgroundColor() {
    const element = this.elementRef.nativeElement as HTMLSpanElement;
    if (this.appQuantityLeft == 0) {
      this.renderer2.setStyle(element, 'backgroundColor', 'var(--error-color)');
      this.renderer2.setStyle(element, 'color', '#fff');
    }

    if (this.appQuantity / 2 > this.appQuantityLeft) {
      this.renderer2.setStyle(
        element,
        'backgroundColor',
        'var(--warning-color)'
      );
      this.renderer2.setStyle(element, 'color', '#fff');
    }
  }
}
