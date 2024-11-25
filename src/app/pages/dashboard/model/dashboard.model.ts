import { UserRoles } from '../../../shared/models/user-models';

export interface AdminDashboardDataResponse {
  roomNumber: number;
  storageNumber: number;
  userNumber: number;
  storageNumberInRoom: {
    _count: {
      id: number;
    };
    roomId: number;
  }[];
  userNumberInRoles: {
    _count: {
      id: number;
    };
    role: UserRoles;
  }[];
}

export interface AdminKpiCard {
  title: string;
  icon: string;
  ind: number;
}
