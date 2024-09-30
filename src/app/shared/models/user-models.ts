export interface IUser {
  id: number; // TODO: Change type for security
  name: string;
  lastName: string;
  email: string; // Email / Username
  role: UserRoles;
  password: string;
}

export enum UserRoles {
  admin = 'admin',
  procurementOfficer = 'procurementOfficer',
  researcher = 'researcher',
}
