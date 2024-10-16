import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StructureEditorComponent } from './structure-editor.component';

describe('StructureEditorComponent', () => {
  let component: StructureEditorComponent;
  let fixture: ComponentFixture<StructureEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StructureEditorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StructureEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
