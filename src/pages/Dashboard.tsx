import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Shield, Zap, Target, Users, ArrowUpRight, Flame } from 'lucide-react';
import { XPBar } from '../components/XPBar';
import { StreakCounter } from '../components/StreakCounter';
import { RadarChartComponent } from '../components/RadarChart';
import { QuestCard } from '../components/QuestCard';
import { useUserStore } from '../store/userStore';
import { useGameStore } from '../store/gameStore';
import { themes } from '../utils/themeConfig';
import { supabase, SUPABASE_CONFIGURED } from '../lib/supabase';
import { LevelUpModal } from '../components/LevelUpModal';

export const Dashboard: React.FC = () => {
  const profile = useUserStore((state) => state.profile);
  const theme = themes[profile?.theme || 'harry_potter'];
  const { stats, setStats, quests, setQuests } = useGameStore();
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [prevLevel, setPrevLevel] = useState(1);

  useEffect(() => {
    if (!profile) return;

    const fetchData = async () => {
      if (!SUPABASE_CONFIGURED || profile.id === 'demo-user') {
        // Set initial mock stats for demo mode
        if (!stats) {
          setStats({
            user_id: profile.id,
            total_xp: 4200,
            current_level: 14,
            streak_count: 12,
            last_active_date: new Date().toISOString(),
            streak_freeze_count: 0
          } as any);
        }
        // Set initial mock quests for demo mode
        if (quests.length === 0) {
         const initialQuests = [
           { user_id: profile.id, domain: 'coding', topic: "React Architecture", status: 'active', xp_earned: 0 },
           { user_id: profile.id, domain: 'coding', topic: 'Python Logic', status: 'active', xp_earned: 0 },
           { user_id: profile.id, domain: 'coding', topic: 'Database Design', status: 'locked', xp_earned: 0 },
         ];
         setQuests(initialQuests as any);
        }
        return;
      }

      // Fetch stats
      const { data: statsData } = await supabase
        .from('game_stats')
        .select('*')
        .eq('user_id', profile.id)
        .single();
      
      if (statsData) {
        setStats(statsData);
        if (statsData.current_level > prevLevel) {
          setShowLevelUp(true);
          setPrevLevel(statsData.current_level);
        }
      }

      // Fetch active quests
      const { data: questData } = await supabase
        .from('quest_progress')
        .select('*')
        .eq('user_id', profile.id)
        .order('last_attempted_at', { ascending: false })
        .limit(3);
      
      if (questData) {
        setQuests(questData);
      } else {
         // Create some initial quests if none exist
         const initialQuests = [
            { user_id: profile.id, domain: 'studies', topic: "Newton's Laws", status: 'active', xp_earned: 0 },
            { user_id: profile.id, domain: 'studies', topic: 'Photosynthesis', status: 'locked', xp_earned: 0 },
            { user_id: profile.id, domain: 'fitness', topic: 'HIIT Science', status: 'locked', xp_earned: 0 },
         ];
         setQuests(initialQuests as any);
      }
    };

    fetchData();
  }, [profile, setStats, setQuests, quests.length, prevLevel]);

  if (!profile || !stats) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 pt-10 pb-32 space-y-12">
      <LevelUpModal 
        isOpen={showLevelUp} 
        level={stats.current_level} 
        onClose={() => setShowLevelUp(false)} 
      />

      {/* Header Info */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 glass-card p-6 rounded-[2rem] border-vibrant glow-primary">
        <div>
          <div className="flex items-center space-x-3 mb-2">
            <span className="text-[10px] uppercase font-black tracking-[0.4em] text-[var(--color-primary)]">Quest Navigation Module</span>
            <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase text-white bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)]`}>
              {profile.house_or_role}
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-[var(--color-primary)]">MISSION LOGS: {profile.name.toUpperCase()}</h1>
        </div>
        <div className="flex items-center space-x-4">
           <StreakCounter />
           <div className="p-4 bg-black/40 rounded-2xl border border-[var(--color-primary)]/50 shadow-[0_0_15px_rgba(0,209,255,0.1)]">
              <span className="text-[8px] uppercase font-bold text-slate-400 block mb-1 tracking-widest">Squad Status</span>
              <div className="flex items-center space-x-2">
                 <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                 <span className="text-sm font-black text-white">RELIANCE ACTIVE</span>
              </div>
           </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Stats & XP */}
        <div className="lg:col-span-8 space-y-8">
           <div className="glass-card rounded-[2.5rem] p-8 border-vibrant relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-5">
                 <Shield className="w-48 h-48" />
              </div>
              <XPBar />
              <div className="grid grid-cols-3 gap-6 mt-8 pt-8 border-t border-white/5">
                 <div className="bg-black/20 p-4 rounded-2xl border border-white/5">
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">Total Energy</span>
                    <p className="text-2xl font-black text-[var(--color-primary)]">{stats.total_xp}</p>
                 </div>
                 <div className="bg-black/20 p-4 rounded-2xl border border-white/5 text-center">
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">Mastered</span>
                    <p className="text-2xl font-black text-white">12</p>
                 </div>
                 <div className="bg-black/20 p-4 rounded-2xl border border-white/5 text-right">
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">Global Rank</span>
                    <p className="text-2xl font-black text-[var(--color-secondary)]">#42</p>
                 </div>
              </div>
           </div>

           {/* Active Quests */}
           <section>
              <div className="flex justify-between items-center mb-6">
                 <h2 className="text-xl font-black uppercase tracking-widest flex items-center">
                    <Zap className="w-5 h-5 mr-2 text-[var(--color-primary)]" />
                    Active {theme.labels.quest}s
                 </h2>
                 <a href="/quests" className="text-xs font-bold opacity-40 hover:opacity-100 flex items-center">
                    MAP VIEW <ArrowUpRight className="ml-1 w-3 h-3" />
                 </a>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                 {quests.map((q, i) => (
                    <a key={i} href={`/learn/${encodeURIComponent(q.topic)}`}>
                       <QuestCard quest={q} index={i} />
                    </a>
                 ))}
              </div>
           </section>
        </div>

        {/* Right Column: Skill Radar & Squad */}
        <div className="space-y-8">
           <div className="glass-card rounded-3xl p-8 border-vibrant">
              <h3 className="text-sm font-bold uppercase tracking-widest opacity-60 mb-6 flex items-center">
                 <Target className="w-4 h-4 mr-2" /> Skill Radar
              </h3>
              <RadarChartComponent />
              <div className="mt-4 p-4 bg-gradient-to-br from-[var(--color-primary)]/10 to-transparent rounded-xl border border-[var(--color-primary)]/20">
                 <span className="text-[10px] uppercase font-black text-[var(--color-primary)] tracking-widest">AI Command Insight</span>
                 <p className="text-xs italic opacity-70 mt-1 leading-relaxed">
                    "Your {profile.persona?.sport} patterns are highly compatible with your current objectives. Deploying optimization..."
                 </p>
              </div>
           </div>

           <div className="bg-gradient-to-br from-[var(--color-primary)]/20 to-[var(--color-secondary)]/20 rounded-[2.5rem] p-8 border-vibrant relative group cursor-pointer overflow-hidden shadow-xl">
              <div className="absolute top-0 right-0 p-4 translate-x-4 -translate-y-4 rotate-12 group-hover:translate-x-0 group-hover:translate-y-0 transition-transform">
                 <Users className="w-32 h-32 opacity-10" />
              </div>
              <h3 className="text-2xl font-black mb-2 flex items-center tracking-tighter">
                 ASSEMBLE SQUAD <Users className="w-6 h-6 ml-2" />
              </h3>
              <p className="text-sm opacity-70 mb-8 leading-tight">
                 Combine your IQ with 4 other explorers to dominate regional boss raids.
              </p>
              <button className="w-full text-xs font-black uppercase tracking-widest py-4 bg-white text-black rounded-2xl hover:scale-105 transition-transform shadow-lg">
                 ENTER FORTRESS
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};
