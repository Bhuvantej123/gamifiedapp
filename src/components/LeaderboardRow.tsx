import React from 'react';
import { motion } from 'motion/react';
import { Trophy, Flame, Star } from 'lucide-react';

interface LeaderboardRowProps {
  rank: number;
  name: string;
  xp: number;
  level: number;
  streak: number;
  isMe?: boolean;
}

export const LeaderboardRow: React.FC<LeaderboardRowProps> = ({ rank, name, xp, level, streak, isMe }) => {
  const getRankColor = () => {
    if (rank === 1) return 'text-yellow-500';
    if (rank === 2) return 'text-slate-300';
    if (rank === 3) return 'text-amber-700';
    return 'text-white/40';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex items-center p-4 rounded-xl transition-all ${
        isMe ? 'bg-[var(--color-primary)]/20 border border-[var(--color-primary)]/40 shadow-lg' : 'bg-white/5 hover:bg-white/10'
      } mb-2`}
    >
      <div className={`w-8 text-lg font-black italic ${getRankColor()}`}>
        {rank}
      </div>
      
      <div className="flex-1 flex items-center space-x-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[var(--color-primary)]/20 to-[var(--color-accent)]/20 border border-white/10 flex items-center justify-center font-bold">
           {name.charAt(0)}
        </div>
        <div>
          <div className="flex items-center space-x-2">
            <span className={`font-bold ${isMe ? 'text-[var(--color-secondary)]' : 'text-white'}`}>{name}</span>
            {isMe && <Star className="w-3 h-3 text-[var(--color-secondary)] fill-[var(--color-secondary)]" />}
          </div>
          <span className="text-[10px] uppercase opacity-40">System Lvl {level}</span>
        </div>
      </div>

      <div className="flex items-center space-x-6 text-right">
        <div className="flex items-center space-x-1">
          <Flame className="w-4 h-4 text-orange-500" />
          <span className="text-sm font-bold text-orange-500">{streak}</span>
        </div>
        <div className="w-20">
          <span className="text-sm font-black text-white">{xp.toLocaleString()}</span>
          <span className="block text-[8px] uppercase opacity-40 font-bold">XP</span>
        </div>
      </div>
    </motion.div>
  );
};
