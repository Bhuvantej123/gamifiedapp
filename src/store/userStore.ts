import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Profile, ThemeType } from '../types';

export interface GameRecord {
  id: string;
  topic: string;
  result: 'victory' | 'defeat';
  difficulty: string;
  timestamp: string;
}

interface UserState {
  profile: Profile | null;
  gameHistory: GameRecord[];
  setProfile: (profile: Profile | null) => void;
  updateTheme: (theme: ThemeType) => void;
  addGameRecord: (record: Omit<GameRecord, 'id' | 'timestamp'>) => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      profile: null,
      gameHistory: [],
      setProfile: (profile) => set({ profile }),
      updateTheme: (theme) => set((state) => ({
        profile: state.profile ? { ...state.profile, theme } : null
      })),
      addGameRecord: (record) => set((state) => {
        const history = Array.isArray(state.gameHistory) ? state.gameHistory : [];
        const newRecord = {
          ...record,
          id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 11),
          timestamp: new Date().toISOString(),
        };
        return {
          gameHistory: [newRecord, ...history].slice(0, 50),
        };
      }),
    }),
    { name: 'user-storage' }
  )
);
