export interface User {
  id: number;
  email: string;
  role: string;
}
export interface Profile extends User {
  firstName: string;
  lastName: string;
}