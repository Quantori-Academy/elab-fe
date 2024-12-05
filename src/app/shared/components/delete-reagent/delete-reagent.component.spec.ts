import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteReagentComponent } from './delete-reagent.component';

describe('DeleteReagentComponent', () => {
  let component: DeleteReagentComponent;
  let fixture: ComponentFixture<DeleteReagentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteReagentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeleteReagentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
