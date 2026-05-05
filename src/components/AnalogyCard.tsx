import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, HelpCircle, RefreshCcw } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface AnalogyCardProps {
  data: {
    analogy: string;
    explanation: string;
    example: string;
    fun_fact: string;
  };
  onRegenerate: () => void;
}

export const AnalogyCard: React.FC<AnalogyCardProps> = ({ data, onRegenerate }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-2xl mx-auto space-y-6"
    >
      <div className="bg-[var(--color-card)] rounded-3xl overflow-hidden border border-[var(--color-primary)]/20 shadow-2xl">
        <div className="p-8 bg-gradient-to-br from-[var(--color-primary)]/10 to-transparent">
          <div className="flex items-center space-x-3 mb-6">
            <Sparkles className="w-6 h-6 text-[var(--color-secondary)]" />
            <h2 className="text-sm font-black uppercase tracking-widest text-[var(--color-secondary)]">The Analogy (Mapped to Your World)</h2>
          </div>
          
          <div className="text-2xl font-bold leading-relaxed mb-8 italic text-white">
            "{data.analogy}"
          </div>

          <div className="space-y-6">
            <section>
              <div className="flex items-center space-x-2 mb-2 opacity-60">
                <HelpCircle className="w-4 h-4" />
                <span className="text-xs uppercase font-bold tracking-wider">The Breakdown</span>
              </div>
              <div className="text-sm opacity-80 leading-relaxed markdown-container">
                <ReactMarkdown>{data.explanation}</ReactMarkdown>
              </div>
            </section>

            <section className="p-4 bg-white/5 rounded-xl border border-white/5">
              <span className="text-[10px] uppercase font-bold opacity-40 mb-2 block">Real World Application</span>
              <p className="text-sm leading-relaxed">{data.example}</p>
            </section>

            <section className="bg-[var(--color-accent)]/10 p-4 rounded-xl border border-[var(--color-accent)]/20">
              <div className="flex items-center space-x-2 text-[var(--color-accent)] mb-1">
                <Sparkles className="w-3 h-3" />
                <span className="text-[10px] uppercase font-black">Mind Blown Fact</span>
              </div>
              <p className="text-xs italic opacity-80">{data.fun_fact}</p>
            </section>
          </div>
        </div>

        <div className="bg-black/40 p-4 flex justify-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onRegenerate}
            className="flex items-center space-x-2 text-xs font-black uppercase tracking-widest opacity-60 hover:opacity-100 transition-opacity"
          >
            <RefreshCcw className="w-4 h-4" />
            <span>Try Another Perspective</span>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};
