import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditReagentRequestComponent } from './edit-reagent-request.component';

describe('EditReagentRequestComponent', () => {
  let component: EditReagentRequestComponent;
  let fixture: ComponentFixture<EditReagentRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditReagentRequestComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditReagentRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
