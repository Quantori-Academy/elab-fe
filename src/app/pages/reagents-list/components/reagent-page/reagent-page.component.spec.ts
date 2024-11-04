import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReagentPageComponent } from './reagent-page.component';

describe('ReagentPageComponent', () => {
  let component: ReagentPageComponent;
  let fixture: ComponentFixture<ReagentPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReagentPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReagentPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
