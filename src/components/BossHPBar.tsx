import React from 'react';
import { motion } from 'motion/react';
import { Shield } from 'lucide-react';

interface BossHPBarProps {
  currentHP: number;
  maxHP: number;
  bossName: string;
}

export const BossHPBar: React.FC<BossHPBarProps> = ({ currentHP, maxHP, bossName }) => {
  const percentage = (currentHP / maxHP) * 100;

  return (
    <div className="w-full max-w-xl mx-auto mb-8 px-4">
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center space-x-2">
           <Shield className="w-5 h-5 text-red-500 animate-pulse" />
           <span className="text-xs uppercase font-black tracking-tighter text-red-500">BOSS CHALLENGE</span>
        </div>
        <span className="text-xl font-black italic">{bossName}</span>
      </div>

      <div className="relative h-6 bg-black border-2 border-red-900 rounded overflow-hidden">
        {/* Fill */}
        <motion.div
           initial={{ width: '100%' }}
           animate={{ width: `${percentage}%` }}
           className={`h-full ${percentage < 30 ? 'bg-red-500' : 'bg-red-700'} shadow-[0_0_20px_rgba(255,0,0,0.5)]`}
        />
        
        {/* HP Text */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-[10px] font-black text-white shadow-sm">{currentHP} / {maxHP} HP</span>
        </div>

        {/* Glossy Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />
      </div>
    </div>
  );
};
