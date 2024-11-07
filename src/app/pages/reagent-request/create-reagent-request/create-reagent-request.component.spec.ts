import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateReagentRequestComponent } from './create-reagent-request.component';

describe('CreateReagentRequestComponent', () => {
  let component: CreateReagentRequestComponent;
  let fixture: ComponentFixture<CreateReagentRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateReagentRequestComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateReagentRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
