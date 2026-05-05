import React from 'react';
import { motion } from 'motion/react';
import { Users, Sword, ShieldCheck } from 'lucide-react';
import { Squad } from '../types';

interface SquadCardProps {
  squad: Squad;
}

export const SquadCard: React.FC<SquadCardProps> = ({ squad }) => {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-[var(--color-card)] rounded-2xl border border-[var(--color-primary)]/20 overflow-hidden shadow-xl"
    >
      <div className="p-6">
        <div className="flex justify-between items-start mb-6">
          <div className="p-3 bg-[var(--color-primary)]/10 rounded-xl">
             <Users className="w-6 h-6 text-[var(--color-primary)]" />
          </div>
          <div className="text-right">
             <span className="text-[10px] uppercase tracking-widest opacity-40">Squad Rank</span>
             <h4 className="text-xl font-black italic">TOP 5%</h4>
          </div>
        </div>

        <h3 className="text-2xl font-black mb-1">{squad.name}</h3>
        <p className="text-xs opacity-50 mb-6">{squad.members.length} Members • Active Raid</p>

        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-[10px] uppercase font-bold mb-1">
              <span className="opacity-60 flex items-center">
                <Sword className="w-3 h-3 mr-1" /> GROUP RAID PROGRESS
              </span>
              <span className="text-[var(--color-secondary)]">{squad.raid_progress}%</span>
            </div>
            <div className="h-2 bg-white/5 rounded-full overflow-hidden">
               <motion.div 
                 initial={{ width: 0 }}
                 animate={{ width: `${squad.raid_progress}%` }}
                 className="h-full bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)]" 
               />
            </div>
          </div>

          <div className="p-3 bg-white/5 rounded-lg border border-white/5">
             <span className="text-[8px] uppercase font-bold opacity-40 block mb-1">Current Raid Target</span>
             <div className="flex justify-between items-center">
                <span className="text-sm font-bold">{squad.current_raid_topic || 'No Active Raid'}</span>
                {squad.raid_status === 'completed' && <ShieldCheck className="w-4 h-4 text-green-500" />}
             </div>
          </div>
        </div>
      </div>

      <div className="px-6 py-4 bg-white/5 border-t border-white/5 flex justify-between items-center">
        <div className="flex -space-x-2">
           {[1, 2, 3].map((i) => (
             <div key={i} className="w-8 h-8 rounded-full bg-[var(--color-card)] border-2 border-[var(--color-primary)]/20 flex items-center justify-center text-[10px] font-bold">
                {String.fromCharCode(64 + i)}
             </div>
           ))}
        </div>
        <button className="text-xs font-black uppercase tracking-widest text-[var(--color-primary)] hover:text-[var(--color-secondary)] transition-colors">
          View Fortress
        </button>
      </div>
    </motion.div>
  );
};
