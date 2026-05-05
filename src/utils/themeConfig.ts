export const themes = {
  harry_potter: {
    id: 'harry_potter',
    name: 'Wizarding World',
    palette: {
      primary: '#740001', // Gryffindor Red
      secondary: '#D3A625', // Gryffindor Gold
      accent: '#222f5b', // Ravenclaw Blue
      bg: '#1a1a1a',
      card: '#2a2a2a',
      text: '#e0e0e0',
    },
    labels: {
      quest: 'Spell Quest',
      level: 'Year',
      xp: 'House Points',
      squad: 'House',
      boss: 'Dark Wizard',
    },
    font: 'serif',
  },
  avengers: {
    id: 'avengers',
    name: 'Avengers Initiative',
    palette: {
      primary: '#e62429', // Marvel Red
      secondary: '#000000',
      accent: '#fef200', // Yellow/Gold
      bg: '#050a14', // Deep Navy
      card: '#0f172a',
      text: '#ffffff',
    },
    labels: {
      quest: 'Mission',
      level: 'Clearance',
      xp: 'Energy',
      squad: 'Team',
      boss: 'Villain',
    },
    font: 'sans',
  },
  interstellar: {
    id: 'interstellar',
    name: 'Interstellar Explorer',
    palette: {
      primary: '#00D1FF', // Interstellar Blue
      secondary: '#7000FF', // Interstellar Purple
      accent: '#f97316', // Orange Flame
      bg: '#05070A', // Deep Black/Blue
      card: '#0F172A', // Slate 900
      text: '#FFFFFF',
    },
    labels: {
      quest: 'Exploration',
      level: 'Voyager',
      xp: 'Fuel',
      squad: 'Crew',
      boss: 'Anomaly',
    },
    font: 'sans',
  },
};

export type ThemeType = keyof typeof themes;
