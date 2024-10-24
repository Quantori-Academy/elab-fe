import { ErrorHandler, inject, Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { NotificationPopupService } from '../notification-popup/notification-popup.service';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  private notificationPopupService = inject(NotificationPopupService);

  handleError(error: unknown): void {
    if (error instanceof HttpErrorResponse) {
      if (error.status === 0) {
        this.notificationPopupService.error({
          title: 'Failed to connect to the server',
          message: 'Check your internet connection and try again',
          duration: 3000,
        });
      } else {
        const serverMessage = error.error?.message || error.message;
        this.notificationPopupService.error({
          title: `Error ${error.status}`,
          message: serverMessage,
          duration: 3000,
        });
      }
    } else {
      this.notificationPopupService.error({
        title: 'Unexpected Error',
        message: 'An unexpected error occurred',
        duration: 3000,
      });
    }
    console.error('Global Error Handler:', error);
  }
}
