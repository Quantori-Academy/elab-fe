export interface IUser {
  id: number;
  email: string;
  password: string;
  role: UserRoles;
  firsName: string;
  lastName: string;
}

export enum UserRoles {
  Admin,
  ProcurementOfficer,
  Researcher,
}
