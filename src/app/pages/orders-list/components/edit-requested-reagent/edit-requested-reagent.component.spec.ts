import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditRequestedReagentComponent } from './edit-requested-reagent.component';

describe('EditRequestedReagentComponent', () => {
  let component: EditRequestedReagentComponent;
  let fixture: ComponentFixture<EditRequestedReagentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditRequestedReagentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditRequestedReagentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
