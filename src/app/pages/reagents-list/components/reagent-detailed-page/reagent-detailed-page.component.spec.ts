import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReagentDetailedPageComponent } from './reagent-detailed-page.component';

describe('ReagentDetailedPageComponent', () => {
  let component: ReagentDetailedPageComponent;
  let fixture: ComponentFixture<ReagentDetailedPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReagentDetailedPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReagentDetailedPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
