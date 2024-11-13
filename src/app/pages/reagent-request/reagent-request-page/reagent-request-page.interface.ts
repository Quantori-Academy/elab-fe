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

export interface ReagentRequestResponse {
  requests: ReagentRequestList[];
  size: number;
}
