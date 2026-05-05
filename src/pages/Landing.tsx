import React from 'react';
import { motion } from 'motion/react';
import { Shield, Sparkles, Trophy, Zap, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Landing: React.FC = () => {
  return (
    <div className="relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-[var(--color-primary)]/10 rounded-full blur-[120px] -z-10" />
      
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 pt-32 pb-20 text-center">
        <motion.div
           initial={{ opacity: 0, y: 30 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center space-x-2 bg-white/5 border border-white/10 px-4 py-2 rounded-full mb-8">
             <Sparkles className="w-4 h-4 text-[var(--color-secondary)]" />
             <span className="text-xs font-bold uppercase tracking-widest text-[var(--color-secondary)]">The Future of Personalized Learning</span>
          </div>
          
          <h1 className="text-6xl md:text-8xl font-black mb-6 tracking-tighter leading-none">
            EVERY LESSON IS A <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)]">GRAND QUEST.</span>
          </h1>
          
          <p className="text-xl opacity-60 max-w-2xl mx-auto mb-10 leading-relaxed">
            QuestIQ turns boring studies into high-stakes adventures. Master Math, Sports, and Fitness using AI that speaks your language.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
            <Link to="/signup">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-10 py-5 bg-[var(--color-primary)] text-white font-black rounded-2xl shadow-[0_0_30px_rgba(var(--color-primary),0.3)] text-lg"
              >
                JOIN THE SQUAD
              </motion.button>
            </Link>
            <Link to="/login">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-10 py-5 bg-white/5 border border-white/10 text-white font-black rounded-2xl text-lg hover:bg-white/10"
              >
                LOG IN
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Features Grid */}
      <section className="max-w-7xl mx-auto px-4 py-20">
         <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Zap, title: "AI Analogy Engine", desc: "Complex concepts explained using your favorite sports, movies, or hobbies." },
              { icon: Trophy, title: "Grand Boss Battles", desc: "Test your skills against themed boss challenges and level up your persona." },
              { icon: Users, title: "Collective Raids", desc: "Join squads, share knowledge, and conquer hard topics together." }
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.2 }}
                className="p-8 bg-[var(--color-card)] rounded-3xl border border-white/5 hover:border-[var(--color-primary)]/30 transition-colors"
              >
                <div className="p-3 bg-[var(--color-primary)]/10 rounded-xl w-fit mb-6">
                  <feature.icon className="w-8 h-8 text-[var(--color-primary)]" />
                </div>
                <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
                <p className="opacity-60 leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
         </div>
      </section>

      {/* Social Proof Placeholder */}
      <section className="py-20 text-center opacity-40">
        <span className="text-[10px] uppercase font-bold tracking-[0.4em] mb-12 block">Trusted by squads globally</span>
        <div className="flex flex-wrap justify-center items-center gap-12 grayscale">
           <div className="text-2xl font-black italic">GRYFFINDOR</div>
           <div className="text-2xl font-black italic">STARK IND.</div>
           <div className="text-2xl font-black italic">ENDURANCE</div>
           <div className="text-2xl font-black italic">AVENGERS</div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/5 text-center">
         <div className="flex items-center justify-center space-x-2 mb-4">
            <Shield className="w-6 h-6 text-[var(--color-primary)]" />
            <span className="font-black text-xl tracking-tighter uppercase">QuestIQ</span>
         </div>
         <p className="text-xs opacity-40">Built with Gemini & Supabase for the future of education.</p>
      </footer>
    </div>
  );
};
