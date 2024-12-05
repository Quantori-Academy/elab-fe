import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmDeclineDialogComponent } from './confirm-decline-dialog.component';

describe('ConfirmDeclineDialogComponent', () => {
  let component: ConfirmDeclineDialogComponent;
  let fixture: ComponentFixture<ConfirmDeclineDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmDeclineDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfirmDeclineDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
