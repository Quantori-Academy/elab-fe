import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NewReagentFormComponent } from './new-reagent-form.component';

describe('NewReagentFormComponent', () => {
  let component: NewReagentFormComponent;
  let fixture: ComponentFixture<NewReagentFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewReagentFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewReagentFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
