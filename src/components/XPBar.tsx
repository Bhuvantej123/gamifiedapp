import React from 'react';
import { motion } from 'motion/react';
import { useGameStore } from '../store/gameStore';
import { useUserStore } from '../store/userStore';
import { themes } from '../utils/themeConfig';

export const XPBar: React.FC = () => {
  const stats = useGameStore((state) => state.stats);
  const profile = useUserStore((state) => state.profile);
  const theme = themes[profile?.theme || 'harry_potter'];

  if (!stats) return null;

  const xpProgress = (stats.total_xp % 500) / 5; // Percentage of 500 XP per level

  return (
    <div className="w-full max-w-xl mx-auto p-4">
       <div className="flex justify-between items-end mb-2">
         <div>
           <span className="text-xs uppercase tracking-widest opacity-60">{theme.labels.level} {stats.current_level}</span>
           <h3 className="text-lg font-bold">{stats.total_xp} <span className="text-sm font-normal opacity-70">{theme.labels.xp}</span></h3>
         </div>
         <span className="text-xs opacity-60">{500 - (stats.total_xp % 500)} until next {theme.labels.level}</span>
       </div>
       <div className="h-4 bg-[var(--color-card)] rounded-full overflow-hidden border border-[var(--color-primary)]/20 shadow-inner">
         <motion.div
           initial={{ width: 0 }}
           animate={{ width: `${xpProgress}%` }}
           transition={{ duration: 1, ease: "easeOut" }}
           className="h-full bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] shadow-[0_0_10px_rgba(var(--color-primary),0.5)]"
         />
       </div>
    </div>
  );
};
