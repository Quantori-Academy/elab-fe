export enum NotificationType {
  SUCCESS = 'success',
  ERROR = 'error',
  INFO = 'info',
  WARNING = 'warning',
}

export interface NotificationData {
  type: NotificationType;
  title: string;
  message: string;
  duration?: number;
}
