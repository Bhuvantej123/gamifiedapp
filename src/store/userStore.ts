import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Profile, ThemeType } from '../types';

interface UserState {
  profile: Profile | null;
  setProfile: (profile: Profile | null) => void;
  updateTheme: (theme: ThemeType) => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      profile: null,
      setProfile: (profile) => set({ profile }),
      updateTheme: (theme) => set((state) => ({
        profile: state.profile ? { ...state.profile, theme } : null
      })),
    }),
    { name: 'user-storage' }
  )
);
