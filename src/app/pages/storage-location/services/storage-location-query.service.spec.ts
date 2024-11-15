import { TestBed } from '@angular/core/testing';

import { StorageLocationQueryService } from './storage-location-query.service';

describe('StorageLocationQueryService', () => {
  let service: StorageLocationQueryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StorageLocationQueryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
