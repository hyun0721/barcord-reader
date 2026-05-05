import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type ScanRecord = {
  id: string;
  value: string;
  format: string;
  photoUri?: string;
  scannedAt: string;
};

type ScanStore = {
  history: ScanRecord[];
  addScan: (value: string, format: string, photoUri?: string) => Promise<void>;
  loadHistory: () => Promise<void>;
  clearHistory: () => Promise<void>;
};

const STORAGE_KEY = '@scan_history';

export const useScanStore = create<ScanStore>((set, get) => ({
  history: [],

  addScan: async (value, format, photoUri) => {
    const record: ScanRecord = {
      id: Date.now().toString(),
      value,
      format,
      photoUri,
      scannedAt: new Date().toISOString(),
    };
    const next = [record, ...get().history].slice(0, 100);
    set({ history: next });
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  },

  loadHistory: async () => {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (raw) set({ history: JSON.parse(raw) });
  },

  clearHistory: async () => {
    set({ history: [] });
    await AsyncStorage.removeItem(STORAGE_KEY);
  },
}));
