import React from 'react';
import { useUserStore } from '../store/userStore';
import { themes } from '../utils/themeConfig';

export const ThemeWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const profile = useUserStore((state) => state.profile);
  const themeKey = profile?.theme || 'harry_potter';
  const theme = themes[themeKey];

  const themeStyles = {
    '--color-primary': theme.palette.primary,
    '--color-secondary': theme.palette.secondary,
    '--color-accent': theme.palette.accent,
    '--color-bg': theme.palette.bg,
    '--color-card': theme.palette.card,
    '--color-text': theme.palette.text,
    fontFamily: theme.font === 'serif' ? 'Georgia, serif' : 
                theme.font === 'mono' ? '"JetBrains Mono", monospace' : 
                'Inter, sans-serif'
  } as React.CSSProperties;

  return (
    <div style={themeStyles} className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)] transition-colors duration-500">
      {children}
    </div>
  );
};
