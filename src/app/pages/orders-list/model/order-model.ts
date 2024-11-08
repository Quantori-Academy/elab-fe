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
  submitted = 'Submitted',
  fulfilled = 'Fulfilled',
  declined = 'Declined',
}
export interface OrderQuery {
  skip: number;
  take: number;
  title: string;
  seller: string;
  status: string;
  titleOrder: string;
  sellerOrder: string;
  createdAt: string;
  updatedAt: string;
}
export interface OrderRequest {
  title: string;
  seller: string;
  reagents: { id: number }[];
}
export interface OrdersListData {
  orders: Order[];
  size: number;
}
export enum OrdersTableColumns {
  title = 'title',
  seller = 'seller',
  createdAt = 'createdAt',
  updatedAt = 'updatedAt',
  status = 'status',
}
export interface OrderFilter {
  value: string;
  column: OrdersTableColumns;
}

export interface UpdateOrder {
  title?: string;
  seller?: string;
  status?: string;
  includeReagents?: { id: number }[];
  excludeReagents?: { id: number }[];
}