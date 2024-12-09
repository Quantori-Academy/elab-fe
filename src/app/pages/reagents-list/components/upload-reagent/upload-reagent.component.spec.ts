import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadReagentComponent } from './upload-reagent.component';

describe('UploadReagentComponent', () => {
  let component: UploadReagentComponent;
  let fixture: ComponentFixture<UploadReagentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UploadReagentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UploadReagentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
