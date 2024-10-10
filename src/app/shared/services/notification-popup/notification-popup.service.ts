import { Injectable } from '@angular/core';
import {
  NotificationData,
  NotificationType,
} from '../../models/notification-popup.model';
import { Observable, Subject } from 'rxjs';

type NotificationDataArg = Omit<NotificationData, 'type'>;

@Injectable({
  providedIn: 'root',
})
export class NotificationPopupService {
  private DURATION = 2000;
  private _notificationData = new Subject<NotificationData | null>();

  public success(data: NotificationDataArg) {
    this._setNotification(NotificationType.SUCCESS, data);
  }

  public info(data: NotificationDataArg) {
    this._setNotification(NotificationType.INFO, data);
  }

  public error(data: NotificationDataArg) {
    this._setNotification(NotificationType.ERROR, data);
  }

  public warning(data: NotificationDataArg) {
    this._setNotification(NotificationType.WARNING, data);
  }

  public get notificationData(): Observable<NotificationData | null> {
    return this._notificationData.asObservable();
  }

  private _setNotification(type: NotificationType, data: NotificationDataArg) {
    const duration = data.duration || this.DURATION;
    this._notificationData.next({
      type,
      ...data,
      duration,
    });
  }
}
