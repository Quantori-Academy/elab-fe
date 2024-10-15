export interface Reagents {
  name: string;
  category: Category;
  desc: string;
  quantity: number | string;
  storageLocation: string;
  structure: string;
}

export enum Category {
  reagent = 'Reagent',
  sample = 'Sample',
}
