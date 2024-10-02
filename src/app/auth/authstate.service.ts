import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthStateService {
  logoutEvent = new Subject<void>();
}
