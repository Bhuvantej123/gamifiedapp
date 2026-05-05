
export type ThemeType = 'harry_potter' | 'avengers' | 'interstellar';

export interface Persona {
  sport: string;
  hobby: string;
  movie_theme: 'harry_potter' | 'avengers' | 'interstellar';
  skill_level: 'beginner' | 'intermediate' | 'advanced';
  domains: string[];
}

export interface Profile {
  id: string;
  name: string;
  age: number;
  persona: Persona;
  theme: 'harry_potter' | 'avengers' | 'interstellar';
  house_or_role: string;
  gender?: 'male' | 'female';
  selectedMap?: 'coding' | 'sports' | 'fitness' | 'business';
  created_at: string;
}

export interface GameStats {
  user_id: string;
  total_xp: number;
  current_level: number;
  streak_count: number;
  total_wins: number;
  last_active_date: string;
  streak_freeze_count: number;
}

export interface QuestProgress {
  id: string;
  user_id: string;
  domain: 'studies' | 'sports' | 'fitness' | 'coding';
  topic: string;
  status: 'locked' | 'active' | 'completed';
  xp_earned: number;
  attempts: number;
  wrong_attempts: number;
  last_attempted_at: string;
  next_review_at: string;
}

export interface SquadMember {
  user_id: string;
  role: 'Strategist' | 'Explainer' | 'Challenger' | 'Scout' | 'Leader';
}

export interface Squad {
  id: string;
  name: string;
  created_by: string;
  members: SquadMember[];
  current_raid_topic: string | null;
  raid_status: 'none' | 'active' | 'completed';
  raid_progress: number;
}
