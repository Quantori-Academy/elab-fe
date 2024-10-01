export interface IUser {
  id: number;
  email: string;
  password: string;
  role: UserRoles;
  firstName: string;
  lastName: string;
}

export enum UserRoles {
  Admin,
  ProcurementOfficer,
  Researcher,
}
