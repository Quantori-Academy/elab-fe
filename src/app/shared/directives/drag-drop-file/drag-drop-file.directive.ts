import { Directive, EventEmitter, HostBinding, HostListener, Output } from '@angular/core';

@Directive({
  selector: '[appDragDropFile]',
  standalone: true
})
export class DragDropFileDirective {
  @HostBinding('class.fileOver') fileOver!: boolean;
  @Output() fileDropped = new EventEmitter<File>();

  @HostListener('dragover', ['$event'])
  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.fileOver = true;
  }

  @HostListener('dragleave', ['$event'])
  onDragLeave(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.fileOver = false;
  }

  @HostListener('drop', ['$event'])
  ondrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.fileOver = false;
    const file = event.dataTransfer?.files[0];
    if (file) {
      this.fileDropped.emit(file);
    }
  }
}
