import React from 'react';
import { motion } from 'motion/react';
import { Lock, CheckCircle2, Play, ChevronRight } from 'lucide-react';
import { QuestProgress } from '../types';
import { useUserStore } from '../store/userStore';
import { themes } from '../utils/themeConfig';

interface QuestCardProps {
  quest: QuestProgress;
  index: number;
}

export const QuestCard: React.FC<QuestCardProps> = ({ quest, index }) => {
  const profile = useUserStore((state) => state.profile);
  const theme = themes[profile?.theme || 'harry_potter'];

  const isLocked = quest.status === 'locked';
  const isCompleted = quest.status === 'completed';

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      className={`relative group p-6 rounded-2xl border transition-all duration-300 ${
        isLocked 
          ? 'bg-black/20 border-white/5 grayscale pointer-events-none' 
          : 'bg-[var(--color-card)] border-[var(--color-primary)]/20 hover:border-[var(--color-primary)]/50 cursor-pointer shadow-lg hover:shadow-[0_0_20px_rgba(var(--color-primary),0.1)]'
      }`}
    >
      <div className="flex justify-between items-start mb-4">
        <div className="p-2 rounded-lg bg-[var(--color-primary)]/10">
          {isCompleted ? (
            <CheckCircle2 className="w-5 h-5 text-green-500" />
          ) : isLocked ? (
            <Lock className="w-5 h-5 text-white/20" />
          ) : (
            <Play className="w-5 h-5 text-[var(--color-primary)]" />
          )}
        </div>
        <div className="flex flex-col items-end">
           <span className="text-[10px] uppercase tracking-widest opacity-50">{theme.labels.xp}</span>
           <span className="text-sm font-bold text-[var(--color-secondary)]">+{quest.xp_earned || 50}</span>
        </div>
      </div>

      <h3 className={`text-lg font-bold mb-1 ${isLocked ? 'opacity-40' : 'opacity-100'}`}>
        {quest.topic}
      </h3>
      
      <div className="flex items-center space-x-2">
        <div className="flex-1 h-1 bg-white/5 rounded-full overflow-hidden">
          <div 
             className="h-full bg-[var(--color-primary)] transition-all duration-500" 
             style={{ width: isCompleted ? '100%' : isLocked ? '0%' : '33%' }}
          />
        </div>
        <span className="text-[10px] uppercase opacity-40">
          {isCompleted ? 'Finished' : isLocked ? 'Locked' : 'Level 1/3'}
        </span>
      </div>

      {!isLocked && (
        <div className="mt-4 flex items-center justify-end text-[var(--color-primary)] opacity-0 group-hover:opacity-100 transition-opacity">
          <span className="text-xs font-bold mr-1">START {theme.labels.quest.toUpperCase()}</span>
          <ChevronRight className="w-4 h-4" />
        </div>
      )}
    </motion.div>
  );
};
