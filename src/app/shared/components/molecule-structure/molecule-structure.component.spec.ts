import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MoleculeStructureComponent } from './molecule-structure.component';

describe('MoleculeStructureComponent', () => {
  let component: MoleculeStructureComponent;
  let fixture: ComponentFixture<MoleculeStructureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MoleculeStructureComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MoleculeStructureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
