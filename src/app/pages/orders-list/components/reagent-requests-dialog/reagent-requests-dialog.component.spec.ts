import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReagentRequestsDialogComponent } from './reagent-requests-dialog.component';

describe('ReagentRequestsDialogComponent', () => {
  let component: ReagentRequestsDialogComponent;
  let fixture: ComponentFixture<ReagentRequestsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReagentRequestsDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReagentRequestsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
