import { Directive, ElementRef, Input, OnInit, Renderer2 } from '@angular/core';
import { Status } from '../../../pages/orders-list/model/order-model';

const colors: Record<string, { color: string; backgroundColor: string }> = {
  Pending: { color: '#e68d11', backgroundColor: 'rgba(240, 173, 78, 0.1)' },
  Ordered: { color: '#4B0082', backgroundColor: 'rgba(147, 112, 219, 0.1)' },
  Fulfilled: { color: '#098109', backgroundColor: 'rgba(92, 184, 92, 0.3)' },
  Declined: { color: '#F44336', backgroundColor: 'rgba(244, 67, 54, 0.1)' },
  Completed: { color: '#0056b3', backgroundColor: 'rgba(0, 123, 255, 0.1)' },
}

@Directive({
  selector: '[appStatusLabelColor]',
  standalone: true
})
export class StatusLabelColorDirective implements OnInit {
  @Input({required: true}) appStatusLabelColor = '';

  constructor(private elementRef: ElementRef, private render2: Renderer2) {}

  ngOnInit(): void {
    this.setStatusColor()
  }

  setStatusColor() {
    const element = this.elementRef.nativeElement;
    const status = this.appStatusLabelColor as Status;
    const styles = colors[status];

    if (styles) {
      this.render2.setStyle(element, 'color', styles.color);
      this.render2.setStyle(element, 'borderColor', styles.color);
      this.render2.setStyle(element, 'backgroundColor', styles.backgroundColor);
    }
  }
}

