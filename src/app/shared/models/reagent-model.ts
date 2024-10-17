import { OrderEntity } from './order-entity.model';

export interface Reagents {
  id: number;
  name: string;
  category: Category;
  desc: string;
  quantity: number | string;
  storageLocation: string;
  structure: string;
  dateOfCreation: string;
}

export enum Category {
  reagent = 'Reagent',
  sample = 'Sample',
}

export interface ReagentRequest extends OrderEntity {
  quantityLeft: number;
  expirationDate: string;
  storageId: number;
}
