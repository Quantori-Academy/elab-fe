import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PoDashboardComponent } from './po-dashboard.component';

describe('PoDashboardComponent', () => {
  let component: PoDashboardComponent;
  let fixture: ComponentFixture<PoDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PoDashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PoDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
