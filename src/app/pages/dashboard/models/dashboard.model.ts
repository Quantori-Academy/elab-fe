import { Reagent } from '../../../shared/models/reagent-model';
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

export interface ResearcherDashboardDataResponse {
  reagentsVsSampleNumber: {
    _count: {
      id: number;
    };
    category: 'Reagent' | 'Sample';
  }[];
  reagentsVsSampleExpiredNumber: {
    _count: {
      id: number;
    };
    category: 'Reagent' | 'Sample';
  }[];
  reagentsVsSampleEmptyNumber: {
    _count: {
      id: number;
    };
    category: 'Reagent' | 'Sample';
  }[];
  expiredList: Reagent[];
  emptyList: Reagent[];
}
