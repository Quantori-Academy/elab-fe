import { OrderEntity } from './order-entity.model';

// this interface was based on requirments in issue's description, not on current mock data, if we switch back to those requiremnts we will uncomment this
// export interface Reagent {
//   id: number;
//   name: string;
//   category: Category;
//   description: string;
//   quantity: number | string;
//   storageLocation: string;
//   structure: string;
//   dateOfCreation: string;
// }

// the one that's in swagger "get reagent Api" right now
// export interface Reagent{
//   name:string;
//   category:string;
//   description:string;
//   quantityLeft:number;
//   storageId:number;
// }

//current interface, according to dimitri's reagent's list
export interface Reagent {
  name: string;
  smiles: string;
  cas: string;
  quantity: number | null;
  package: string;
  units: string;
  quantityLeft: number | null;
  room: string;
  location: string;
  structure:string;
}

export enum Category {
  reagent = 'Reagent',
  sample = 'Sample',
}

export interface ReagentRequest extends OrderEntity {
  quantityLeft: number | null;
  expirationDate: string;
  storageId: number;
  category: Category | null;
  structure: string;
}

export enum Unit {
  MOL = 'mol',
  MMOL = 'mmol',
  MICROGRAM = 'µg',
  MILLIGRAM = 'mg',
  GRAM = 'g',
  KILOGRAM = 'kg',
  LITER = 'L',
  MILLILITER = 'mL',
  CUBIC_CENTIMETER = 'cm³',
  MOLARITY = 'M',
  PERCENT = 'percent',
  PPM = 'ppm',
  PPB = 'ppb',
  DENSITY = 'g/mL',
}

export const UnitLabels: { [key in Unit]: string } = {
  [Unit.MOL]: 'Molar (mol)',
  [Unit.MMOL]: 'Millimole (mmol)',
  [Unit.MICROGRAM]: 'Microgram (µg)',
  [Unit.MILLIGRAM]: 'Milligram (mg)',
  [Unit.GRAM]: 'Gram (g)',
  [Unit.KILOGRAM]: 'Kilogram (kg)',
  [Unit.LITER]: 'Liter (L)',
  [Unit.MILLILITER]: 'Milliliter (mL)',
  [Unit.CUBIC_CENTIMETER]: 'Cubic Centimeter (cm³)',
  [Unit.MOLARITY]: 'Molarity (M)',
  [Unit.PERCENT]: 'Percent (%)',
  [Unit.PPM]: 'Parts per Million (ppm)',
  [Unit.PPB]: 'Parts per Billion (ppb)',
  [Unit.DENSITY]: 'Density (g/mL)',
};
