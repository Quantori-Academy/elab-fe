import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeclineReagentRequestComponent } from './decline-reagent-request.component';

describe('DeclineReagentRequestComponent', () => {
  let component: DeclineReagentRequestComponent;
  let fixture: ComponentFixture<DeclineReagentRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeclineReagentRequestComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DeclineReagentRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
