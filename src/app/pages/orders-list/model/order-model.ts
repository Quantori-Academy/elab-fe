import { SortDirection } from '@angular/material/sort';
import { Reagent } from '../../../shared/models/reagent-model';

export interface Order {
  title: string;
  seller: string;
  id: number;
  userId: number;
  createdAt: string | Date;
  updatedAt: string | Date;
  status: Status;
  reagents: Reagent[];
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
// Arman's interface: export interface Order {
//   id: number;
//   userId: number;
//   status: Status;
//   reagents: Reagent[];  // assuming Reagent is another interface
//   createdAt: Date;
//   updatedAt: Date;
// }
// interface Order {
//   id: number
//   userId: number
//   tittle: string
//   seller: string
//   status: Status // enum
//   reagents: Reagent[]
//   createdAt: Date
//   updatedAt: Date
// }
