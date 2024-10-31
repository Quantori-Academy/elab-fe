import { SortDirection } from '@angular/material/sort';

export interface Order {
  id: number;
  userId: number;
  title: string;
  seller: string;
  status: 'Pending' | 'Fulfilled' | 'Cancelled' | string;
  createdAt: string; 
  updatedAt: string;
  reagents: RequestedReagents[];
}
export interface RequestedReagents {
  id: number;
  userId: number;
  name: string;
  structureSmiles: string;
  casNumber: string;
  desiredQuantity: number;
  quantityUnit: string;
  userComments: string | null;
  procurementComments: string | null;
  status: 'Pending' | 'Fulfilled' | 'Cancelled' | string;
  createdAt: string;
  updatedAt: string;
  orderId: number;
}
export enum Status {
  pending = 'Pending',
  ordered = 'Ordered',
  fulfilled = 'Fulfilled',
  declined = 'Declined',
}
export interface OrderQuery {
  skip?: number;
  take?: number;
  sortBySeller?: SortDirection;
  sortByCreationDate?: SortDirection;
  sortByTitle?: SortDirection;
  orderTitle?: string;
  orderSeller?: string;
  orderStatus?: string;
}

export interface OrderRequest {
  title: string;
  seller: string;
  reagents: { id: number }[];
}
