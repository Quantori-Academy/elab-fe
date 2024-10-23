export interface OrderEntity {
  name: string;
  casNumber: string;
  producer: string;
  catalogId: string;
  catalogLink: string;
  pricePerUnit: number | null;
  quantityUnit: string;
  totalQuantity: number | null;
  description: string;
}
