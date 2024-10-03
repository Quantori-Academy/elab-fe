import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { NotificationData } from '../../models/notification-popup.model';
import { NotificationPopupService } from '../../services/notification-popup/notification-popup.service';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { NgClass } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-notification-popup',
  standalone: true,
  imports: [MatIconModule, MatCardModule, MatProgressBarModule, NgClass],
  templateUrl: './notification-popup.component.html',
  styleUrl: './notification-popup.component.scss',
})
export class NotificationPopupComponent implements OnInit {
  private PROGRESS_MAX_VALUE = 100;
  private timeoutId?: number;
  private intervalId?: number;
  private destroyRef = inject(DestroyRef);
  public notificationData!: NotificationData | null;
  public progressValue = 0;

  constructor(private notificationPopupService: NotificationPopupService) {}

  ngOnInit(): void {
    this.notificationPopupService.notificationData
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((value) => {
        this.notificationData = value;
        if (value && value.duration) {
          this.resetProgressBar(value.duration);
          this.resetTimer(value.duration);
        }
      });
  }

  private resetTimer(duration: number): void {
    if (this.timeoutId) {
      window.clearTimeout(this.timeoutId);
    }
    this.timeoutId = window.setTimeout(() => {
      this.notificationData = null;
      this.progressValue = 0;
      if (this.intervalId) {
        window.clearInterval(this.intervalId);
      }
    }, duration);
  }

  private resetProgressBar(duration: number): void {
    if (this.intervalId) {
      window.clearInterval(this.intervalId);
    }

    this.progressValue = 0;
    const step = (this.PROGRESS_MAX_VALUE / duration) * this.PROGRESS_MAX_VALUE;

    this.intervalId = window.setInterval(() => {
      if (this.progressValue < this.PROGRESS_MAX_VALUE) {
        this.progressValue += step;
      } else {
        window.clearInterval(this.intervalId);
      }
    }, this.PROGRESS_MAX_VALUE);
  }
}
