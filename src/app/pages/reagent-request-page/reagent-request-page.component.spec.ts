import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReagentsRequestPageComponent } from './reagent-request-page.component';

describe('ReagentRequestPageComponent', () => {
  let component: ReagentsRequestPageComponent;
  let fixture: ComponentFixture<ReagentsRequestPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReagentsRequestPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ReagentsRequestPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
