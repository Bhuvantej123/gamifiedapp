import React from 'react';
import { Flame } from 'lucide-react';
import { motion } from 'motion/react';
import { useGameStore } from '../store/gameStore';

export const StreakCounter: React.FC = () => {
  const stats = useGameStore((state) => state.stats);

  if (!stats) return null;

  return (
    <motion.div 
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="flex items-center space-x-2 bg-orange-500/10 border border-orange-500/20 px-3 py-1.5 rounded-full"
    >
      <Flame className={`w-5 h-5 text-orange-500 ${stats.streak_count > 0 ? 'animate-pulse' : 'opacity-50'}`} />
      <span className="font-bold text-orange-500">{stats.streak_count}</span>
      <span className="text-xs font-medium opacity-70 text-orange-400">Day Streak</span>
    </motion.div>
  );
};
