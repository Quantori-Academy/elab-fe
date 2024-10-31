import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableLoaderSpinnerComponent } from './table-loader-spinner.component';

describe('TableLoaderSpinnerComponent', () => {
  let component: TableLoaderSpinnerComponent;
  let fixture: ComponentFixture<TableLoaderSpinnerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TableLoaderSpinnerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TableLoaderSpinnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
