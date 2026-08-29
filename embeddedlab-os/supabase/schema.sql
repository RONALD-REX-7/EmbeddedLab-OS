-- ============================================================================
-- EmbeddedLab OS — Supabase Database Migration Schema
-- ============================================================================

-- 1. Profiles Table (Extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Trigger to auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 2. Labs Catalog Table
CREATE TABLE IF NOT EXISTS public.labs (
  id TEXT PRIMARY KEY, -- 'gpio', 'pwm', 'adc', 'uart'
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  total_challenges INTEGER DEFAULT 3 NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Populate initial labs catalog
INSERT INTO public.labs (id, title, description, total_challenges) VALUES
  ('gpio', 'General Purpose Input / Output', 'Digital pin configuration, LED driving, and push-button input.', 3),
  ('pwm', 'Pulse-Width Modulation', 'Duty cycle modulation, high-frequency carrier waves, and dimming.', 3),
  ('adc', 'Analog-to-Digital Converter', 'Potentiometer sampling, Vref scaling, resolution, and quantization.', 3),
  ('uart', 'Universal Asynchronous Receiver-Transmitter', 'Serial frame structure, baud rate compatibility, and terminals.', 3)
ON CONFLICT (id) DO NOTHING;

-- 3. Lab Progress Table (Persists aggregated user lab completion & scores)
CREATE TABLE IF NOT EXISTS public.lab_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  lab_id TEXT NOT NULL REFERENCES public.labs(id) ON DELETE CASCADE,
  completed_challenges_count INTEGER DEFAULT 0 NOT NULL,
  total_score INTEGER DEFAULT 0 NOT NULL,
  last_accessed_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE(user_id, lab_id)
);

ALTER TABLE public.lab_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own lab progress"
  ON public.lab_progress FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own lab progress"
  ON public.lab_progress FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own lab progress"
  ON public.lab_progress FOR UPDATE
  USING (auth.uid() = user_id);

-- 4. Challenge Attempts Table (Persists individual challenge validation results)
CREATE TABLE IF NOT EXISTS public.challenge_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  lab_id TEXT NOT NULL REFERENCES public.labs(id) ON DELETE CASCADE,
  challenge_id TEXT NOT NULL,
  passed BOOLEAN NOT NULL,
  score INTEGER NOT NULL,
  attempts_count INTEGER NOT NULL,
  hints_revealed INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

ALTER TABLE public.challenge_attempts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own challenge attempts"
  ON public.challenge_attempts FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own challenge attempts"
  ON public.challenge_attempts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- 5. Simulation Sessions Table (Persists high-level lab session duration and event counts)
CREATE TABLE IF NOT EXISTS public.simulation_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  lab_id TEXT NOT NULL REFERENCES public.labs(id) ON DELETE CASCADE,
  duration_seconds INTEGER DEFAULT 0 NOT NULL,
  events_count INTEGER DEFAULT 0 NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

ALTER TABLE public.simulation_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own simulation sessions"
  ON public.simulation_sessions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own simulation sessions"
  ON public.simulation_sessions FOR INSERT
  WITH CHECK (auth.uid() = user_id);
