import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Trophy, Globe, Users, BookOpen, Dumbbell, Zap } from 'lucide-react';
import { LeaderboardRow } from '../components/LeaderboardRow';

export const Leaderboard: React.FC = () => {
  const [filter, setFilter] = useState('global');
  
  const tabs = [
    { id: 'global', name: 'Global', icon: Globe },
    { id: 'squad', name: 'My Squad', icon: Users },
    { id: 'coding', name: 'Coding', icon: Zap },
    { id: 'studies', name: 'Studies', icon: BookOpen },
    { id: 'sports', name: 'Sports', icon: Trophy },
    { id: 'fitness', name: 'Fitness', icon: Dumbbell },
  ];

  // Mock Leaderboard Data
  const data = [
    { rank: 1, name: 'Alice Cooper', xp: 24500, level: 49, streak: 120 },
    { rank: 2, name: 'Bob Stark', xp: 22100, level: 45, streak: 85 },
    { rank: 3, name: 'Charlie Potter', xp: 20400, level: 41, streak: 92 },
    { rank: 4, name: 'Dave Bowman', xp: 18900, level: 38, streak: 56 },
    { rank: 5, name: 'Ellen Ripley', xp: 15400, level: 31, streak: 44, isMe: true },
    { rank: 6, name: 'Frank Poole', xp: 14200, level: 29, streak: 30 },
    { rank: 7, name: 'G. Oldman', xp: 12100, level: 25, streak: 12 },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 pt-10 pb-32 space-y-12">
       <header className="text-center">
          <div className="inline-block p-4 rounded-full bg-[var(--color-primary)]/10 mb-6">
             <Trophy className="w-12 h-12 text-[var(--color-secondary)]" />
          </div>
          <h1 className="text-5xl font-black italic tracking-tighter uppercase mb-2">Hall of Legends</h1>
          <p className="opacity-50 text-sm max-w-sm mx-auto">Real-time ranking of the most synchronized minds in the sector.</p>
       </header>

       {/* Tabs */}
       <div className="flex bg-white/5 p-1.5 rounded-2xl border border-white/5 overflow-x-auto no-scrollbar">
          {tabs.map((tab) => (
             <button
               key={tab.id}
               onClick={() => setFilter(tab.id)}
               className={`flex items-center space-x-2 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                 filter === tab.id 
                   ? 'bg-[var(--color-primary)] text-white shadow-lg' 
                   : 'opacity-40 hover:opacity-100'
               }`}
             >
                <tab.icon className="w-4 h-4" />
                <span>{tab.name}</span>
             </button>
          ))}
       </div>

       {/* Results Scroll */}
       <div className="space-y-2">
          {data.map((row) => (
             <LeaderboardRow key={row.rank} {...row} />
          ))}
       </div>

       <div className="p-8 bg-white/5 rounded-3xl border border-dashed border-white/10 text-center opacity-40">
          <p className="text-xs italic">Next reset in 2 days, 4 hours, 12 minutes.</p>
       </div>
    </div>
  );
};
