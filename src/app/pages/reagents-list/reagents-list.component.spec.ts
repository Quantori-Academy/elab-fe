import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReagentsListComponent } from './reagents-list.component';

describe('ReagentsListComponent', () => {
  let component: ReagentsListComponent;
  let fixture: ComponentFixture<ReagentsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReagentsListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReagentsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
