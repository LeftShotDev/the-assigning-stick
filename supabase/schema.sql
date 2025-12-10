-- Create tables for The Assigning Stick

-- Players table
CREATE TABLE IF NOT EXISTS players (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  grade INTEGER NOT NULL CHECK (grade IN (6, 7, 8)),
  is_returning BOOLEAN DEFAULT FALSE,
  participated_fall_ball BOOLEAN DEFAULT FALSE,
  previous_jersey_number INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Jersey inventory table
CREATE TABLE IF NOT EXISTS jersey_inventory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  number INTEGER UNIQUE NOT NULL CHECK (number >= 0 AND number <= 99),
  sizes TEXT[] NOT NULL DEFAULT '{}',
  is_available BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Player submissions table
CREATE TABLE IF NOT EXISTS player_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
  first_choice INTEGER NOT NULL,
  second_choice INTEGER NOT NULL,
  third_choice INTEGER NOT NULL,
  requested_size TEXT NOT NULL,
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(player_id)
);

-- Assignments table
CREATE TABLE IF NOT EXISTS assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
  jersey_number INTEGER NOT NULL,
  assigned_size TEXT NOT NULL,
  assignment_method TEXT NOT NULL CHECK (
    assignment_method IN ('kept_old', 'first_choice', 'second_choice', 'third_choice', 'fallback')
  ),
  is_finalized BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(player_id)
);

-- Admin settings table
CREATE TABLE IF NOT EXISTS admin_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,
  value JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_players_grade ON players(grade);
CREATE INDEX IF NOT EXISTS idx_players_is_returning ON players(is_returning);
CREATE INDEX IF NOT EXISTS idx_jersey_inventory_number ON jersey_inventory(number);
CREATE INDEX IF NOT EXISTS idx_jersey_inventory_available ON jersey_inventory(is_available);
CREATE INDEX IF NOT EXISTS idx_player_submissions_player_id ON player_submissions(player_id);
CREATE INDEX IF NOT EXISTS idx_assignments_player_id ON assignments(player_id);
CREATE INDEX IF NOT EXISTS idx_assignments_finalized ON assignments(is_finalized);

-- Insert default admin settings
INSERT INTO admin_settings (key, value) VALUES
  ('assignments_finalized', 'false'),
  ('deadline_date', '"2026-02-01"')
ON CONFLICT (key) DO NOTHING;

-- Enable Row Level Security
ALTER TABLE players ENABLE ROW LEVEL SECURITY;
ALTER TABLE jersey_inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE player_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_settings ENABLE ROW LEVEL SECURITY;

-- Public read access for players (for the dropdown)
CREATE POLICY "Players are viewable by everyone" ON players
  FOR SELECT USING (true);

-- Public read access for jersey inventory (to see available numbers)
CREATE POLICY "Jersey inventory is viewable by everyone" ON jersey_inventory
  FOR SELECT USING (true);

-- Anyone can insert their own submission
CREATE POLICY "Anyone can submit jersey preferences" ON player_submissions
  FOR INSERT WITH CHECK (true);

-- Public read access for submissions (to show status)
CREATE POLICY "Submissions are viewable by everyone" ON player_submissions
  FOR SELECT USING (true);

-- Public read access for finalized assignments
CREATE POLICY "Finalized assignments are viewable by everyone" ON assignments
  FOR SELECT USING (is_finalized = true);

-- Public read access for admin settings
CREATE POLICY "Admin settings are viewable by everyone" ON admin_settings
  FOR SELECT USING (true);

-- Admin policies (authenticated users can do everything)
CREATE POLICY "Authenticated users can manage players" ON players
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage jersey inventory" ON jersey_inventory
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage submissions" ON player_submissions
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage assignments" ON assignments
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage settings" ON admin_settings
  FOR ALL USING (auth.role() = 'authenticated');
