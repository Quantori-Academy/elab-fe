import { Component, inject } from '@angular/core';
import { MaterialModule } from '../../../material.module';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { StorageLocationItem } from '../../models/storage-location.interface';
import { StorageLocationService } from '../../services/storage-location/storage-location.service';
import { debounceTime, Observable, switchMap, take } from 'rxjs';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-storage-location-add-new',
  standalone: true,
  imports: [MaterialModule, ReactiveFormsModule, MatDialogModule, AsyncPipe],
  templateUrl: './storage-location-add-new.component.html',
  styleUrl: './storage-location-add-new.component.scss',
})
export class StorageLocationAddNewComponent {
  readonly MAX_LENGTH = 300;
  readonly DEBOUNCE_TIME = 2000;
  public addStorageForm: FormGroup;

  private fb = inject(FormBuilder);
  private storageLocationService = inject(StorageLocationService);

  public filteredRooms$: Observable<string[]>;
  public filteredNames$: Observable<string[]>;

  constructor() {
    this.addStorageForm = this.fb.group({
      room: ['', [Validators.required, Validators.maxLength(this.MAX_LENGTH)]],
      name: ['', [Validators.required, Validators.maxLength(this.MAX_LENGTH)]],
    });
    this.filteredRooms$ = this.addStorageForm.get('room')!.valueChanges.pipe(
      debounceTime(this.DEBOUNCE_TIME),
      switchMap((value) => this.storageLocationService.getRoomList(value))
    );

    this.filteredNames$ = this.addStorageForm.get('name')!.valueChanges.pipe(
      debounceTime(this.DEBOUNCE_TIME),
      switchMap((value) => this.storageLocationService.getNameList(value))
    );
  }

  public hasError(label: string, error: string): boolean | undefined {
    return this.addStorageForm.get(label)?.hasError(error);
  }

  onSave() {
    if (this.addStorageForm.valid) {
      const formValue: StorageLocationItem = this.addStorageForm.value;

      this.storageLocationService
        .addNewStorageLocation(formValue)
        .pipe(take(1));
    }
  }
}
