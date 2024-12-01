import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditReagentComponent } from './edit-reagent.component';

describe('EditReagentComponent', () => {
  let component: EditReagentComponent;
  let fixture: ComponentFixture<EditReagentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditReagentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditReagentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
