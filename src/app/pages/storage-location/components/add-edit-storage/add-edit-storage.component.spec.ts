import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StorageLocationAddNewComponent } from './add-edit-storage.component';

describe('StorageLocationAddNewComponent', () => {
  let component: StorageLocationAddNewComponent;
  let fixture: ComponentFixture<StorageLocationAddNewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StorageLocationAddNewComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(StorageLocationAddNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
