import { Injectable } from '@angular/core';
import { NewPassword } from '../../models/forgot-password.interface';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ForgotPasswordService {
  changePassword(newPasswordObj: NewPassword): Observable<boolean> {
    console.log(newPasswordObj);
    return of(false);
  }
}
