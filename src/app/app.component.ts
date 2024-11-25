import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NotificationPopupComponent } from './shared/components/notification-popup/notification-popup.component';
import { MaterialModule } from './material.module';
import { HeaderComponent } from './shared/components/header/header.component';
import { MatIcon } from '@angular/material/icon';
import { GlobalErrorHandler } from './shared/services/error-handling/global-error-handling.component';
import { ErrorHandler } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    NotificationPopupComponent,
    HeaderComponent,
    MaterialModule,
    MatIcon,
  ],
  providers: [{ provide: ErrorHandler, useClass: GlobalErrorHandler }],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'E-LAB';
  errorMessage: string | null = null;

  constructor(private translate: TranslateService) {
    const browserLang = this.translate.getBrowserLang();
    this.translate.use(browserLang?.match(/en|de|fr/) ? browserLang : 'en');
  }
}
