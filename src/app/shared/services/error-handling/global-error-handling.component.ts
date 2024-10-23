import { ErrorHandler, inject, Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { NotificationPopupService } from '../notification-popup/notification-popup.service';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  private notificationPopupService = inject(NotificationPopupService);

  handleError(error: unknown): void {
    if (error instanceof HttpErrorResponse) {
      // You can adjust 401 for your component to handle it properly
      if (error.status === 401) {
        this.notificationPopupService.error({
          title: 'Authorization error',
          message: 'Access denied',
          duration: 1000,
        });
      } else if (error.status === 0) {
        if (!navigator.onLine) {
          this.notificationPopupService.error({
            title: 'Network Error',
            message: 'No internet connection',
            duration: 3000,
          });
        } else {
          this.notificationPopupService.error({
            title: 'CORS Error',
            message: 'CORS Error',
            duration: 3000,
          });
        }
      } else {
        this.notificationPopupService.error({
          title: 'Server Error',
          message: 'Network Error',
          duration: 3000,
        });
      }
    } else {
      this.notificationPopupService.error({
        title: 'Unknown Error',
        message: 'Unknown error',
        duration: 3000,
      });
    }
    console.error('Global Error Handler:', error);
  }
}
