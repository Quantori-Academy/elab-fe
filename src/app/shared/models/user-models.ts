export interface IUserInfo {
  id: number;
  firstName: string;
  lastName: string;
  email: string; // Email / Username
  role: UserRoles;
  password?: string;
}

export enum UserRoles {
  Admin = 'Admin',
  ProcurementOfficer = 'ProcurementOfficer',
  Researcher = 'Researcher',
}
