import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReagentsHistoryListComponent } from './reagents-history-list.component';

describe('ReagentsHistoryListComponent', () => {
  let component: ReagentsHistoryListComponent;
  let fixture: ComponentFixture<ReagentsHistoryListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReagentsHistoryListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReagentsHistoryListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
