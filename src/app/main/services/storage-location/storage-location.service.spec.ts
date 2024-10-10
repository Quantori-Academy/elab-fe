import { TestBed } from '@angular/core/testing';

import { StorageLocationService } from './storage-location.service';

describe('StorageLocationService', () => {
  let service: StorageLocationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StorageLocationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
