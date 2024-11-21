import { Component } from '@angular/core';
import { NoDataComponent } from '../../shared/components/no-data/no-data.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [NoDataComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {}
