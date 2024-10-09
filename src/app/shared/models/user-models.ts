export interface IUserInfo {
  id: number;
  firstName: string;
  lastName: string;
  email: string; // Email / Username
  role: UserRoles;
  password?: string;
}

export enum UserRoles {
  admin = 'Admin',
  procurementOfficer = 'ProcurementOfficer',
  researcher = 'Researcher',
}
