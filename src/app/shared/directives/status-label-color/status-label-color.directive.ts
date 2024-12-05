import { Directive, ElementRef, Input, OnInit, Renderer2 } from '@angular/core';
import { Status } from '../../../pages/orders-list/model/order-model';

const colors: Record<Status, { color: string; backgroundColor: string }> = {
  [Status.pending]: { color: 'var(--pending-color)', backgroundColor: 'var(--pending-background-color)' },
  [Status.ordered]: { color: 'var(--ordered-color)', backgroundColor: 'var(--ordered-background-color)' },
  [Status.fulfilled]: { color: 'var(--fulfilled-color)', backgroundColor: 'var(--fulfilled-background-color)' },
  [Status.declined]: { color: 'var(--declined-color)', backgroundColor: 'var(--declined-background-color)' },
  [Status.completed]: { color: 'var(--completed-color)', backgroundColor: 'var(--completed-background-color)' },
  [Status.submitted]: { color: 'var(--submitted-color)', backgroundColor: 'var(--submitted-background-color)' },
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

