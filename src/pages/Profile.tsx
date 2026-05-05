import React from 'react';
import { motion } from 'motion/react';
import { User, Shield, Star, Award, TrendingUp, Calendar, Zap, Trophy } from 'lucide-react';
import { RadarChartComponent } from '../components/RadarChart';
import { useUserStore } from '../store/userStore';
import { useGameStore } from '../store/gameStore';

export const Profile: React.FC = () => {
  const profile = useUserStore((state) => state.profile);
  const stats = useGameStore((state) => state.stats);

  if (!profile || !stats) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 pt-10 pb-32 space-y-12">
       {/* Hero Profile */}
       <div className="bg-[var(--color-card)] rounded-[40px] p-12 border border-[var(--color-primary)]/20 relative overflow-hidden text-center shadow-2xl">
          {/* Decorative background */}
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-[var(--color-primary)]/10 to-transparent -z-10" />
          
          <div className="relative inline-block mb-6">
             <div className="w-32 h-32 rounded-full bg-gradient-to-tr from-[var(--color-primary)] to-[var(--color-accent)] border-4 border-[var(--color-card)] shadow-2xl flex items-center justify-center font-black text-5xl">
                {profile.name.charAt(0)}
             </div>
             <div className="absolute -bottom-2 -right-2 p-2 bg-black rounded-full border border-[var(--color-primary)]">
                <Shield className="w-6 h-6 text-[var(--color-secondary)]" />
             </div>
          </div>

          <h1 className="text-4xl font-black mb-2">{profile.name}</h1>
          <div className="flex justify-center space-x-2 mb-8">
             <span className="px-3 py-1 bg-[var(--color-primary)]/20 text-[var(--color-primary)] rounded-full text-[10px] font-black uppercase tracking-widest border border-[var(--color-primary)]/30">
                {profile.house_or_role}
             </span>
             <span className="px-3 py-1 bg-white/5 text-white/60 rounded-full text-[10px] font-black uppercase tracking-widest border border-white/10">
                Level {stats.current_level}
             </span>
          </div>

          <div className="grid grid-cols-3 gap-8 max-w-lg mx-auto py-8 border-y border-white/5">
             <div>
                <span className="text-[10px] font-bold opacity-40 uppercase block mb-1">Rank</span>
                <p className="text-2xl font-black italic">#42</p>
             </div>
             <div>
                <span className="text-[10px] font-bold opacity-40 uppercase block mb-1">XP</span>
                <p className="text-2xl font-black italic">{stats.total_xp.toLocaleString()}</p>
             </div>
             <div>
                <span className="text-[10px] font-bold opacity-40 uppercase block mb-1">Streak</span>
                <p className="text-2xl font-black italic">{stats.streak_count}d</p>
             </div>
          </div>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Skill Matrix */}
          <div className="bg-[var(--color-card)] rounded-3xl p-8 border border-white/5">
             <div className="flex items-center space-x-3 mb-8">
                <TrendingUp className="w-5 h-5 text-[var(--color-primary)]" />
                <h3 className="text-sm font-black uppercase tracking-widest">Cognitive Matrix</h3>
             </div>
             <RadarChartComponent />
          </div>

          {/* Achievements */}
          <div className="bg-[var(--color-card)] rounded-3xl p-8 border border-white/5">
             <div className="flex items-center space-x-3 mb-8">
                <Award className="w-5 h-5 text-[var(--color-accent)]" />
                <h3 className="text-sm font-black uppercase tracking-widest">Digital Medals</h3>
             </div>
             <div className="grid grid-cols-3 gap-4">
                {[
                   { icon: Star, color: 'text-yellow-500', name: 'First Raid' },
                   { icon: Shield, color: 'text-blue-500', name: 'Defender' },
                   { icon: Zap, color: 'text-purple-500', name: 'Analyst' },
                   { icon: User, color: 'text-green-500', name: 'Cadet' },
                   { icon: Trophy, color: 'text-orange-500', name: 'Champion' },
                   { icon: Calendar, color: 'text-pink-500', name: 'Consistent' },
                ].map((item, i) => (
                   <motion.div
                     key={i}
                     whileHover={{ scale: 1.1 }}
                     className="text-center space-y-2 p-2"
                   >
                       <div className="aspect-square rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center p-3">
                          <item.icon className={`w-full h-full ${item.color}`} />
                       </div>
                       <span className="text-[8px] font-black uppercase opacity-40 block">{item.name}</span>
                   </motion.div>
                ))}
             </div>
          </div>
       </div>
    </div>
  );
};
