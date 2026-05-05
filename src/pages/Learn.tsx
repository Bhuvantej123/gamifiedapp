import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, Zap, Trophy, ArrowRight } from 'lucide-react';
import { getAnalogy } from '../services/geminiService';
import { useUserStore } from '../store/userStore';
import { AnalogyCard } from '../components/AnalogyCard';
import { LoadingAI } from '../components/LoadingAI';

export const Learn: React.FC = () => {
  const { topic } = useParams<{ topic: string }>();
  const navigate = useNavigate();
  const profile = useUserStore((state) => state.profile);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState('');

  const fetchAnalogy = useCallback(async () => {
    if (!topic) return;
    if (!profile) {
      setError('No profile found. Please complete onboarding first.');
      setLoading(false);
      return;
    }
    setLoading(true);
    setError('');
    try {
      const result = await getAnalogy(topic, profile.persona);
      setData(result);
    } catch (err: any) {
      const message = err?.message || String(err);
      console.error('[Analogy Engine Error]', message);
      setError(`AI engine error: ${message}`);
    } finally {
      setLoading(false);
    }
  }, [topic, profile]);

  useEffect(() => {
    fetchAnalogy();
  }, [fetchAnalogy]);

  if (!topic) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 pt-10 pb-32">
       <button 
         onClick={() => navigate('/quests')}
         className="flex items-center space-x-2 text-xs font-bold uppercase opacity-50 hover:opacity-100 transition-opacity mb-8"
       >
          <ChevronLeft className="w-4 h-4" />
          <span>Exit Simulation</span>
       </button>

       <header className="mb-12">
          <div className="flex items-center space-x-2 mb-2">
             <Zap className="w-5 h-5 text-[var(--color-primary)]" />
             <span className="text-[10px] uppercase font-black tracking-[0.4em] text-[var(--color-primary)]">Analogy Engine Active</span>
          </div>
          <h1 className="text-5xl font-black tracking-tighter">{topic}</h1>
       </header>

       <AnimatePresence mode="wait">
          {loading ? (
             <motion.div
               key="loading"
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
             >
                <LoadingAI message={`Analyzing ${topic} through your world...`} />
             </motion.div>
          ) : error ? (
             <div className="text-center p-12 bg-red-500/10 border border-red-500/20 rounded-3xl">
                <p className="text-red-500 font-bold">{error}</p>
                <button onClick={fetchAnalogy} className="mt-4 text-xs font-black uppercase text-red-500 underline underline-offset-4">Try Again</button>
             </div>
          ) : (
             <motion.div
               key="content"
               initial={{ opacity: 0, scale: 0.95 }}
               animate={{ opacity: 1, scale: 1 }}
               className="space-y-12"
             >
                <AnalogyCard data={data} onRegenerate={fetchAnalogy} />

                <div className="flex flex-col items-center space-y-6">
                   <div className="w-px h-16 bg-gradient-to-b from-[var(--color-primary)] to-transparent" />
                   <div className="text-center">
                      <h2 className="text-2xl font-black mb-2">Ready for the Trial?</h2>
                      <p className="text-sm opacity-50 mb-8 max-w-sm">
                         Conquer the Boss Battle to earn XP and unlock the next segment of your journey.
                      </p>
                      <button 
                        onClick={() => navigate(`/boss/${encodeURIComponent(topic)}`)}
                        className="bg-white text-black px-10 py-4 rounded-2xl font-black uppercase tracking-widest flex items-center space-x-3 shadow-2xl hover:scale-105 transition-transform"
                      >
                         <Trophy className="w-5 h-5" />
                         <span>START BOSS BATTLE</span>
                         <ArrowRight className="w-5 h-5" />
                      </button>
                   </div>
                </div>
             </motion.div>
          )}
       </AnimatePresence>
    </div>
  );
};
