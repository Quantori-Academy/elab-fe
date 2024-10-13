import { Component, inject } from '@angular/core';
import { MaterialModule } from '../../../material.module';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { StorageLocationItem } from '../../models/storage-location.interface';
import { StorageLocationService } from '../../services/storage-location/storage-location.service';
import { debounceTime, map, Observable, switchMap, take, tap } from 'rxjs';
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
  readonly DEBOUNCE_TIME = 300;
  public addStorageForm: FormGroup;

  private fb = inject(FormBuilder);
  private storageLocationService = inject(StorageLocationService);

  public filteredRooms$: Observable<string[]>;
  public filteredNames$: Observable<string[]>;

  constructor() {
    this.addStorageForm = this.fb.group(
      {
        room: [
          '',
          [Validators.required, Validators.maxLength(this.MAX_LENGTH)],
        ],
        name: [
          '',
          [Validators.required, Validators.maxLength(this.MAX_LENGTH)],
        ],
      },
      { asyncValidators: this.validateUniqueLocation.bind(this) }
    );
    this.filteredRooms$ = this.addStorageForm.get('room')!.valueChanges.pipe(
      debounceTime(this.DEBOUNCE_TIME),
      switchMap((value) => this.storageLocationService.getRoomList(value))
    );

    this.filteredNames$ = this.addStorageForm.get('name')!.valueChanges.pipe(
      debounceTime(this.DEBOUNCE_TIME),
      switchMap((value) => this.storageLocationService.getNameList(value))
    );
  }

  public get locationName(): string {
    const { room, name } = this.addStorageForm.value;
    return `${room} ${name}`;
  }

  public validateUniqueLocation(control: AbstractControl) {
    const room = control.get('room')?.value.trim();
    const name = control.get('name')?.value.trim();
    const locationName = `${room} ${name}`;

    return this.storageLocationService.locationNames$.pipe(
      take(1),
      map((value: string[]) => {
        return value.includes(locationName) ? { uniqueName: true } : null;
      }),
      tap((error) => this.addStorageForm.get('name')?.setErrors(error))
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
