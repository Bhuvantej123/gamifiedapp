import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Map, User as UserIcon, Shield, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '../store/userStore';

export const Lobby: React.FC = () => {
  const profile = useUserStore((state) => state.profile);
  const setProfile = useUserStore((state) => state.setProfile);
  const navigate = useNavigate();

  const [showMapSelector, setShowMapSelector] = useState(false);

  const [showTopicInput, setShowTopicInput] = useState(false);
  const [topicInput, setTopicInput] = useState('');
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');

  // Fallbacks if not set
  const gender = profile?.gender || 'male';
  const selectedMap = profile?.selectedMap || 'coding';

  const characterImage = gender === 'male' ? '/char_male.png' : '/char_female.png';
  
  const mapBackgrounds: Record<string, string> = {
    coding: '/map_coding.png',
    sports: '/map_sports.png',
    fitness: '/map_fitness.png',
    business: '/map_business.png',
  };

  const handleGenderToggle = () => {
    if (profile) {
      setProfile({ ...profile, gender: gender === 'male' ? 'female' : 'male' });
    }
  };

  const handleMapSelect = (map: 'coding' | 'sports' | 'fitness' | 'business') => {
    if (profile) {
      setProfile({ ...profile, selectedMap: map });
    }
    setShowMapSelector(false);
  };

  const handleStart = () => {
    setShowTopicInput(true);
  };

  const handleEnterArena = (e: React.FormEvent) => {
    e.preventDefault();
    if (topicInput.trim()) {
      navigate(`/arena/${encodeURIComponent(topicInput.trim())}?difficulty=${difficulty}`);
    }
  };

  return (
    <div 
      className="fixed inset-0 w-full h-full bg-black bg-cover bg-center transition-all duration-1000"
      style={{ backgroundImage: `url(${mapBackgrounds[selectedMap]})` }}
    >
      {/* Dark Overlay for readability */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />

      {/* Top Header */}
      <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-start z-20">
        <div className="flex items-center space-x-3 bg-black/40 px-6 py-3 rounded-full backdrop-blur-md border border-white/10">
          <Shield className="w-6 h-6 text-[var(--color-primary)]" />
          <span className="font-black text-xl tracking-widest text-white">{profile?.name?.toUpperCase() || 'PLAYER'}</span>
          <span className="bg-[var(--color-primary)] text-black text-[10px] font-black px-2 py-0.5 rounded ml-2">LVL 1</span>
        </div>

        <button 
          onClick={handleGenderToggle}
          className="flex items-center space-x-2 bg-black/40 hover:bg-white/10 px-6 py-3 rounded-full backdrop-blur-md border border-white/10 transition-colors text-white"
        >
          <UserIcon className="w-5 h-5" />
          <span className="font-black text-xs uppercase tracking-widest">
            Switch to {gender === 'male' ? 'Female' : 'Male'}
          </span>
        </button>
      </div>

      {/* Left Side: 3D Character */}
      <div className="absolute left-0 bottom-0 w-1/2 h-[90vh] flex items-end justify-center z-10 pointer-events-none">
        <AnimatePresence mode="wait">
          <motion.img
            key={gender}
            initial={{ opacity: 0, x: -50, filter: 'blur(10px)' }}
            animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, x: 50, filter: 'blur(10px)' }}
            transition={{ duration: 0.5 }}
            src={characterImage}
            alt="Character"
            className="h-full object-contain drop-shadow-[0_0_30px_rgba(var(--color-primary),0.5)]"
          />
        </AnimatePresence>
      </div>

      {/* Right Side / Bottom Right UI */}
      <div className="absolute right-12 bottom-12 flex flex-col items-end z-20 space-y-6">
        
        {/* Map Selection Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowMapSelector(true)}
          className="relative group overflow-hidden rounded-2xl bg-black/60 backdrop-blur-md border-2 border-white/20 p-4 w-64 text-left shadow-2xl"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-primary)]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="flex justify-between items-center mb-2">
            <span className="text-[10px] uppercase font-black tracking-widest text-[var(--color-primary)]">Current Region</span>
            <Map className="w-4 h-4 text-white/50" />
          </div>
          <h3 className="text-2xl font-black text-white uppercase tracking-tighter">
            {selectedMap}
          </h3>
        </motion.button>

        {/* START Button */}
        <motion.button
          whileHover={{ scale: 1.02, boxShadow: '0 0 40px rgba(var(--color-primary), 0.6)' }}
          whileTap={{ scale: 0.98 }}
          onClick={handleStart}
          className="w-64 h-24 bg-[var(--color-primary)] rounded-2xl flex items-center justify-center space-x-4 shadow-[0_0_20px_rgba(var(--color-primary),0.4)]"
        >
          <span className="text-4xl font-black text-black tracking-tighter uppercase italic">START</span>
          <Play className="w-8 h-8 text-black fill-black" />
        </motion.button>
      </div>

      {/* Map Selector Modal */}
      <AnimatePresence>
        {showMapSelector && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 bg-black/80 backdrop-blur-lg flex flex-col items-center justify-center p-6"
          >
            <h2 className="text-4xl font-black text-white uppercase tracking-widest mb-12 flex items-center">
              <Map className="w-8 h-8 mr-4 text-[var(--color-primary)]" />
              Select Drop Zone
            </h2>
            <div className="grid grid-cols-2 gap-6 w-full max-w-3xl">
              {['coding', 'sports', 'fitness', 'business'].map((map) => (
                <motion.button
                  key={map}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleMapSelect(map as any)}
                  className={`h-48 rounded-3xl bg-cover bg-center border-4 overflow-hidden relative group ${
                    selectedMap === map ? 'border-[var(--color-primary)]' : 'border-white/10'
                  }`}
                  style={{ backgroundImage: `url(${mapBackgrounds[map]})` }}
                >
                  <div className="absolute inset-0 bg-black/60 group-hover:bg-black/20 transition-colors" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <h3 className="text-3xl font-black text-white uppercase tracking-widest drop-shadow-2xl">
                      {map}
                    </h3>
                  </div>
                  {selectedMap === map && (
                    <div className="absolute top-4 right-4 bg-[var(--color-primary)] rounded-full p-2">
                      <Zap className="w-4 h-4 text-black" />
                    </div>
                  )}
                </motion.button>
              ))}
            </div>
            <button 
              onClick={() => setShowMapSelector(false)}
              className="mt-12 text-sm font-black uppercase tracking-widest text-white/50 hover:text-white transition-colors"
            >
              Cancel
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Topic Input Modal */}
      <AnimatePresence>
        {showTopicInput && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="absolute inset-0 z-50 bg-black/90 backdrop-blur-xl flex flex-col items-center justify-center p-6"
          >
            <div className="w-full max-w-2xl bg-white/5 border border-white/10 rounded-[2rem] p-12 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-tr from-[var(--color-primary)]/10 to-transparent" />
              <div className="relative z-10">
                <h2 className="text-4xl font-black text-white uppercase tracking-tighter mb-2">Target Acquired</h2>
                <p className="text-sm opacity-50 mb-6 uppercase tracking-widest font-bold">Enter your topic and select battle difficulty.</p>
                
                <form onSubmit={handleEnterArena} className="space-y-5">
                  <input
                    type="text"
                    value={topicInput}
                    onChange={(e) => setTopicInput(e.target.value)}
                    placeholder="e.g. React Hooks, Thermodynamics, Marketing..."
                    className="w-full bg-black/50 border border-[var(--color-primary)]/30 rounded-2xl p-5 text-xl font-bold text-white focus:outline-none focus:border-[var(--color-primary)] transition-colors shadow-inner"
                    autoFocus
                  />

                  {/* Difficulty Selector */}
                  <div>
                    <p className="text-xs uppercase font-black tracking-widest text-white/40 mb-3">Select Difficulty</p>
                    <div className="grid grid-cols-3 gap-3">
                      {([
                        { id: 'easy', label: 'Easy', desc: 'Recruit', color: 'border-green-500 text-green-400 shadow-[0_0_15px_rgba(34,197,94,0.3)]', bg: 'bg-green-500/20' },
                        { id: 'medium', label: 'Medium', desc: 'Veteran', color: 'border-yellow-500 text-yellow-400 shadow-[0_0_15px_rgba(234,179,8,0.3)]', bg: 'bg-yellow-500/20' },
                        { id: 'hard', label: 'Hard', desc: 'Legend', color: 'border-red-500 text-red-400 shadow-[0_0_15px_rgba(239,68,68,0.3)]', bg: 'bg-red-500/20' },
                      ] as const).map((lvl) => (
                        <button
                          key={lvl.id}
                          type="button"
                          onClick={() => setDifficulty(lvl.id)}
                          className={`py-4 rounded-2xl border-2 font-black uppercase tracking-widest transition-all ${
                            difficulty === lvl.id
                              ? `${lvl.bg} ${lvl.color}`
                              : 'bg-white/5 border-white/10 text-white/50 hover:border-white/30'
                          }`}
                        >
                          <div className="text-lg">{lvl.label}</div>
                          <div className="text-[10px] opacity-60">{lvl.desc}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex space-x-4">
                    <button 
                      type="button"
                      onClick={() => setShowTopicInput(false)}
                      className="flex-1 py-4 bg-white/5 hover:bg-white/10 text-white rounded-xl font-black uppercase tracking-widest transition-colors"
                    >
                      Abort
                    </button>
                    <button 
                      type="submit"
                      disabled={!topicInput.trim()}
                      className="flex-1 py-4 bg-[var(--color-primary)] text-black rounded-xl font-black uppercase tracking-widest disabled:opacity-50 transition-colors shadow-[0_0_20px_rgba(var(--color-primary),0.3)]"
                    >
                      ENTER ARENA
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
