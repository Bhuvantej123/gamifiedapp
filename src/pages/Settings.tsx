import React from 'react';
import { motion } from 'motion/react';
import { Settings as SettingsIcon, Bell, Shield, Palette, LogOut, ChevronRight } from 'lucide-react';
import { useUserStore } from '../store/userStore';
import { themes } from '../utils/themeConfig';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';

export const Settings: React.FC = () => {
  const { profile, updateTheme, setProfile } = useUserStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setProfile(null);
    navigate('/');
  };

  const sections = [
    {
      title: 'Visual Matrix',
      icon: Palette,
      items: [
        { label: 'Wizarding World', action: () => updateTheme('harry_potter'), current: profile?.theme === 'harry_potter' },
        { label: 'Avengers Initiative', action: () => updateTheme('avengers'), current: profile?.theme === 'avengers' },
        { label: 'Endurance Mission', action: () => updateTheme('interstellar'), current: profile?.theme === 'interstellar' },
      ]
    },
    {
      title: 'Communications',
      icon: Bell,
      items: [
        { label: 'Raid Alerts', action: () => {}, toggle: true, current: true },
        { label: 'Daily Streak Reminder', action: () => {}, toggle: true, current: true },
      ]
    },
    {
      title: 'Encryption & Safety',
      icon: Shield,
      items: [
        { label: 'Change Password', action: () => {}, current: false },
        { label: 'Privacy Protocol', action: () => {}, current: false },
      ]
    }
  ];

  return (
    <div className="max-w-2xl mx-auto px-4 pt-10 pb-32 space-y-12">
       <header>
          <span className="text-[10px] uppercase font-black tracking-[0.4em] text-[var(--color-primary)]">Control Center</span>
          <h1 className="text-5xl font-black mt-2 tracking-tighter">Settings</h1>
       </header>

       <div className="space-y-12">
          {sections.map((section) => (
             <section key={section.title}>
                <div className="flex items-center space-x-2 opacity-40 mb-6">
                   <section.icon className="w-4 h-4" />
                   <h3 className="text-xs font-black uppercase tracking-widest">{section.title}</h3>
                </div>

                <div className="bg-[var(--color-card)] rounded-2xl border border-white/5 overflow-hidden">
                   {section.items.map((item, i) => (
                      <button
                        key={item.label}
                        onClick={item.action}
                        className={`w-full flex items-center justify-between p-6 text-left border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors ${
                          item.current && !item.toggle ? 'bg-[var(--color-primary)]/10' : ''
                        }`}
                      >
                         <span className={`font-bold ${item.current && !item.toggle ? 'text-[var(--color-secondary)]' : ''}`}>
                           {item.label}
                         </span>
                         {item.toggle ? (
                            <div className={`w-10 h-5 rounded-full p-1 transition-colors ${item.current ? 'bg-green-500' : 'bg-white/10'}`}>
                               <div className={`w-3 h-3 rounded-full bg-white transition-transform ${item.current ? 'translate-x-5' : ''}`} />
                            </div>
                         ) : (
                            <ChevronRight className="w-4 h-4 opacity-40" />
                         )}
                      </button>
                   ))}
                </div>
             </section>
          ))}

          <section>
             <button 
               onClick={handleLogout}
               className="w-full flex items-center justify-center space-x-2 p-6 bg-red-500/10 text-red-500 border border-red-500/20 rounded-2xl font-black uppercase tracking-widest hover:bg-red-500/20 transition-all"
             >
                <LogOut className="w-5 h-5" />
                <span>Terminate Session</span>
             </button>
          </section>
       </div>
    </div>
  );
};
