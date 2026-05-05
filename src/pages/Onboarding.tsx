import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, ChevronLeft, Sparkles, Wand2, Sword, Rocket } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '../store/userStore';
import { supabase, SUPABASE_CONFIGURED } from '../lib/supabase';
import { themes } from '../utils/themeConfig';

export const Onboarding: React.FC = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    sport: '',
    hobby: '',
    movie_theme: 'harry_potter',
    skill_level: 'beginner',
    domains: [] as string[],
  });
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const { profile, setProfile } = useUserStore();

  const handleNext = () => setStep(s => s + 1);
  const handlePrev = () => setStep(s => s - 1);

  const handleSubmit = async () => {
    setLoading(true);
    if (!profile) return;

    const persona = {
      sport: formData.sport,
      hobby: formData.hobby,
      movie_theme: formData.movie_theme,
      skill_level: formData.skill_level,
      domains: formData.domains,
    };

    const house_or_role = 
      formData.movie_theme === 'harry_potter' ? 'Gryffindor' :
      formData.movie_theme === 'avengers' ? 'Tactical Lead' : 'Pilot';

    if (SUPABASE_CONFIGURED && profile.id !== 'demo-user') {
      const { error } = await supabase.from('profiles').upsert({
        id: profile.id,
        name: formData.name,
        age: parseInt(formData.age),
        persona,
        theme: formData.movie_theme,
        house_or_role,
      });

      if (error) {
        console.error(error);
        setLoading(false);
        return;
      }

      // Initialize game stats
      await supabase.from('game_stats').upsert({
        user_id: profile.id,
        total_xp: 0,
        current_level: 1,
        streak_count: 1,
      });
    }

    setProfile({
      ...profile,
      name: formData.name,
      age: parseInt(formData.age),
      persona: persona as any,
      theme: formData.movie_theme as any,
      house_or_role,
    });

    navigate('/dashboard');
  };

  const steps = [
    { title: "The Basics", desc: "How shall the history books address you?" },
    { title: "Your World", desc: "What fuels your fire outside the classroom?" },
    { title: "The Aesthetic", desc: "Choose your universal interface theme." },
    { title: "Your Path", desc: "Which domains shall we conquer first?" },
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-black">
      <div className="w-full max-w-xl">
        <div className="flex justify-between items-center mb-12">
            {steps.map((s, i) => (
                <div key={i} className={`h-1 flex-1 mx-1 rounded-full ${step > i ? 'bg-[var(--color-primary)]' : 'bg-white/10'}`} />
            ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-8"
          >
            <div>
              <span className="text-[10px] uppercase font-black tracking-[0.4em] text-[var(--color-primary)]">Step {step} of 4</span>
              <h1 className="text-4xl font-black mb-2">{steps[step-1].title}</h1>
              <p className="opacity-50">{steps[step-1].desc}</p>
            </div>

            {step === 1 && (
              <div className="space-y-6">
                <div>
                  <label className="text-xs font-bold uppercase mb-2 block opacity-40">Alias / Name</label>
                  <input 
                    type="text" 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="e.g. Ender Wiggin"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 text-xl focus:border-[var(--color-primary)] outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase mb-2 block opacity-40">Solar Cycles (Age)</label>
                  <input 
                    type="number" 
                    value={formData.age}
                    onChange={(e) => setFormData({...formData, age: e.target.value})}
                    placeholder="16"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 text-xl focus:border-[var(--color-primary)] outline-none"
                  />
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <div>
                  <label className="text-xs font-bold uppercase mb-2 block opacity-40">Favorite Sport</label>
                  <input 
                    type="text" 
                    value={formData.sport}
                    onChange={(e) => setFormData({...formData, sport: e.target.value})}
                    placeholder="Cricket, Football, Swimming..."
                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 text-xl focus:border-[var(--color-primary)] outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase mb-2 block opacity-40">Main Hobby</label>
                  <input 
                    type="text" 
                    value={formData.hobby}
                    onChange={(e) => setFormData({...formData, hobby: e.target.value})}
                    placeholder="Gaming, Music, Coding..."
                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 text-xl focus:border-[var(--color-primary)] outline-none"
                  />
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="grid grid-cols-1 gap-4">
                {[
                    { id: 'harry_potter', icon: Wand2, name: 'Wizarding World', color: themes.harry_potter.palette.primary },
                    { id: 'avengers', icon: Sword, name: 'Avengers Initiative', color: themes.avengers.palette.primary },
                    { id: 'interstellar', icon: Rocket, name: 'Endurance Mission', color: themes.interstellar.palette.primary },
                ].map((t) => (
                    <motion.button
                      key={t.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setFormData({...formData, movie_theme: t.id as any})}
                      className={`flex items-center space-x-6 p-6 rounded-2xl border-2 transition-all ${
                        formData.movie_theme === t.id ? 'border-[var(--color-primary)] bg-white/5' : 'border-white/10 opacity-50'
                      }`}
                    >
                        <div className="p-4 rounded-xl" style={{ backgroundColor: `${t.color}20`, color: t.color }}>
                            <t.icon />
                        </div>
                        <span className="text-xl font-bold">{t.name}</span>
                    </motion.button>
                ))}
              </div>
            )}

            {step === 4 && (
              <div className="space-y-6">
                 <div className="grid grid-cols-2 gap-4">
                    {['Studies', 'Sports', 'Fitness', 'Logic'].map((d) => (
                        <button
                          key={d}
                          onClick={() => {
                            const newDomains = formData.domains.includes(d) 
                                ? formData.domains.filter(x => x !== d)
                                : [...formData.domains, d];
                            setFormData({...formData, domains: newDomains});
                          }}
                          className={`p-6 rounded-2xl border-2 font-bold ${
                            formData.domains.includes(d) ? 'border-[var(--color-primary)] bg-white/5' : 'border-white/10 opacity-50'
                          }`}
                        >
                            {d}
                        </button>
                    ))}
                 </div>
                 <div>
                    <label className="text-xs font-bold uppercase mb-4 block opacity-40">Current Proficiency</label>
                    <div className="flex space-x-4">
                        {['Beginner', 'Intermediate', 'Advanced'].map((l) => (
                            <button
                                key={l}
                                onClick={() => setFormData({...formData, skill_level: l.toLowerCase() as any})}
                                className={`flex-1 p-4 rounded-xl border font-bold text-xs uppercase tracking-widest ${
                                    formData.skill_level === l.toLowerCase() ? 'border-[var(--color-primary)] text-[var(--color-primary)] bg-[var(--color-primary)]/5' : 'border-white/10 opacity-50'
                                }`}
                            >
                                {l}
                            </button>
                        ))}
                    </div>
                 </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        <div className="mt-12 flex justify-between items-center">
            {step > 1 ? (
                <button onClick={handlePrev} className="flex items-center space-x-2 text-xs font-bold uppercase opacity-50 hover:opacity-100 transition-opacity">
                    <ChevronLeft className="w-4 h-4" />
                    <span>Previous Phase</span>
                </button>
            ) : <div />}

            {step < 4 ? (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleNext}
                  className="bg-white text-black px-8 py-3 rounded-full font-black text-sm uppercase flex items-center space-x-2"
                >
                    <span>Next Phase</span>
                    <ChevronRight className="w-4 h-4" />
                </motion.button>
            ) : (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSubmit}
                  disabled={loading}
                  className="bg-[var(--color-primary)] text-white px-8 py-3 rounded-full font-black text-sm uppercase flex items-center space-x-2 shadow-[0_0_20px_rgba(var(--color-primary),0.3)] disabled:opacity-50"
                >
                    {loading ? "INITIALIZING..." : "INITIALIZE MISSION"}
                    <ChevronRight className="w-4 h-4" />
                </motion.button>
            )}
        </div>
      </div>
    </div>
  );
};
