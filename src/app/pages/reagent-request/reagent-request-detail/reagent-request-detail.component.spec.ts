import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReagentRequestDetailComponent } from './reagent-request-detail.component';

describe('ReagentRequestDetailComponent', () => {
  let component: ReagentRequestDetailComponent;
  let fixture: ComponentFixture<ReagentRequestDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReagentRequestDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReagentRequestDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
