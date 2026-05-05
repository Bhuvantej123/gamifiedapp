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
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState('');
  
  // Persona Confirmation State
  const [step, setStep] = useState<'persona' | 'generating' | 'ready'>('persona');
  const [tempPersona, setTempPersona] = useState({
    sport: profile?.persona?.sport || '',
    hobby: profile?.persona?.hobby || ''
  });

  const fetchAnalogy = useCallback(async (personaToUse = tempPersona, skip = false) => {
    if (!topic) return;
    setStep('generating');
    setLoading(true);
    setError('');
    try {
      const result = await getAnalogy(topic, personaToUse, skip);
      setData(result);
      setStep('ready');
    } catch (err: any) {
      const message = err?.message || String(err);
      console.error('[Analogy Engine Error]', message);
      setError(`AI engine error: ${message}`);
    } finally {
      setLoading(false);
    }
  }, [topic, tempPersona]);

  if (!topic) return null;

  if (step === 'persona') {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-black">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-lg glass-card p-10 rounded-[2.5rem] border-vibrant glow-primary"
        >
          <div className="flex items-center space-x-2 mb-6">
            <Zap className="w-5 h-5 text-[var(--color-primary)]" />
            <span className="text-[10px] uppercase font-black tracking-[0.4em] text-[var(--color-primary)]">Neural Tuning Required</span>
          </div>
          
          <h2 className="text-3xl font-black mb-2 tracking-tighter text-white">CUSTOMIZE YOUR ANALOGY</h2>
          <p className="text-white/50 text-sm mb-8">How should the AI frame the explanation of <strong>{topic}</strong> for you today?</p>
          
          <div className="space-y-6">
            <div>
              <label className="text-[10px] font-black uppercase mb-2 block text-slate-400 tracking-widest">Primary Interest / Passion</label>
              <input 
                type="text" 
                value={tempPersona.sport}
                onChange={(e) => setTempPersona({ sport: e.target.value, hobby: e.target.value })}
                placeholder="e.g. Cricket, Coding, Music..."
                className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-lg text-white focus:border-[var(--color-primary)] outline-none transition-all shadow-inner"
              />
            </div>
            
            <button 
              onClick={() => fetchAnalogy()}
              disabled={!tempPersona.sport}
              className="w-full bg-white text-black py-5 rounded-2xl font-black uppercase tracking-widest shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-30 disabled:pointer-events-none"
            >
              INITIALIZE ANALOGY ENGINE
            </button>

            <div className="flex items-center space-x-4">
              <button 
                onClick={() => fetchAnalogy(tempPersona, true)}
                className="flex-1 text-white/50 text-[10px] font-black uppercase tracking-[0.2em] py-3 border border-white/10 rounded-xl hover:bg-white/5 hover:text-white transition-all"
              >
                Skip Analogy (Direct Mode)
              </button>
              
              <button 
                onClick={() => navigate('/quests')}
                className="flex-1 text-white/30 text-[10px] font-black uppercase tracking-[0.2em] py-3 hover:text-red-400 transition-all"
              >
                Abort Mission
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

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
                <LoadingAI message={`Analyzing ${topic} through the lens of ${tempPersona.sport}...`} />
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
