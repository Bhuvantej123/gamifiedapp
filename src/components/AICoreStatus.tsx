import React from 'react';
import { motion } from 'motion/react';
import { useUserStore } from '../store/userStore';
import { useGameStore } from '../store/gameStore';
import { Cpu, Activity } from 'lucide-react';

export const AICoreStatus: React.FC = () => {
  const profile = useUserStore((state) => state.profile);
  const stats = useGameStore((state) => state.stats);

  // Derive sync percentage from level to make it feel dynamic
  const syncLevel = Math.min(100, 40 + (stats?.current_level || 1) * 3.5).toFixed(1);

  return (
    <div className="w-full flex flex-col items-center justify-center py-6">
      <div className="relative w-48 h-48 flex items-center justify-center">
        {/* Outer Ring 1 */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 border-2 border-dashed border-[var(--color-primary)]/30 rounded-full"
        />
        
        {/* Outer Ring 2 */}
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute inset-2 border border-[var(--color-secondary)]/40 rounded-full"
          style={{ clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' }}
        />

        {/* Pulsing Core */}
        <motion.div
          animate={{ 
            scale: [1, 1.1, 1],
            boxShadow: [
              "0 0 20px var(--color-primary)",
              "0 0 60px var(--color-primary)",
              "0 0 20px var(--color-primary)"
            ]
          }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="w-24 h-24 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] rounded-full flex items-center justify-center relative z-10"
        >
          <div className="w-20 h-20 bg-black/40 rounded-full flex items-center justify-center backdrop-blur-sm">
            <Cpu className="w-8 h-8 text-white opacity-80" />
          </div>
        </motion.div>

        {/* Floating Particles */}
        {[1, 2, 3, 4].map((i) => (
          <motion.div
            key={i}
            animate={{
              y: [0, -20, 0],
              opacity: [0, 1, 0]
            }}
            transition={{
              duration: 2,
              delay: i * 0.5,
              repeat: Infinity,
            }}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{
              left: `${50 + (Math.random() * 40 - 20)}%`,
              top: `${50 + (Math.random() * 40 - 20)}%`,
            }}
          />
        ))}
      </div>

      <div className="mt-8 text-center space-y-2 w-full">
        <div className="flex items-center justify-center space-x-2 text-[var(--color-primary)]">
          <Activity className="w-4 h-4" />
          <span className="text-xs font-black uppercase tracking-[0.3em]">Neural Sync</span>
        </div>
        
        <div className="text-4xl font-black tracking-tighter">
          {syncLevel}%
        </div>
        
        <div className="flex justify-between items-center px-4 py-2 mt-4 bg-white/5 rounded-lg border border-white/10">
           <span className="text-[10px] uppercase font-bold text-slate-400">Core Status</span>
           <span className="text-[10px] uppercase font-black text-green-400 animate-pulse">Optimal</span>
        </div>
        <div className="flex justify-between items-center px-4 py-2 bg-white/5 rounded-lg border border-white/10">
           <span className="text-[10px] uppercase font-bold text-slate-400">Context</span>
           <span className="text-[10px] uppercase font-black text-[var(--color-secondary)] truncate max-w-[120px]">
             {profile?.persona.sport} / {profile?.persona.hobby}
           </span>
        </div>
      </div>
    </div>
  );
};
