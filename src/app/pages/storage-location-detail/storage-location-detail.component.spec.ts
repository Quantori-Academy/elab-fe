import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StorageLocationDetailComponent } from './storage-location-detail.component';

describe('StorageLocationDetailComponent', () => {
  let component: StorageLocationDetailComponent;
  let fixture: ComponentFixture<StorageLocationDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StorageLocationDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StorageLocationDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
