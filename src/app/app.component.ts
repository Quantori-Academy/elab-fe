import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NotificationPopupComponent } from './shared/components/notification-popup/notification-popup.component';
import { MaterialModule } from './material.module';
import { HeaderComponent } from './shared/components/header/header.component';
import { MatIcon } from '@angular/material/icon';
import { GlobalErrorHandler } from './shared/services/error-handling/global-error-handling.component';
import { ErrorHandler } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { CustomMatPaginatorIntl } from '../../i18n/custom-paginator-intl';

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
  providers: [
    { provide: ErrorHandler, useClass: GlobalErrorHandler },
    { provide: MatPaginatorIntl, useClass: CustomMatPaginatorIntl },
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'E-LAB';
  errorMessage: string | null = null;

  constructor(private translate: TranslateService) {
    const savedLang = localStorage.getItem('language');
    if (savedLang) {
      this.translate.use(savedLang);
    } else {
      const browserLang = this.translate.getBrowserLang();
      this.translate.use(browserLang?.match(/en|de|fr/) ? browserLang : 'en');
    }
  }
}
