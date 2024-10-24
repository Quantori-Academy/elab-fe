import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient, HttpResponseBase } from '@angular/common/http';
import { BehaviorSubject, Observable, take, tap } from 'rxjs';
import { RoomData } from '../models/storage-location.interface';

@Injectable({
  providedIn: 'root',
})
export class RoomManagementService {
  private url = environment.apiUrl;
  private apiUrl = `${this.url}/api/v1`;

  private roomDataSubject = new BehaviorSubject<RoomData[] | undefined>(
    undefined
  );
  public roomData$ = this.roomDataSubject.asObservable();

  public pageSize = 10;

  constructor(private http: HttpClient) {}

  public getListOfRooms(): Observable<RoomData[]> {
    return this.http
      .get<RoomData[]>(`${this.apiUrl}/rooms`)
      .pipe(tap((data) => this.roomDataSubject.next(data)));
  }

  public loadListOfRooms() {
    this.getListOfRooms().pipe(take(1)).subscribe();
  }

  public addNewRoom(newRoom: RoomData): Observable<RoomData> {
    return this.http
      .post<RoomData>(`${this.apiUrl}/rooms`, newRoom)
      .pipe(tap(() => this.loadListOfRooms()));
  }

  public editRoom(id: number, newRoom: RoomData): Observable<RoomData> {
    return this.http
      .patch<RoomData>(`${this.apiUrl}/rooms/${id}`, newRoom)
      .pipe(tap(() => this.loadListOfRooms()));
  }

  public deleteRoom(id: number): Observable<HttpResponseBase> {
    return this.http
      .delete<HttpResponseBase>(`${this.apiUrl}/rooms/${id}`, {
        observe: 'response',
      })
      .pipe(tap(() => this.loadListOfRooms()));
  }
}
