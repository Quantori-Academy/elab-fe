import { ReagentRequestList } from '../../reagent-request/reagent-request-page/reagent-request-page.interface';

export interface Order {
  id: number;
  userId: number;
  title: string;
  seller: string;
  status: 'Pending' | 'Fulfilled' | 'Cancelled' | string;
  createdAt: string;
  updatedAt: string;
  reagents: ReagentRequestList[];
}

export enum Status {
  pending = 'Pending',
  submitted = 'Submitted',
  fulfilled = 'Fulfilled',
  declined = 'Declined',
  ordered = 'Ordered',
  completed = 'Completed'
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
  reagents: { id: number;}[];
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
