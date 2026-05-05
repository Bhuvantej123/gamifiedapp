import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Book, Trophy, Dumbbell, Lock, ChevronRight, Zap } from 'lucide-react';
import { useUserStore } from '../store/userStore';
import { useNavigate } from 'react-router-dom';

const DOMAINS = [
  { id: 'coding', name: 'Coding', icon: Zap, topics: ["React Architecture", "Python Logic", "Database Design", "CSS Mastery", "Neural Networks"] },
  { id: 'studies', name: 'Studies', icon: Book, topics: ["Newton's Laws", "Photosynthesis", "Trigonometry", "The Renaissance", "Machine Learning"] },
  { id: 'sports', name: 'Sports', icon: Trophy, topics: ["Cricket Strategy", "Football Tactics", "Basketball IQ", "Swimming Science", "Endurance Running"] },
  { id: 'fitness', name: 'Fitness', icon: Dumbbell, topics: ["HIIT Science", "Nutrition 101", "Muscle Hypertrophy", "Recovery Sleep", "Mental Grit"] },
];

export const QuestMap: React.FC = () => {
  const [activeDomain, setActiveDomain] = useState('studies');
  const profile = useUserStore((state) => state.profile);
  const navigate = useNavigate();

  const domain = DOMAINS.find(d => d.id === activeDomain);

  return (
    <div className="max-w-7xl mx-auto px-4 pt-10 pb-32">
       <header className="mb-12">
          <span className="text-[10px] uppercase font-black tracking-[0.4em] text-[var(--color-primary)]">Mission Selection</span>
          <h1 className="text-5xl font-black tracking-tighter mt-2">The Quest Map</h1>
       </header>

       {/* Domain Switcher */}
       <div className="flex space-x-2 mb-12 p-2 bg-white/5 rounded-2xl overflow-x-auto no-scrollbar">
          {DOMAINS.map((d) => (
             <button
                key={d.id}
                onClick={() => setActiveDomain(d.id)}
                className={`flex items-center space-x-3 px-8 py-4 rounded-xl font-bold transition-all whitespace-nowrap ${
                  activeDomain === d.id 
                    ? 'bg-[var(--color-primary)] text-white shadow-lg' 
                    : 'opacity-50 hover:opacity-100 hover:bg-white/5'
                }`}
             >
                <d.icon className="w-5 h-5" />
                <span>{d.name}</span>
             </button>
          ))}
       </div>

       {/* Topic Grid */}
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {domain?.topics.map((topic, i) => {
             const isLocked = i > 0; // Simple mock for locking logic
             return (
                <motion.div
                  key={topic}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={!isLocked ? { scale: 1.02, y: -4 } : {}}
                  onClick={() => !isLocked && navigate(`/learn/${encodeURIComponent(topic)}`)}
                  className={`group relative p-8 rounded-[2.5rem] border-2 h-72 flex flex-col justify-between overflow-hidden transition-all ${
                    isLocked 
                      ? 'bg-slate-900/40 border-white/5 grayscale pointer-events-none' 
                      : 'glass-card border-vibrant hover:border-[var(--color-primary)] cursor-pointer'
                  }`}
                >
                   {/* Background Glow */}
                   {!isLocked && (
                      <div className="absolute -top-24 -right-24 w-48 h-48 bg-[var(--color-primary)]/10 rounded-full blur-3xl group-hover:bg-[var(--color-primary)]/20 transition-all" />
                   )}

                   <div>
                      <div className="flex justify-between items-start mb-4">
                         <span className="text-[10px] uppercase font-black tracking-widest opacity-40">Section {i + 1}</span>
                         {isLocked && <Lock className="w-4 h-4 opacity-20" />}
                      </div>
                      <h3 className={`text-2xl font-black leading-tight ${isLocked ? 'opacity-40' : 'opacity-100'}`}>
                         {topic}
                      </h3>
                   </div>

                   <div className="flex items-center justify-between">
                      {isLocked ? (
                        <div className="text-[10px] font-bold opacity-20 italic">Unlocks at Level {i + 1}</div>
                      ) : (
                        <>
                           <div className="flex items-center space-x-1">
                              {[1, 2, 3].map(s => (
                                 <div key={s} className="w-2 h-2 rounded-full bg-[var(--color-primary)]/20" />
                              ))}
                           </div>
                           <div className="flex items-center text-[var(--color-primary)] font-black text-xs uppercase tracking-widest">
                              Engage <ChevronRight className="w-4 h-4 ml-1" />
                           </div>
                        </>
                      )}
                   </div>
                </motion.div>
             );
          })}
       </div>

       {/* Raid Alert */}
       <motion.div 
         initial={{ opacity: 0, y: 40 }}
         whileInView={{ opacity: 1, y: 0 }}
         viewport={{ once: true }}
         className="mt-20 p-12 rounded-[3rem] bg-gradient-to-r from-[var(--color-secondary)]/20 to-transparent border-2 border-[var(--color-secondary)]/30 text-center relative overflow-hidden shadow-2xl"
       >
          <div className="absolute top-0 right-0 p-12 opacity-5 translate-x-12 -translate-y-12 rotate-45">
             <Trophy className="w-80 h-80 text-[var(--color-secondary)]" />
          </div>
          <h4 className="text-xs font-black uppercase tracking-[0.3em] text-[var(--color-secondary)] mb-4">Urgent Mission Alert</h4>
          <h2 className="text-4xl font-black mb-6 tracking-tighter">WEEKLY SQUAD RAID: QUANTUM ANOMALY</h2>
          <p className="opacity-70 max-w-2xl mx-auto mb-10 text-lg leading-relaxed">
             Synchronize your cognitive streams with your crew to conquer the anomaly. Group rewards: 5000 XP + Rare Catalyst Badge.
          </p>
          <button className="bg-white text-black px-12 py-5 rounded-2xl font-black uppercase tracking-widest hover:scale-105 transition-transform shadow-xl">
             ASSEMBLE CREW
          </button>
       </motion.div>
    </div>
  );
};
