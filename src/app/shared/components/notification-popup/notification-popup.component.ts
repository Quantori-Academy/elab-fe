import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { NotificationData } from '../../models/notification-popup.model';
import { NotificationPopupService } from '../../services/notification-popup/notification-popup.service';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { NgClass } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-notification-popup',
  standalone: true,
  imports: [MatIconModule, MatCardModule, MatProgressBarModule, NgClass],
  templateUrl: './notification-popup.component.html',
  styleUrl: './notification-popup.component.scss',
})
export class NotificationPopupComponent implements OnInit, OnDestroy {
  private PROGRESS_MAX_VALUE = 100;
  private animationId?: number;
  private destroy$ = new Subject<void>();
  public notificationData!: NotificationData | null;
  public progressValue = 0;

  constructor(private notificationPopupService: NotificationPopupService) {}

  ngOnInit(): void {
    this.notificationPopupService.notificationData
      .pipe(takeUntil(this.destroy$))
      .subscribe((value) => {
        this.notificationData = value;
        if (value && value.duration) {
          this.animateProgress(value.duration);
        }
      });
  }

  animateProgress(duration: number) {
    this.progressValue = 0;

    const startTime = performance.now();

    const animate = (time: number) => {
      const elapsed = time - startTime;
      this.progressValue = Math.min(
        (elapsed / duration) * this.PROGRESS_MAX_VALUE,
        this.PROGRESS_MAX_VALUE
      );

      if (this.progressValue < this.PROGRESS_MAX_VALUE) {
        this.animationId = requestAnimationFrame(animate);
      } else {
        this.notificationData = null;
        cancelAnimationFrame(this.animationId!);
      }
    };

    this.animationId = requestAnimationFrame(animate);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onClose(): void {
    this.notificationData = null;
  }
}
