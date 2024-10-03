import { TestBed } from '@angular/core/testing';

import { NotificationPopupService } from './notification-popup.service';

describe('NotificationPopupService', () => {
  let service: NotificationPopupService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NotificationPopupService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
