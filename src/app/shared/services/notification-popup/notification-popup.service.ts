import { Injectable } from '@angular/core';
import {
  NotificationData,
  NotificationPosition,
  NotificationType,
} from '../../models/notification-popup.model';
import { Observable, Subject } from 'rxjs';

type NotificationDataArg = Omit<NotificationData, 'type'>;

@Injectable({
  providedIn: 'root',
})
export class NotificationPopupService {
  private DURATION = 2000;
  private POSITION: NotificationPosition = 'top-right';
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
    const position = data.position || this.POSITION;
    this._notificationData.next({
      type,
      ...data,
      duration,
      position,
    });
  }
}
