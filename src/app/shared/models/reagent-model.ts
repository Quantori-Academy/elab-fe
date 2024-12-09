import { OrderEntity } from './order-entity.model';

export interface Reagent {
  id: number;
  name: string;
  smiles: string;
  casNumber: string;
  category: Category;
  producer: string;
  totalQuantity: number | null;
  package: string;
  quantityUnit: string;
  quantityLeft: number | null;
  storageId: number;
  structure: string;
  storage: {
    name: string;
    room: {
      name: string;
    };
  };
  catalogId?: string;
  catalogLink?: string;
  pricePerUnit?: number;
  description?: string;
}

export interface ReagentFromFulfilledOrder {
  id: number;
  name: string;
  casNumber: string;
  producer: string;
  catalogId: string;
  catalogLink: string;
  pricePerUnit: number;
  quantityUnit: string;
  totalQuantity: number;
  description: string;
  quantityLeft: number;
  expirationDate: string;
  storageId: number;
  category: string;
  structure: string | null;
  package: string;
  createdAt: string;
  updatedAt: string;
}

export interface ReagentListResponse {
  reagents: Reagent[];
  size: number;
}

export interface SampleRequest extends OrderEntity {
  id?: number;
  structure: string;
  quantityLeft: number;
  expirationDate: string;
  storageId: number;
  category: Category | null;
  usedReagentSample: {
    reagentId: number;
    quantityUsed: number;
  }[];
}

export interface SelectedReagentSample {
  reagentId: number;
  isSelect: boolean;
  quantityUsed: number;
  name: string;
  quantityUnit: string;
  structure: string;
  errorMessage?: string;
}

export interface SampleRequestError {
  reagentId: number;
  errorMessage: string;
}

export enum Category {
  reagent = 'Reagent',
  sample = 'Sample',
}

export interface ReagentRequest extends OrderEntity {
  quantityLeft: number | null;
  expirationDate: string;
  storageId: number | null;
  category: Category | null;
  structure: string;
}

export interface ReagentListQuery {
  name: string;
  category: string;
  storageId: string;
  structure: string;
  isFullStructure: boolean;
  sortByName: string;
  sortByCreationDate: string;
  sortByUpdatedDate: string;
  skip: number;
  take: number;
}

export interface ReagentListFilteredData {
  value: string;
  column: ReagentListColumn;
  isFullStructure?: boolean;
}

export interface MoveReagentData {
  sourceStorageId: number;
  destinationStorageId: number;
  reagents: { id: number }[];
}

export interface ReagentHistory {
  id: number;
  userId: number;
  action: string;
  entity: string;
  oldData: null | Partial<Reagent> | Partial<SampleRequest>;
  newData: ReagentHistoryNewData;
  timestamp: string;
}

export interface ReagentHistoryNewData {
  id: number;
  name: string;
  category: string;
  description?: string;
  storageId: number;
  quantityLeft: number | null;
  quantityUnit: string;
  totalQuantity: number | null;
  expirationDate?: string;
  package?: string | null;
  createdAt: string;
  updatedAt: string;
  usedReagentSample?: UsedReagentSample[];
}

export interface UsedReagentSample {
  id: number;
  name: string;
  category: string;
  producer?: string | null;
  casNumber?: string | null;
  catalogId?: string | null;
  catalogLink?: string | null;
  pricePerUnit?: number | null;
  quantityLeft: number | null;
  quantityUnit: string;
  totalQuantity: number | null;
  expirationDate?: string | null;
  structure?: string | null;
  description?: string | null;
  package?: string | null;
  storageId: number;
  createdAt: string;
  updatedAt: string;
}

export enum ReagentListColumn {
  CHECKBOX = 'checkbox',
  NAME = 'name',
  CATEGORY = 'category',
  STRUCTURE = 'structure',
  QUANTITY = 'quantity',
  QUANTITYLEFT = 'quantityLeft',
  CAS = 'cas',
  LOCATION = 'location',
  ACTIONS = 'actions',
  EXPIREDDATE = 'expiredDate',
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

export enum Package {
  BOTTLE = 'Bottle',
  SOLVENTS_BOX = 'SolventsBox',
  PACKAGE_BOX = 'PackageBox',
}

export const PackageLabels: { [key in Package]: string } = {
  [Package.BOTTLE]: 'Bottle',
  [Package.SOLVENTS_BOX]: 'Solvents Box',
  [Package.PACKAGE_BOX]: 'Package Box',
};
