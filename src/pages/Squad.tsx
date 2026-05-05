import React from 'react';
import { motion } from 'motion/react';
import { Users, Shield, Sword, MessageSquare, Zap, Target } from 'lucide-react';
import { SquadCard } from '../components/SquadCard';
import { useUserStore } from '../store/userStore';

export const Squad: React.FC = () => {
  const profile = useUserStore((state) => state.profile);

  // Mock Squad
  const mySquad = {
    id: 'squad-1',
    name: 'INTERSTELLAR ELITE',
    created_by: profile?.id || '',
    members: [
      { user_id: '1', role: 'Leader' },
      { user_id: '2', role: 'Strategist' },
      { user_id: '3', role: 'Explainer' },
    ],
    current_raid_topic: 'Quantum Mechanics',
    raid_status: 'active',
    raid_progress: 65,
  };

  return (
    <div className="max-w-7xl mx-auto px-4 pt-10 pb-32 space-y-12">
       <header className="flex flex-col md:flex-row justify-between items-end gap-6 text-left">
          <div>
             <span className="text-[10px] uppercase font-black tracking-[0.4em] text-[var(--color-primary)]">Fortress Command</span>
             <h1 className="text-5xl font-black mt-2 tracking-tighter">Your Squad</h1>
          </div>
          <div className="flex space-x-4 w-full md:w-auto">
             <button className="flex-1 md:flex-none px-6 py-3 bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/40 rounded-xl font-bold text-xs uppercase tracking-widest text-[var(--color-primary)]">
                Recruit Allies
             </button>
             <button className="flex-1 md:flex-none px-6 py-3 bg-[var(--color-primary)] text-white rounded-xl font-black text-xs uppercase tracking-widest">
                Initiate Raid
             </button>
          </div>
       </header>

       <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Context */}
          <div className="lg:col-span-2 space-y-8">
             <SquadCard squad={mySquad as any} />

             {/* Raid Board */}
             <section className="bg-[var(--color-card)] rounded-3xl p-8 border border-white/5 relative overflow-hidden">
                <div className="flex items-center space-x-3 mb-8">
                   <Shield className="w-6 h-6 text-[var(--color-secondary)]" />
                   <h2 className="text-sm font-black uppercase tracking-widest">Ongoing Collective Mission</h2>
                </div>

                <div className="space-y-6">
                   <div className="p-6 bg-white/5 rounded-2xl border border-white/5 flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                         <div className="p-3 bg-blue-500/10 rounded-xl">
                            <MessageSquare className="w-6 h-6 text-blue-500" />
                         </div>
                         <div>
                            <h4 className="font-bold">Teach-to-Unlock</h4>
                            <p className="text-xs opacity-50">Explainer role must verify topic for reward.</p>
                         </div>
                      </div>
                      <button className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-xs font-bold uppercase tracking-wider">Review</button>
                   </div>

                   <div className="p-6 bg-white/5 rounded-2xl border border-white/5 flex items-center justify-between opacity-50 grayscale hover:grayscale-0 hover:opacity-100 transition-all cursor-not-allowed">
                      <div className="flex items-center space-x-4">
                         <div className="p-3 bg-purple-500/10 rounded-xl">
                            <Zap className="w-6 h-6 text-purple-500" />
                         </div>
                         <div>
                            <h4 className="font-bold">The Great Synchrony</h4>
                            <p className="text-xs opacity-50">Locked until Raid progress reaches 80%.</p>
                         </div>
                      </div>
                   </div>
                </div>
             </section>
          </div>

          {/* Members & Chat Sidebar */}
          <div className="space-y-8">
             <div className="bg-[var(--color-card)] rounded-3xl p-8 border border-white/5">
                <h3 className="text-xs font-bold uppercase tracking-widest opacity-40 mb-6 font-black italic">SQUAD ROSTER</h3>
                <div className="space-y-4">
                   {[
                      { name: 'Cooper', role: 'Leader', xp: 5400, online: true },
                      { name: 'TARS', role: 'Strategist', xp: 4200, online: true },
                      { name: 'Brand', role: 'Explainer', xp: 3900, online: false },
                   ].map((m) => (
                      <div key={m.name} className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5">
                         <div className="flex items-center space-x-3">
                            <div className="relative">
                               <div className="w-8 h-8 rounded-full bg-[var(--color-primary)]/20 border border-[var(--color-primary)]/20 flex items-center justify-center font-bold text-xs uppercase">
                                  {m.name.charAt(0)}
                               </div>
                               {m.online && (
                                  <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 border-2 border-[var(--color-card)] rounded-full" />
                               )}
                            </div>
                            <div>
                               <div className="text-sm font-bold">{m.name}</div>
                               <div className="text-[10px] uppercase font-bold opacity-30">{m.role}</div>
                            </div>
                         </div>
                         <div className="text-right">
                             <div className="text-xs font-black">{m.xp}</div>
                             <div className="text-[8px] uppercase opacity-40 font-bold">XP</div>
                         </div>
                      </div>
                   ))}
                </div>
             </div>

             <div className="bg-orange-500/5 rounded-3xl p-8 border border-orange-500/20">
                <div className="flex items-center space-x-2 text-orange-500 mb-4">
                   <Target className="w-4 h-4" />
                   <h3 className="text-[10px] uppercase font-black tracking-widest">Raid Warning</h3>
                </div>
                <p className="text-xs italic opacity-80 leading-relaxed">
                   "Squadmate Brand is drifting. Send a concept nudge to bring them back into sync."
                </p>
                <button className="mt-4 w-full py-2 bg-orange-500 text-black text-[10px] font-black uppercase rounded-lg">
                   SEND NUDGE
                </button>
             </div>
          </div>
       </div>
    </div>
  );
};
