import { InventoryEntry } from '../types';

const STORAGE_KEY = 'precision_tracker_entries';

export const storageService = {
  getEntries: (): InventoryEntry[] => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error('Failed to load entries:', e);
      return [];
    }
  },

  saveEntries: (entries: InventoryEntry[]): void => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
    } catch (e) {
      console.error('Failed to save entries:', e);
    }
  },

  clearAll: (): void => {
    localStorage.removeItem(STORAGE_KEY);
  }
};