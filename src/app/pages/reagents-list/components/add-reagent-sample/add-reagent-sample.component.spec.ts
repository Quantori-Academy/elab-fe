import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddReagentSampleComponent } from './add-reagent-sample.component';

describe('AddReagentSampleComponent', () => {
  let component: AddReagentSampleComponent;
  let fixture: ComponentFixture<AddReagentSampleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddReagentSampleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddReagentSampleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
