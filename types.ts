
export type ItemCategory = 'Bracelet' | 'Earring' | 'Pendant' | 'Necklace' | 'Ring' | 'Other';

export interface User {
  id: string;
  name: string;
  avatar?: string; // Base64 profile picture
  age?: string;
  address?: string;
  mobile?: string;
  email?: string;
  bio?: string;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  category: string;
  createdAt: number;
}

export interface InventoryEntry {
  id: string;
  userId: string;
  date: string;
  quantity: number;
  pairs: number;
  itemType: ItemCategory;
  invoiceNumber: string;
  weight: number; // In grams
  photo?: string; // Base64 or Blob URL
  createdAt: number;
  isDeleted?: boolean;
}

export type Theme = 'light' | 'dark';

export interface AppSettings {
  primaryTitle: string;
  secondaryTitle: string;
}

export interface FormState {
  date: string;
  quantity: number;
  pairs: number;
  itemType: ItemCategory;
  invoiceNumber: string;
  weight: string;
  photo: string | null;
  userId: string;
}
