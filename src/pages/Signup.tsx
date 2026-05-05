import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Shield, Mail, Lock, ArrowRight, Loader2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useUserStore } from '../store/userStore';

export const Signup: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const setProfile = useUserStore((state) => state.setProfile);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
      setError('Supabase is not configured. Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your project Secrets.');
      setLoading(false);
      return;
    }

    try {
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Connection timed out. Please check your Supabase Secrets.')), 8000)
      );

      const signupPromise = supabase.auth.signUp({
        email,
        password,
      });

      const { data: authData, error: authError } = await Promise.race([signupPromise, timeoutPromise]) as any;

      if (authError) {
        setError(authError.message);
        setLoading(false);
        return;
      }

      if (authData.user) {
        const dummyProfile = {
          id: authData.user.id,
          name: '',
          age: 0,
          persona: { sport: '', hobby: '', movie_theme: 'harry_potter', skill_level: 'beginner', domains: [] },
          theme: 'harry_potter',
          house_or_role: '',
          created_at: new Date().toISOString(),
        };
        setProfile(dummyProfile as any);
        navigate('/onboarding');
      }
    } catch (err: any) {
      if (err.message === 'Failed to fetch') {
        setError('Connection failed. Please check your internet or your Supabase URL in project Secrets.');
      } else {
        setError(err.message || 'An unexpected error occurred during signup');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-gradient-to-tr from-[var(--color-primary)]/10 via-transparent to-[var(--color-accent)]/5 -z-10" />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-[var(--color-card)] rounded-3xl border border-white/5 p-8 shadow-2xl"
      >
        <div className="text-center mb-8">
          <div className="inline-flex p-3 rounded-2xl bg-[var(--color-primary)]/10 mb-4">
            <Shield className="w-8 h-8 text-[var(--color-primary)]" />
          </div>
          <h1 className="text-3xl font-black mb-2">Create Your Avatar</h1>
          <p className="text-sm opacity-50">Join the elite squad of future masters.</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-500 text-sm rounded-xl">
            {error}
          </div>
        )}

        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <label className="text-[10px] uppercase font-black tracking-widest opacity-40 ml-2 mb-1 block">Email Comms</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 opacity-30" />
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 pl-12 pr-4 focus:border-[var(--color-primary)]/50 focus:ring-0 transition-colors"
                placeholder="commander@starfleet.com"
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] uppercase font-black tracking-widest opacity-40 ml-2 mb-1 block">Encryption Key</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 opacity-30" />
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 pl-12 pr-4 focus:border-[var(--color-primary)]/50 focus:ring-0 transition-colors"
                placeholder="********"
              />
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={loading}
            className="w-full py-4 bg-[var(--color-primary)] text-white font-black rounded-2xl shadow-lg flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
              <>
                <span>COMMENCE ONBOARDING</span>
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </motion.button>
        </form>

        <div className="mt-8 text-center space-y-4">
          <p className="text-sm opacity-50">
            Already have an active mission? <Link to="/login" className="text-[var(--color-primary)] font-bold">Sign In</Link>
          </p>

          <div className="pt-4 border-t border-white/5">
            <button 
              onClick={() => {
                setProfile({
                  id: 'demo-user',
                  name: 'Explorer One',
                  age: 24,
                  persona: { sport: 'Soccer', hobby: 'Guitar', movie_theme: 'harry_potter', skill_level: 'intermediate', domains: ['studies'] },
                  theme: 'interstellar',
                  house_or_role: 'STRATEGIST',
                  created_at: new Date().toISOString(),
                } as any);
                navigate('/dashboard');
              }}
              className="text-[10px] uppercase font-black tracking-widest text-slate-400 hover:text-[var(--color-primary)] transition-colors"
            >
              Skip to Demo Mode (No Database)
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
