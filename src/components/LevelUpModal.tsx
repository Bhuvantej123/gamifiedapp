import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, Star, X } from 'lucide-react';
import { ConfettiEffect } from './ConfettiEffect';
import { useUserStore } from '../store/userStore';
import { themes } from '../utils/themeConfig';

interface LevelUpModalProps {
  level: number;
  isOpen: boolean;
  onClose: () => void;
}

export const LevelUpModal: React.FC<LevelUpModalProps> = ({ level, isOpen, onClose }) => {
  const profile = useUserStore((state) => state.profile);
  const theme = themes[profile?.theme || 'harry_potter'];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={onClose}
          />
          <ConfettiEffect active={isOpen} />
          
          <motion.div
            initial={{ scale: 0.5, y: 100, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.5, y: 100, opacity: 0 }}
            className="relative bg-[var(--color-card)] border-2 border-[var(--color-primary)] w-full max-w-sm rounded-3xl p-8 text-center shadow-[0_0_50px_rgba(var(--color-primary),0.3)] overflow-hidden"
          >
            {/* Background Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-[var(--color-primary)]/20 rounded-full blur-[80px] -z-10" />

            <button onClick={onClose} className="absolute top-4 right-4 p-1 opacity-40 hover:opacity-100 transition-opacity">
              <X className="w-5 h-5" />
            </button>

            <motion.div
              animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.2, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="inline-block p-4 rounded-full bg-[var(--color-primary)]/20 mb-6"
            >
              <Trophy className="w-16 h-16 text-[var(--color-secondary)]" />
            </motion.div>

            <h2 className="text-sm uppercase tracking-[0.3em] font-medium mb-2 opacity-70">New Level Unlocked</h2>
            <h1 className="text-5xl font-black mb-4">
               {theme.labels.level} {level}
            </h1>

            <div className="flex justify-center space-x-2 mb-8">
              {[1, 2, 3].map((i) => (
                <motion.div
                  key={i}
                  animate={{ y: [0, -10, 0] }}
                  transition={{ delay: i * 0.2, duration: 1, repeat: Infinity }}
                >
                  <Star className="w-6 h-6 text-[var(--color-accent)] fill-[var(--color-accent)]" />
                </motion.div>
              ))}
            </div>

            <p className="text-sm opacity-80 mb-8 leading-relaxed">
              Your expertise is expanding. New quests have appeared on your map.
            </p>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onClose}
              className="w-full py-4 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] text-white font-bold rounded-xl shadow-lg"
            >
              CONTINUE THE QUEST
            </motion.button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
