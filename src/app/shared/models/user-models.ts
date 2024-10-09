export interface IUserInfo {
  id: number;
  name: string;
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
