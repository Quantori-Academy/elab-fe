export interface ReagentRequestList {
  id?: number;
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
}
