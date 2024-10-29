export interface ReagentRequest {
  id?: number;
  name: string;
  userId: number;
  desiredQuantity: string | null;
  structureSmiles: string | null;
  structureImage: string | null;
  casNumber: string | null;
  userComments: string | null;
  procurementComments: string | null;
  status: 'Pending' | 'Ordered' | 'Fulfilled' | 'Declined';
  createdAt?: string;
  updatedAt?: string;
}
