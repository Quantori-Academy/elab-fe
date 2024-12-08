import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReagentHistoryDialogComponent } from './reagent-history-dialog.component';

describe('ReagentHistoryDialogComponent', () => {
  let component: ReagentHistoryDialogComponent;
  let fixture: ComponentFixture<ReagentHistoryDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReagentHistoryDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReagentHistoryDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
