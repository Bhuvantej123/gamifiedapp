import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Trophy, Search, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const QuestMap: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/learn/${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 pt-20 pb-32 flex flex-col items-center">
       <header className="mb-12 text-center">
          <span className="text-[10px] uppercase font-black tracking-[0.4em] text-[var(--color-primary)]">Infinite Learning</span>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter mt-4 mb-6">What do you want to master today?</h1>
          <p className="text-xl opacity-60 max-w-2xl mx-auto">
             Enter any topic, concept, or skill. Our Analogy Engine will generate a personalized lesson mapped directly to your world.
          </p>
       </header>

       {/* Custom Topic Search */}
       <form onSubmit={handleSearch} className="w-full relative group max-w-3xl mb-24">
          <div className="absolute inset-y-0 left-0 pl-8 flex items-center pointer-events-none">
             <Search className="w-8 h-8 text-white/40 group-focus-within:text-[var(--color-primary)] transition-colors" />
          </div>
          <input
             type="text"
             value={searchQuery}
             onChange={(e) => setSearchQuery(e.target.value)}
             placeholder="Search a topic (e.g., Black Holes, React Hooks, Stoicism)..."
             className="w-full bg-white/5 border-2 border-white/10 text-white rounded-[3rem] py-8 pl-24 pr-10 text-2xl font-medium focus:outline-none focus:border-[var(--color-primary)] focus:bg-white/10 transition-all placeholder:text-white/30 shadow-2xl"
          />
          <button type="submit" className="absolute inset-y-3 right-3 px-10 bg-[var(--color-primary)] text-white rounded-[2.5rem] font-black text-lg uppercase tracking-widest hover:scale-105 transition-transform flex items-center space-x-2">
             <span>Generate</span>
             <Sparkles className="w-5 h-5" />
          </button>
       </form>

       {/* Raid Alert */}
       <motion.div 
         initial={{ opacity: 0, y: 40 }}
         whileInView={{ opacity: 1, y: 0 }}
         viewport={{ once: true }}
         className="w-full mt-10 p-12 rounded-[3rem] bg-gradient-to-r from-[var(--color-secondary)]/20 to-transparent border-2 border-[var(--color-secondary)]/30 text-center relative overflow-hidden shadow-2xl"
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
