export interface EmailSendSuccess {
  isSuccess: boolean;
  message: string;
}

export interface EmailSendResponse {
  message: string;
}

export interface ResetPassword {
  resetToken: string;
  newPassword: string;
  confirmPassword: string;
}
