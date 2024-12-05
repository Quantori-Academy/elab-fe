import { ErrorHandler, inject, Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { NotificationPopupService } from '../notification-popup/notification-popup.service';
import { TranslateService } from '@ngx-translate/core';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  private notificationPopupService = inject(NotificationPopupService);
  private translate = inject(TranslateService);

  handleError(error: unknown): void {
    if (error instanceof HttpErrorResponse) {
      if (error.status === 0) {
        this.notificationPopupService.error({
          title: this.translate.instant('ERROR_MESSAGES.FAILED_TO_CONNECT'),
          message: this.translate.instant(
            'ERROR_MESSAGES.CHECK_INTERNET_CONNECTION'
          ),
          duration: 3000,
        });
      } else {
        const serverErrorCode = error.error?.code;
        let serverMessage = '';

        if (serverErrorCode) {
          serverMessage = this.translate.instant(
            `SERVER_ERRORS.${serverErrorCode}`
          );
        }

        if (
          !serverMessage ||
          serverMessage === `SERVER_ERRORS.${serverErrorCode}`
        ) {
          serverMessage = this.translate.instant(
            'ERROR_MESSAGES.SERVER_ERROR_OCCURRED'
          );
        }

        this.notificationPopupService.error({
          title: this.translate.instant('ERROR_MESSAGES.ERROR_WITH_CODE', {
            status: error.status,
          }),
          message: serverMessage,
          duration: 3000,
        });
      }
    } else {
      this.notificationPopupService.error({
        title: this.translate.instant('ERROR_MESSAGES.UNEXPECTED_ERROR'),
        message: this.translate.instant(
          'ERROR_MESSAGES.UNEXPECTED_ERROR_OCCURRED'
        ),
        duration: 3000,
      });
    }
    console.error('Global Error Handler:', error);
  }
}
