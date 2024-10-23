import { StorageLocationColumn } from './storage-location.enum';

export interface StorageLocationItem {
  id: number;
  roomId: number;
  name: string;
  description: string;
  createdAt?: string;
  updatedAt?: string;
  room: {
    id: number;
    name: string;
    description: string | null;
  };
}

export interface StorageLocationPageData {
  skip: number;
  take: number;
  chronologicalDate: string;
  alphabeticalRoomName: string;
  alphabeticalStorageName: string;
  roomName: string;
  storageName: string;
}

export interface StorageLocationFilteredData {
  value: string;
  column: StorageLocationColumn;
}
