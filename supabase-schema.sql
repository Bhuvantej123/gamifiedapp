
-- Table: profiles
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users NOT NULL PRIMARY KEY,
  name TEXT,
  age INTEGER,
  persona JSONB,
  theme TEXT DEFAULT 'harry_potter',
  house_or_role TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table: game_stats
CREATE TABLE public.game_stats (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  total_xp INTEGER DEFAULT 0,
  current_level INTEGER DEFAULT 1,
  streak_count INTEGER DEFAULT 0,
  last_active_date DATE DEFAULT CURRENT_DATE,
  streak_freeze_count INTEGER DEFAULT 0,
  UNIQUE(user_id)
);

-- Table: quest_progress
CREATE TABLE public.quest_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  domain TEXT NOT NULL, -- studies | sports | fitness
  topic TEXT NOT NULL,
  status TEXT DEFAULT 'locked', -- locked | active | completed
  xp_earned INTEGER DEFAULT 0,
  attempts INTEGER DEFAULT 0,
  wrong_attempts INTEGER DEFAULT 0,
  last_attempted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  next_review_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(user_id, topic)
);

-- Table: squads
CREATE TABLE public.squads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  created_by UUID REFERENCES public.profiles(id) NOT NULL,
  members JSONB DEFAULT '[]'::jsonb, -- [{ user_id, role }]
  current_raid_topic TEXT,
  raid_status TEXT DEFAULT 'none', -- none | active | completed
  raid_progress INTEGER DEFAULT 0
);

-- Table: leaderboard (View or Materialized View recommended, but using table for simplicity)
CREATE TABLE public.leaderboard (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  total_xp INTEGER DEFAULT 0,
  rank INTEGER,
  week_number INTEGER,
  domain TEXT DEFAULT 'global'
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.game_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quest_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.squads ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Game stats viewable by user" ON public.game_stats FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Game stats update by user" ON public.game_stats FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Game stats insert by user" ON public.game_stats FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Quest progress viewable by user" ON public.quest_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Quest progress update by user" ON public.quest_progress FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Quest progress insert by user" ON public.quest_progress FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Squads viewable by everyone" ON public.squads FOR SELECT USING (true);
CREATE POLICY "Squads update by members" ON public.squads FOR UPDATE USING (true); -- Simplified
