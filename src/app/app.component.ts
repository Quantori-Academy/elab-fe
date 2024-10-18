import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NotificationPopupComponent } from './shared/components/notification-popup/notification-popup.component';
import { MaterialModule } from './material.module';
import { HeaderComponent } from './shared/components/header/header.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    NotificationPopupComponent,
    HeaderComponent,
    MaterialModule,
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'E-LAB';
  errorMessage: string | null = null;
}
