import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { NewStorageLocation } from '../models/storage-location.interface';

@Injectable({
  providedIn: 'root',
})
export class StorageLocationService {
  readonly DEBOUNCE_TIME = 300;
  private url = environment.apiUrl;
  private apiUrl = `${this.url}/api/v1/`;

  constructor(private http: HttpClient) {}

  private rooms = ['Room 1', 'Room 2', 'Room 3', 'Room 4'];
  private names = ['Name 1', 'Name 2', 'Name 3', 'Name 4'];
  public locationNames$ = of([
    'Room 1 Name 1',
    'Room 2 Name 1',
    'Room 3 Name 1',
    'Room 4 Name 1',
  ]);

  public addNewStorageLocation(newData: NewStorageLocation) {
    return this.http.post(this.apiUrl, newData);
  }

  public getRoomList(value: string): Observable<string[]> {
    const filteredValue = value.toLocaleLowerCase();
    return of(
      this.rooms.filter((room) =>
        room.toLocaleLowerCase().includes(filteredValue)
      )
    );
  }

  public getNameList(value: string): Observable<string[]> {
    const filteredValue = value.toLocaleLowerCase();
    return of(
      this.names.filter((name) =>
        name.toLocaleLowerCase().includes(filteredValue)
      )
    );
  }
}
