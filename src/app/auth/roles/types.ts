export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  isPasswordResetRequired: true;
}
export interface Profile extends User {
  firstName: string;
  lastName: string;
}