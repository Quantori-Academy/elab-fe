import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-no-data',
  standalone: true,
  imports: [NgClass],
  templateUrl: './no-data.component.html',
  styleUrl: './no-data.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NoDataComponent {
  @Input() text = 'No data';
  @Input() size: 'large' | 'medium' | 'small' = 'large';
}
