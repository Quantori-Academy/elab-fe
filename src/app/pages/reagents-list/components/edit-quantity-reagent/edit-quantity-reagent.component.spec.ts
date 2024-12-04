import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditQuantityReagentComponent } from './edit-quantity-reagent.component';

describe('EditQuantityReagentComponent', () => {
  let component: EditQuantityReagentComponent;
  let fixture: ComponentFixture<EditQuantityReagentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditQuantityReagentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditQuantityReagentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
