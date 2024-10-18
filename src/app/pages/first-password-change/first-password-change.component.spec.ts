import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FirstPasswordChangeComponent } from './first-password-change.component';

describe('FirstPasswordChangeComponent', () => {
  let component: FirstPasswordChangeComponent;
  let fixture: ComponentFixture<FirstPasswordChangeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FirstPasswordChangeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FirstPasswordChangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
