import { create } from 'zustand';
import { GameStats, QuestProgress } from '../types';

interface GameState {
  stats: GameStats | null;
  quests: QuestProgress[];
  setStats: (stats: GameStats) => void;
  setQuests: (quests: QuestProgress[]) => void;
  addXP: (amount: number) => void;
  recordWin: () => void;
}

export const useGameStore = create<GameState>((set) => ({
  stats: null,
  quests: [],
  setStats: (stats) => set({ stats }),
  setQuests: (quests) => set({ quests }),
  addXP: (amount) => set((state) => {
    if (!state.stats) return state;
    const newXP = state.stats.total_xp + amount;
    const newLevel = Math.floor(newXP / 500) + 1;
    return {
      stats: {
        ...state.stats,
        total_xp: newXP,
        current_level: newLevel,
      },
    };
  }),
  recordWin: () => set((state) => {
    if (!state.stats) return state;
    return {
      stats: {
        ...state.stats,
        total_wins: (state.stats.total_wins || 0) + 1,
      },
    };
  }),
}));
