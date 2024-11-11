import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MoveReagentComponent } from './move-reagent.component';

describe('MoveReagentComponent', () => {
  let component: MoveReagentComponent;
  let fixture: ComponentFixture<MoveReagentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MoveReagentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MoveReagentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
