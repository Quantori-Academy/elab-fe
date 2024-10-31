import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreateReagentComponent } from './create-reagent.component';

describe('CreateReagentComponent', () => {
  let component: CreateReagentComponent;
  let fixture: ComponentFixture<CreateReagentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateReagentComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateReagentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
