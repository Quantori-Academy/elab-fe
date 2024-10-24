import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { RoomData } from '../models/storage-location.interface';

@Injectable({
  providedIn: 'root',
})
export class RoomManagementService {
  private url = environment.apiUrl;
  private apiUrl = `${this.url}/api/v1`;

  public pageSize = 10;

  constructor(private http: HttpClient) {}

  public getListOfRooms(): Observable<RoomData[]> {
    return of([
      { id: 1, name: 'Room1', description: 'description of room 1' },
      { id: 2, name: 'Room2', description: 'description of room 2' },
      { id: 3, name: 'Room3', description: 'description of room 3' },
    ]);
  }

  public addNewRoom(newRoom: RoomData): Observable<RoomData> {
    return this.http.post<RoomData>(`${this.apiUrl}/rooms`, { newRoom });
  }
}
