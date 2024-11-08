export interface ReagentRequest {
  casNumber: string;
  createdAt: string;
  desiredQuantity: number;
  id: number;
  name: string;
  orderId: number;
  procurementComments: null;
  quantityUnit: string;
  status: string;
  structureSmiles: string;
  updatedAt: string;
  userComments: string;
  userId: number;
}

export interface ReagentRequestTable {
  casNumber: string;
  desiredQuantity: number;
  id: number;
  name: string;
  userComments: string;
}

export interface UpdateReagentRequest {
  status: string;
  procurementComments: string;
}
