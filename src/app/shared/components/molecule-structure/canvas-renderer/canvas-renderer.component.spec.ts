import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CanvasRendererComponent } from './canvas-renderer.component';

describe('CanvasRendererComponent', () => {
  let component: CanvasRendererComponent;
  let fixture: ComponentFixture<CanvasRendererComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CanvasRendererComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CanvasRendererComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
