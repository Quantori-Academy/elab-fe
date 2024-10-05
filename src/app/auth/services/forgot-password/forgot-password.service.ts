import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import {
  EmailSendResponse,
  ResetPassword,
} from '../../models/forgot-password.interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ForgotPasswordService {
  private url = environment.apiUrl;
  private apiUrl = `${this.url}/api/v1/users`;

  constructor(private http: HttpClient) {}

  public sendEmail(email: string): Observable<EmailSendResponse> {
    return this.http.post<EmailSendResponse>(`${this.apiUrl}/forgot-password`, {
      email,
    });
  }

  public resetPassword(request: ResetPassword): Observable<EmailSendResponse> {
    const { resetToken, newPassword, confirmPassword } = request;

    return this.http.post<EmailSendResponse>(
      `${this.apiUrl}/reset-password`,
      {
        newPassword,
        confirmPassword,
      },
      {
        params: {
          reset_token: resetToken,
        },
      }
    );
  }
}
