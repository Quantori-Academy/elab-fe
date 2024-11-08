import { TestBed } from '@angular/core/testing';

import { ReagentsQueryService } from './reagents-query.service';

describe('ReagentsQueryService', () => {
  let service: ReagentsQueryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReagentsQueryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
