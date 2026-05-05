import React from 'react';
import { motion } from 'motion/react';
import { BookOpen, Trophy, Shield, Users, Trophy as LeaderboardIcon, Settings, User } from 'lucide-react';
import { useUserStore } from '../store/userStore';
import { themes } from '../utils/themeConfig';

export const Navbar: React.FC = () => {
  const profile = useUserStore((state) => state.profile);
  const theme = themes[profile?.theme || 'harry_potter'];

  const navItems = [
    { icon: BookOpen, label: 'Dashboard', path: '/dashboard' },
    { icon: Trophy, label: 'Quests', path: '/quests' },
    { icon: Users, label: theme.labels.squad, path: '/squad' },
    { icon: LeaderboardIcon, label: 'Rankings', path: '/leaderboard' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 md:top-0 md:bottom-auto bg-[var(--color-card)]/80 backdrop-blur-md border-t md:border-b md:border-t-0 border-[var(--color-primary)]/20 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="hidden md:flex items-center space-x-2">
            <Shield className="w-8 h-8 text-[var(--color-primary)]" />
            <span className="font-bold text-xl tracking-tight">QuestIQ</span>
          </div>

          <div className="flex flex-1 md:flex-none justify-around md:space-x-8">
            {navItems.map((item) => (
              <motion.a
                key={item.label}
                href={item.path}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="flex flex-col md:flex-row items-center space-y-1 md:space-y-0 md:space-x-2 p-2 text-sm font-medium opacity-70 hover:opacity-100 transition-opacity"
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </motion.a>
            ))}
          </div>

          <div className="hidden md:flex items-center space-x-4">
             <a href="/profile" className="p-2 rounded-full bg-[var(--color-primary)]/10">
               <User className="w-5 h-5" />
             </a>
             <a href="/settings">
               <Settings className="w-5 h-5" />
             </a>
          </div>
        </div>
      </div>
    </nav>
  );
};
