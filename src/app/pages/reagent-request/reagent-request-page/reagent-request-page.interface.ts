export interface ReagentRequestList {
  id: number;
  casNumber: string | null;
  name: string;
  userId: number;
  desiredQuantity: string | null;
  structureSmiles: string | null;
  structureImage: string | null;
  userComments: string | null;
  procurementComments: string | null;
  status: 'Pending' | 'Ordered' | 'Fulfilled' | 'Declined';
  createdAt?: string;
  updatedAt?: string;
  quantityUnit?: string;
  package?: string;
}

export interface ReagentRequestCreate {
  name: string;
  desiredQuantity: number;
  quantityUnit: string;
  structureSmiles?: string;
  casNumber?: string;
  userComments?: string;
  package?: string;
  status: 'Pending' | 'Ordered' | 'Fulfilled' | 'Declined';
}

// had to add, will remove once denis merges his branch
export interface ReagentRequestQuery {
  skip: number;
  take: number;
  sortByQuantity: string;
  sortByCreatedDate: string;
  sortByUpdatedDate: string;
  status: string;
  name: string;
}
export interface ReagentRequestData {
  requests: ReagentRequestList[];
  size: number;
}
export enum ReagentRequestTableColumns {
  name = 'name',
  status = 'status',
  createdAt = 'createdAt',
}
export interface ReagentRequestFilter {
  value: string;
  column: ReagentRequestTableColumns;
}