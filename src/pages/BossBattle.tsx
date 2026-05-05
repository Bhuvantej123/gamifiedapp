import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Shield, Sparkles, Trophy, ChevronRight, Loader2, RefreshCw } from 'lucide-react';
import { getQuiz } from '../services/geminiService';
import { useUserStore } from '../store/userStore';
import { useGameStore } from '../store/gameStore';
import { BossHPBar } from '../components/BossHPBar';
import { ConfettiEffect } from '../components/ConfettiEffect';
import { supabase, SUPABASE_CONFIGURED } from '../lib/supabase';

export const BossBattle: React.FC = () => {
  const { topic } = useParams<{ topic: string }>();
  const navigate = useNavigate();
  const profile = useUserStore((state) => state.profile);
  const addXP = useGameStore((state) => state.addXP);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [hp, setHp] = useState(100);
  const [gameState, setGameState] = useState<'playing' | 'win' | 'lose'>('playing');
  const [timer, setTimer] = useState(60);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);

  const fetchQuiz = useCallback(async () => {
    if (!topic || !profile) return;
    setLoading(true);
    setError('');
    try {
      const result = await getQuiz(topic, profile.persona);
      setQuestions(result.questions);
    } catch (err: any) {
      const message = err?.message || String(err);
      console.error('[Boss Battle Error]', message);
      setError(`AI engine error: ${message}`);
    } finally {
      setLoading(false);
    }
  }, [topic, profile]);

  useEffect(() => {
    fetchQuiz();
  }, [fetchQuiz]);

  useEffect(() => {
    if (gameState === 'playing' && timer > 0 && !isAnswered) {
      const t = setInterval(() => setTimer(v => v - 1), 1000);
      return () => clearInterval(t);
    } else if (timer === 0 && !isAnswered) {
      handleAnswer(''); // Timeout
    }
  }, [timer, gameState, isAnswered]);

  const handleAnswer = async (option: string) => {
    if (isAnswered) return;
    setSelectedOption(option);
    setIsAnswered(true);

    const isCorrect = option === questions[currentIdx].answer;
    
    if (isCorrect) {
      setHp(v => Math.max(0, v - (100 / questions.length)));
      addXP(20);
    } else {
      // User takes "damage" (just logic for win/lose)
    }

    setTimeout(async () => {
      if (currentIdx < questions.length - 1) {
        setCurrentIdx(v => v + 1);
        setTimer(60);
        setSelectedOption(null);
        setIsAnswered(false);
      } else {
        const finalHp = isCorrect ? Math.max(0, hp - (100 / questions.length)) : hp;
        if (finalHp <= 0) {
          setGameState('win');
          addXP(100);
          if (profile && topic && SUPABASE_CONFIGURED && profile.id !== 'demo-user') {
            await supabase.from('quest_progress').upsert({
              user_id: profile.id,
              topic,
              status: 'completed',
              xp_earned: 150,
              last_attempted_at: new Date().toISOString()
            });
          }
        } else {
          setGameState('lose');
        }
      }
    }, 2000);
  };

  if (loading) {
     return (
        <div className="min-h-screen flex flex-col items-center justify-center p-12">
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity }}>
               <Shield className="w-16 h-16 text-red-500 opacity-20" />
            </motion.div>
            <h2 className="mt-8 text-2xl font-black italic animate-pulse">PREPARING BOSS ARENA...</h2>
        </div>
     );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-12">
        <div className="text-center p-12 bg-red-500/10 border border-red-500/20 rounded-3xl max-w-2xl">
          <Shield className="w-12 h-12 text-red-500 mx-auto mb-4 opacity-60" />
          <h2 className="text-xl font-black mb-4 text-red-400">Boss Arena Unavailable</h2>
          <p className="text-red-400 font-bold mb-2 text-sm">{error}</p>
          <div className="flex gap-4 justify-center mt-6">
            <button onClick={fetchQuiz} className="text-xs font-black uppercase text-red-500 underline underline-offset-4">Try Again</button>
            <button onClick={() => navigate('/quests')} className="text-xs font-black uppercase opacity-50 underline underline-offset-4">Back to Quests</button>
          </div>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentIdx];

  return (
    <div className="max-w-4xl mx-auto px-4 pt-10 pb-32 min-h-screen flex flex-col items-center">
       <ConfettiEffect active={gameState === 'win'} />
       
       <BossHPBar currentHP={Math.ceil(hp)} maxHP={100} bossName={`${topic} Master`} />

       <AnimatePresence mode="wait">
          {gameState === 'playing' ? (
             <motion.div
               key="battle"
               initial={{ opacity: 0, scale: 0.95 }}
               animate={{ opacity: 1, scale: 1 }}
               exit={{ opacity: 0, scale: 1.05 }}
               className="w-full space-y-8"
             >
                <div className="bg-[var(--color-card)] rounded-3xl p-8 border border-white/10 shadow-2xl relative">
                   <div className="absolute top-4 right-8 flex items-center space-x-2">
                       <span className="text-[10px] uppercase font-bold opacity-40">Time Pulse</span>
                       <span className={`font-mono font-bold ${timer < 10 ? 'text-red-500 animate-ping' : 'text-[var(--color-primary)]'}`}>
                          {timer}s
                       </span>
                   </div>
                   
                   <span className="text-[10px] uppercase font-black tracking-widest text-[var(--color-primary)] mb-4 block">
                      Attack {currentIdx + 1} of {questions.length}
                   </span>
                   <h2 className="text-2xl font-bold mb-8 leading-tight">{currentQ.question}</h2>

                   <div className="grid grid-cols-1 gap-4">
                      {currentQ.options.map((opt: string) => {
                         const isCorrect = opt === currentQ.answer;
                         const isSelected = opt === selectedOption;
                         
                         return (
                            <button
                               key={opt}
                               disabled={isAnswered}
                               onClick={() => handleAnswer(opt)}
                               className={`p-6 rounded-2xl border-2 text-left transition-all relative overflow-hidden group ${
                                 isAnswered
                                   ? isCorrect 
                                     ? 'border-green-500 bg-green-500/10'
                                     : isSelected 
                                       ? 'border-red-500 bg-red-500/10' 
                                       : 'border-white/5 opacity-50'
                                   : 'border-white/10 hover:border-[var(--color-primary)] hover:bg-white/5'
                               }`}
                            >
                               <span className="font-bold">{opt}</span>
                               {isAnswered && isCorrect && (
                                  <motion.div 
                                    initial={{ opacity: 0 }} 
                                    animate={{ opacity: 1 }}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-green-500 font-black text-[10px]"
                                  >
                                    CRITICAL HIT
                                  </motion.div>
                               )}
                            </button>
                         );
                      })}
                   </div>
                </div>
             </motion.div>
          ) : gameState === 'win' ? (
             <motion.div
               key="win"
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               className="text-center space-y-8 py-20"
             >
                <div className="inline-block p-8 rounded-full bg-green-500/10 mb-8 border-4 border-green-500 animate-bounce">
                   <Trophy className="w-24 h-24 text-green-500" />
                </div>
                <h1 className="text-6xl font-black italic tracking-tighter">THE BOSS HAS FALLEN!</h1>
                <p className="text-xl opacity-60 max-w-md mx-auto">
                   You've mastered {topic}. Your persona has evolved and your legend grows across the sectors.
                </p>
                <div className="p-6 bg-white/5 rounded-2xl border border-white/10 inline-block">
                    <span className="text-xs uppercase font-bold opacity-40 block mb-2">Rewards Earned</span>
                    <div className="flex items-center space-x-4">
                       <div className="text-2xl font-black text-[var(--color-secondary)]">+100 {profile.theme === 'harry_potter' ? 'House Pts' : 'XP'}</div>
                       <div className="w-px h-8 bg-white/10" />
                       <div className="text-sm font-bold text-green-500">QUEST COMPLETE</div>
                    </div>
                </div>
                <div>
                   <button 
                     onClick={() => navigate('/dashboard')}
                     className="bg-[var(--color-primary)] text-white px-12 py-5 rounded-2xl font-black tracking-widest shadow-[0_0_40px_rgba(var(--color-primary),0.3)] hover:scale-105 transition-transform"
                   >
                      RETURN TO BASE
                   </button>
                </div>
             </motion.div>
          ) : (
             <motion.div
               key="lose"
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               className="text-center space-y-8 py-20"
             >
                <div className="inline-block p-8 rounded-full bg-red-500/10 mb-8 border-4 border-red-500">
                   <Shield className="w-24 h-24 text-red-500" />
                </div>
                <h1 className="text-6xl font-black italic tracking-tighter">QUEST FAILED... FOR NOW.</h1>
                <p className="text-xl opacity-60 max-w-md mx-auto">
                   The Anomaly was too strong. You must return to Learn mode and find a new analogy.
                </p>
                <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
                   <button 
                     onClick={() => navigate(`/learn/${encodeURIComponent(topic || '')}`)}
                     className="bg-white text-black px-8 py-4 rounded-xl font-black uppercase tracking-widest flex items-center justify-center"
                   >
                      <RefreshCw className="w-4 h-4 mr-2" /> RE-LEARN CONCEPT
                   </button>
                   <button 
                     onClick={() => navigate('/dashboard')}
                     className="bg-white/5 border border-white/10 text-white px-8 py-4 rounded-xl font-black uppercase tracking-widest"
                   >
                      RETREAT
                   </button>
                </div>
             </motion.div>
          )}
       </AnimatePresence>
    </div>
  );
};
