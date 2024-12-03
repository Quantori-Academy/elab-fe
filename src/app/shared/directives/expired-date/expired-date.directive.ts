import {
  Directive,
  ElementRef,
  Input,
  Renderer2,
  OnChanges,
} from '@angular/core';

@Directive({
  selector: '[appExpiredDate]',
  standalone: true,
})
export class ExpiredDateDirective implements OnChanges {
  @Input({ required: true }) appExpiredDate!: string;

  constructor(private elementRef: ElementRef, private renderer2: Renderer2) {}

  ngOnChanges(): void {
    this.setBackgroundColor();
  }

  setBackgroundColor() {
    const element = this.elementRef.nativeElement as HTMLSpanElement;
    const expiredDate = new Date(this.appExpiredDate);
    const currentDate = new Date();

    const warningDate = new Date();
    warningDate.setDate(warningDate.getDate() + 3);

    if (expiredDate < currentDate) {
      this.renderer2.setStyle(element, 'backgroundColor', 'var(--error-color)');
      this.renderer2.setStyle(element, 'color', '#fff');
    } else if (expiredDate < warningDate) {
      this.renderer2.setStyle(
        element,
        'backgroundColor',
        'var(--warning-color)'
      );
      this.renderer2.setStyle(element, 'color', '#fff');
    }
  }
}
