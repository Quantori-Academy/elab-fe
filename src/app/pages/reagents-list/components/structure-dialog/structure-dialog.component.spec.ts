import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StructureDialogComponent } from './structure-dialog.component';

describe('StructureDialogComponent', () => {
  let component: StructureDialogComponent;
  let fixture: ComponentFixture<StructureDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StructureDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StructureDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
