import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { Shield, Skull, Loader2, Heart, LogOut } from 'lucide-react';
import { useUserStore } from '../store/userStore';
import { useGameStore } from '../store/gameStore';
import { getQuiz } from '../services/geminiService';

interface Question {
  question: string;
  options: string[];
  answer: string;
  explanation: string;
}

interface UserAnswer {
  question: string;
  selected: string;
  correct: string;
  explanation: string;
  isCorrect: boolean;
}

type AnimState = 'idle' | 'attacking' | 'hurt' | 'dead';

export const Arena: React.FC = () => {
  const { topic } = useParams<{ topic: string }>();
  const [searchParams] = useSearchParams();
  const difficulty = searchParams.get('difficulty') || 'medium';
  const navigate = useNavigate();
  const { profile, addGameRecord } = useUserStore();
  const { addXP, recordWin } = useGameStore();

  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [playerHP, setPlayerHP] = useState(100);
  const [bossHP, setBossHP] = useState(100);

  const [playerAnim, setPlayerAnim] = useState<AnimState>('idle');
  const [bossAnim, setBossAnim] = useState<AnimState>('idle');

  const [battleLog, setBattleLog] = useState<string>('Prepare for combat...');
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswering, setIsAnswering] = useState(false);
  const [gameOver, setGameOver] = useState<'victory' | 'defeat' | null>(null);
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
  const [showReview, setShowReview] = useState(false);
  const [battleResolved, setBattleResolved] = useState(false);

  const gender = profile?.gender || 'male';
  const playerImage = gender === 'male' ? '/char_male.png' : '/char_female.png';
  const bossImage = '/boss_enemy.png';
  
  const mapBackgrounds: Record<string, string> = {
    coding: '/map_coding.png',
    sports: '/map_sports.png',
    fitness: '/map_fitness.png',
    business: '/map_business.png',
  };
  const selectedMap = profile?.selectedMap || 'coding';

  useEffect(() => {
    async function loadBattle() {
      if (!topic || !profile) return;
      try {
        setLoading(true);
        // Map domain adds flavor to the persona
        const data = await getQuiz(topic, difficulty);
        if (data.questions && data.questions.length > 0) {
          setQuestions(data.questions);
        } else {
          setError('Failed to generate combat scenarios.');
        }
      } catch (err: any) {
        setError(err.message || 'Error communicating with command.');
      } finally {
        setLoading(false);
      }
    }
    loadBattle();
  }, [topic, profile, selectedMap]);

  const handleAnswer = async (option: string) => {
    if (isAnswering || gameOver) return;
    setIsAnswering(true);
    setSelectedOption(option);

    const isCorrect = option === questions[currentIdx].answer;
    
    // Combat Sequence
    if (isCorrect) {
      setBattleLog('Direct Hit! Enemy took damage.');
      setPlayerAnim('attacking');
      setBossAnim('hurt');
      setTimeout(() => setBossHP((prev) => Math.max(0, prev - 20)), 500); // 5 questions = 20 dmg each
    } else {
      setBattleLog(`Miss! The correct answer was: ${questions[currentIdx].answer}`);
      setBossAnim('attacking');
      setPlayerAnim('hurt');
      setTimeout(() => setPlayerHP((prev) => Math.max(0, prev - 20)), 500);
    }

    // Record Answer
    setUserAnswers((prev) => [
      ...prev,
      {
        question: questions[currentIdx].question,
        selected: option,
        correct: questions[currentIdx].answer,
        explanation: questions[currentIdx].explanation,
        isCorrect,
      },
    ]);

    // Reset animations and progress question
    setTimeout(() => {
      setPlayerAnim('idle');
      setBossAnim('idle');
      setSelectedOption(null);
      setIsAnswering(false);

      if (bossHP > 0 && playerHP > 0 && currentIdx < questions.length - 1) {
        setCurrentIdx((prev) => prev + 1);
        setBattleLog('Next wave approaching...');
      }
    }, 2000);
  };

  // BATTLE RESOLUTION LOGIC
  useEffect(() => {
    if (loading || !questions.length || isAnswering || battleResolved || gameOver) return;

    const resolveBattle = (result: 'victory' | 'defeat') => {
      try {
        console.log(`[Battle] Resolving as ${result.toUpperCase()}`);
        setBattleResolved(true);
        
        // Add XP and record win safely
        if (result === 'victory') {
          setBossAnim('dead');
          const xpAmount = difficulty === 'hard' ? 200 : difficulty === 'medium' ? 100 : 50;
          addXP(xpAmount);
          recordWin();
        } else {
          setPlayerAnim('dead');
        }
        
        // Record game history
        addGameRecord({ topic: topic || 'Unknown', result, difficulty });
        
        // Finally show the UI
        setGameOver(result);
        setBattleLog(`Battle concluded. Status: ${result.toUpperCase()}`);
      } catch (err) {
        console.error("[Battle] Resolution Error:", err);
        // Fallback: at least show the game over screen so user isn't stuck
        setGameOver(result);
      }
    };

    if (bossHP <= 0) {
      resolveBattle('victory');
    } else if (playerHP <= 0) {
      resolveBattle('defeat');
    } else if (selectedOption === null && currentIdx === questions.length - 1 && userAnswers.length === questions.length) {
      console.log('[Battle] Last question reached. Determining winner by HP...');
      if (bossHP < playerHP) {
        resolveBattle('victory');
      } else {
        resolveBattle('defeat');
      }
    }
  }, [bossHP, playerHP, currentIdx, questions.length, isAnswering, battleResolved, gameOver, userAnswers.length, difficulty, topic, addXP, recordWin, addGameRecord]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-black">
        <Loader2 className="w-16 h-16 text-[var(--color-primary)] animate-spin mb-4" />
        <h2 className="text-2xl font-black text-white tracking-widest uppercase">Generating Battle Arena...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white text-xl p-8 text-center">
        Error: {error}. <button onClick={() => navigate('/lobby')} className="ml-4 text-[var(--color-primary)] underline">Return to Lobby</button>
      </div>
    );
  }

  const currentQ = questions[currentIdx];

  // Framer Motion Variants for Combat
  const playerVariants = {
    idle: { x: 0, rotate: 0, filter: 'brightness(1)' },
    attacking: { x: 150, rotate: 5, scale: 1.1, filter: 'brightness(1.5)', transition: { type: 'spring', stiffness: 300, damping: 10 } },
    hurt: { x: -20, rotate: -5, filter: 'brightness(0.5) sepia(1) hue-rotate(-50deg) saturate(5)', transition: { duration: 0.2, yoyo: 3 } },
    dead: { x: -50, y: 100, rotate: -90, opacity: 0.5, filter: 'grayscale(1)' },
  };

  const bossVariants = {
    idle: { x: 0, rotate: 0, filter: 'brightness(1)' },
    attacking: { x: -150, rotate: -5, scale: 1.1, filter: 'brightness(1.5)', transition: { type: 'spring', stiffness: 300, damping: 10 } },
    hurt: { x: 20, rotate: 5, filter: 'brightness(0.5) sepia(1) hue-rotate(-50deg) saturate(5)', transition: { duration: 0.2, yoyo: 3 } },
    dead: { x: 50, y: 100, rotate: 90, opacity: 0.5, filter: 'grayscale(1)' },
  };

  return (
    <div 
      className="fixed inset-0 flex bg-black bg-cover bg-center overflow-hidden font-sans"
      style={{ backgroundImage: `url(${mapBackgrounds[selectedMap]})` }}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Difficulty Badge - Top Left */}
      <div className="absolute top-6 left-6 z-50">
        {{
          easy:   <span className="px-4 py-2 rounded-full bg-green-500/20 border border-green-500 text-green-400 font-black uppercase tracking-widest text-xs">🟢 Recruit</span>,
          medium: <span className="px-4 py-2 rounded-full bg-yellow-500/20 border border-yellow-500 text-yellow-400 font-black uppercase tracking-widest text-xs">🟡 Veteran</span>,
          hard:   <span className="px-4 py-2 rounded-full bg-red-500/20 border border-red-500 text-red-400 font-black uppercase tracking-widest text-xs">🔴 Legend</span>,
        }[difficulty]}
      </div>
      <button 
        onClick={() => navigate('/lobby')}
        className="absolute bottom-6 right-6 z-50 flex items-center space-x-2 bg-red-600/80 hover:bg-red-600 backdrop-blur-md px-5 py-3 rounded-full text-white font-black tracking-widest uppercase text-sm transition-colors shadow-[0_0_20px_rgba(220,38,38,0.4)]"
      >
        <LogOut className="w-4 h-4" />
        <span>Exit Game</span>
      </button>

      {/* LEFT SIDE: QUIZ UI — narrower panel */}
      <div className="relative z-10 w-[30%] flex flex-col justify-center p-5 border-r border-white/10 bg-black/60 backdrop-blur-md">
        <div className="mb-4">
          <span className="text-[var(--color-primary)] font-black tracking-widest uppercase text-xs">
            Phase {currentIdx + 1} / {questions.length}
          </span>
          <h2 className="text-base font-black text-white mt-1 leading-snug">
            {currentQ?.question}
          </h2>
        </div>

        <div className="space-y-2">
          <AnimatePresence mode="wait">
            {currentQ?.options.map((opt, i) => {
              let btnClass = "bg-white/5 border border-white/10 hover:bg-white/10 hover:border-[var(--color-primary)] text-white";
              if (isAnswering && opt === selectedOption) {
                btnClass = opt === currentQ.answer 
                  ? "bg-green-500/20 border-green-500 text-green-400 shadow-[0_0_15px_rgba(34,197,94,0.5)]" 
                  : "bg-red-500/20 border-red-500 text-red-400 shadow-[0_0_15px_rgba(239,68,68,0.5)]";
              } else if (isAnswering && opt === currentQ.answer) {
                btnClass = "bg-green-500/20 border-green-500 text-green-400";
              }

              return (
                <motion.button
                  key={`${currentIdx}-${i}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  disabled={isAnswering}
                  onClick={() => handleAnswer(opt)}
                  className={`w-full text-left px-4 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${btnClass}`}
                >
                  <span className="opacity-50 mr-3 font-black">{['A', 'B', 'C', 'D'][i]}</span>
                  {opt}
                </motion.button>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Combat Log */}
        <div className="mt-4 p-3 bg-black/50 border border-white/10 rounded-xl">
          <p className="text-xs font-mono text-white/70">
            <span className="text-[var(--color-primary)]">&gt;</span> {battleLog}
          </p>
        </div>
      </div>

      {/* RIGHT SIDE: COMBAT ARENA — wider */}
      <div className="relative z-10 w-[70%] flex flex-col justify-between items-center py-6">
        
        {/* HP BARS */}
        <div className="w-full px-10 flex justify-between items-center space-x-8">
          {/* Player HP */}
          <div className="flex-1 flex flex-col items-start">
            <div className="flex items-center space-x-2 mb-1">
              <Shield className="w-4 h-4 text-[var(--color-primary)]" />
              <span className="text-white font-black uppercase tracking-widest text-sm">{profile?.name || 'Player'}</span>
            </div>
            <div className="w-full h-5 bg-black/50 rounded-full border border-white/20 overflow-hidden shadow-[0_0_15px_rgba(var(--color-primary),0.3)]">
              <motion.div 
                className="h-full bg-[var(--color-primary)]"
                initial={{ width: '100%' }}
                animate={{ width: `${playerHP}%` }}
                transition={{ type: 'spring' }}
              />
            </div>
          </div>

          <div className="flex-shrink-0">
            <div className="w-12 h-12 rounded-full bg-black/80 border-2 border-red-500 flex items-center justify-center shadow-[0_0_20px_rgba(239,68,68,0.5)]">
              <Skull className="w-6 h-6 text-red-500" />
            </div>
          </div>

          {/* Boss HP */}
          <div className="flex-1 flex flex-col items-end">
            <div className="flex items-center space-x-2 mb-1">
              <span className="text-red-500 font-black uppercase tracking-widest text-sm">Master of {topic}</span>
              <Heart className="w-4 h-4 text-red-500" />
            </div>
            <div className="w-full h-5 bg-black/50 rounded-full border border-white/20 overflow-hidden shadow-[0_0_15px_rgba(239,68,68,0.3)] flex justify-end">
              <motion.div 
                className="h-full bg-red-500"
                initial={{ width: '100%' }}
                animate={{ width: `${bossHP}%` }}
                transition={{ type: 'spring' }}
              />
            </div>
          </div>
        </div>

        {/* 3D CHARACTERS — take up full remaining height */}
        <div className="flex-1 w-full flex justify-between items-end px-8 pb-16 overflow-hidden pointer-events-none">
          {/* Player Sprite */}
          <motion.img 
            variants={playerVariants}
            initial="idle"
            animate={playerAnim}
            src={playerImage} 
            className="h-[78vh] object-contain drop-shadow-[0_0_30px_rgba(var(--color-primary),0.5)] z-20"
          />

          {/* Boss Sprite */}
          <motion.img 
            variants={bossVariants}
            initial="idle"
            animate={bossAnim}
            src={bossImage} 
            className="h-[85vh] object-contain drop-shadow-[0_0_30px_rgba(239,68,68,0.5)] z-10"
          />
        </div>
      </div>

      {/* GAME OVER OVERLAY */}
      <AnimatePresence>
        {gameOver && (
          <motion.div 
            key="game-over-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 z-[100] bg-black/80 backdrop-blur-lg flex flex-col items-center justify-center p-4"
          >
            {!showReview ? (
              <>
                {gameOver === 'victory' ? (
                  <div className="text-center">
                    <TrophyIcon className="w-32 h-32 text-yellow-400 mx-auto mb-8 drop-shadow-[0_0_40px_rgba(250,204,21,0.5)]" />
                    <h1 className="text-7xl font-black text-white uppercase tracking-tighter mb-4">VICTORY</h1>
                    <p className="text-xl text-[var(--color-primary)] font-bold tracking-widest">Target Eliminated. Knowledge Acquired.</p>
                  </div>
                ) : (
                  <div className="text-center">
                    <Skull className="w-32 h-32 text-red-600 mx-auto mb-8 drop-shadow-[0_0_40px_rgba(220,38,38,0.5)]" />
                    <h1 className="text-7xl font-black text-red-600 uppercase tracking-tighter mb-4">DEFEAT</h1>
                    <p className="text-xl text-white/50 font-bold tracking-widest">The enemy was too strong. Train harder.</p>
                  </div>
                )}

                <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 mt-12">
                  <button 
                    onClick={() => navigate('/lobby')}
                    className="px-12 py-4 bg-white text-black font-black uppercase tracking-widest rounded-full hover:scale-105 transition-transform"
                  >
                    Return to Base
                  </button>
                  <button 
                    onClick={() => setShowReview(true)}
                    className="px-12 py-4 bg-white/10 border border-white/20 text-white font-black uppercase tracking-widest rounded-full hover:bg-white/20 transition-all"
                  >
                    Review Battle
                  </button>
                </div>
              </>
            ) : (
              <div className="w-full max-w-4xl h-[80vh] flex flex-col bg-black/80 border border-white/10 rounded-[2rem] p-8 md:p-12 backdrop-blur-2xl">
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-3xl font-black text-white uppercase tracking-tighter">Battle Intel</h2>
                  <button 
                    onClick={() => setShowReview(false)}
                    className="text-white/50 hover:text-white font-black uppercase tracking-widest text-sm"
                  >
                    Back to Result
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto space-y-6 pr-4 custom-scrollbar">
                  {userAnswers.map((ans, i) => (
                    <div key={i} className={`p-6 rounded-2xl border ${ans.isCorrect ? 'bg-green-500/5 border-green-500/20' : 'bg-red-500/5 border-red-500/20'}`}>
                      <div className="flex items-start justify-between mb-4">
                        <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${ans.isCorrect ? 'bg-green-500 text-black' : 'bg-red-500 text-white'}`}>
                          {ans.isCorrect ? 'Direct Hit' : 'Missed'}
                        </span>
                        <span className="text-white/30 text-xs font-mono">PHASE {i + 1}</span>
                      </div>
                      
                      <h3 className="text-lg font-bold text-white mb-4">{ans.question}</h3>
                      
                      <div className="grid md:grid-cols-2 gap-4 mb-4">
                        <div className="p-3 rounded-xl bg-black/40 border border-white/5">
                          <p className="text-[10px] uppercase font-black text-white/40 mb-1">Your Strike</p>
                          <p className={`font-bold ${ans.isCorrect ? 'text-green-400' : 'text-red-400'}`}>{ans.selected}</p>
                        </div>
                        {!ans.isCorrect && (
                          <div className="p-3 rounded-xl bg-green-500/10 border border-green-500/20">
                            <p className="text-[10px] uppercase font-black text-green-500/60 mb-1">Critical Weakness</p>
                            <p className="font-bold text-green-400">{ans.correct}</p>
                          </div>
                        )}
                      </div>

                      <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                        <p className="text-[10px] uppercase font-black text-[var(--color-primary)] mb-2">Technical Breakdown</p>
                        <p className="text-sm text-white/70 leading-relaxed italic">"{ans.explanation}"</p>
                      </div>
                    </div>
                  ))}
                </div>

                <button 
                  onClick={() => navigate('/lobby')}
                  className="mt-8 w-full py-4 bg-white text-black font-black uppercase tracking-widest rounded-xl hover:scale-[1.02] transition-transform"
                >
                  Confirm & Retreat
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const TrophyIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M21 5h-4M19 3v4M9 11l3-3 3 3M12 11v6m0 0v2m0-2h4m-4 0H8" />
  </svg>
);
