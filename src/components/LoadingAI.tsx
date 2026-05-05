import React from 'react';
import { motion } from 'motion/react';
import { Loader2 } from 'lucide-react';
import { useUserStore } from '../store/userStore';
import { themes } from '../utils/themeConfig';

export const LoadingAI: React.FC<{ message?: string }> = ({ message = "AI is crafting your quest..." }) => {
  const profile = useUserStore((state) => state.profile);
  const theme = themes[profile?.theme || 'harry_potter'];

  return (
    <div className="flex flex-col items-center justify-center p-12 space-y-4">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        className="relative"
      >
        <Loader2 className="w-12 h-12 text-[var(--color-primary)] opacity-20" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-4 h-4 rounded-full bg-[var(--color-accent)] animate-ping" />
        </div>
      </motion.div>
      <div className="text-center">
        <motion.p
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-sm font-medium tracking-widest uppercase opacity-70"
        >
          {message}
        </motion.p>
        <p className="text-[10px] opacity-40 mt-1 italic">
          {theme.id === 'interstellar' && "Analyzing quantum probability fields..."}
          {theme.id === 'harry_potter' && "Consulting the Ancient Tomes..."}
          {theme.id === 'avengers' && "Accessing S.H.I.E.L.D. Databases..."}
        </p>
      </div>
    </div>
  );
};
