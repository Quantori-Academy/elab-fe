import { Reagent } from '../../../shared/models/reagent-model';
import { UserRoles } from '../../../shared/models/user-models';
import { ReagentRequestList } from '../../reagent-request/reagent-request-page/reagent-request-page.interface';

export interface AdminDashboardDataResponse {
  roomNumber: number;
  storageNumber: number;
  userNumber: number;
  storageCountWithRoomNames: {
    storageCount: number;
    roomName: string;
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

interface ReagentVsSampleKpiData {
  _count: {
    id: number;
  };
  category: 'Reagent' | 'Sample';
}

export interface ResearcherDashboardDataResponse {
  reagentsVsSampleNumber: ReagentVsSampleKpiData[];
  reagentsVsSampleExpiredNumber: ReagentVsSampleKpiData[];
  reagentsVsSampleEmptyNumber: ReagentVsSampleKpiData[];
  expiredList: Reagent[];
  emptyList: Reagent[];
}

export interface ProcurementOfficerDashboardDataResponse {
  requestList: ReagentRequestList[];
  requestByStatuses: {
    _count: {
      id: number;
    };
    status: 'Declined' | 'Fulfilled' | 'Pending' | 'Ordered' | 'Completed';
  }[];
}
