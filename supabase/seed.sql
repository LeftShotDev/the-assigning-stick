-- Demo data for The Assigning Stick
-- Pop culture kids roster

-- Insert demo players
INSERT INTO players (first_name, last_name, grade, is_returning, participated_fall_ball, previous_jersey_number) VALUES
  -- 8th graders
  ('Eleven', 'Hopper', 8, true, true, 11),
  ('Harry', 'Potter', 8, true, true, 7),
  ('Percy', 'Jackson', 8, true, false, 23),
  ('Peter', 'Parker', 8, false, true, NULL),
  ('Katniss', 'Everdeen', 8, true, true, 12),

  -- 7th graders
  ('Mike', 'Wheeler', 7, true, true, 15),
  ('Hermione', 'Granger', 7, false, true, NULL),
  ('Annabeth', 'Chase', 7, true, false, 6),
  ('Miles', 'Morales', 7, false, true, NULL),
  ('Peeta', 'Mellark', 7, false, false, NULL),
  ('Dustin', 'Henderson', 7, true, true, 22),
  ('Ron', 'Weasley', 7, false, true, NULL),

  -- 6th graders
  ('Lucas', 'Sinclair', 6, false, true, NULL),
  ('Will', 'Byers', 6, false, false, NULL),
  ('Max', 'Mayfield', 6, false, true, NULL),
  ('Gwen', 'Stacy', 6, false, true, NULL),
  ('Aang', 'Avatar', 6, false, false, NULL),
  ('Katara', 'Water', 6, false, true, NULL),
  ('Sokka', 'Water', 6, false, false, NULL),
  ('Toph', 'Beifong', 6, false, true, NULL),
  ('Neville', 'Longbottom', 6, false, false, NULL),
  ('Luna', 'Lovegood', 6, false, true, NULL),
  ('Ginny', 'Weasley', 6, false, false, NULL),
  ('Grover', 'Underwood', 6, false, false, NULL);

-- Insert jersey inventory (numbers 1-50)
INSERT INTO jersey_inventory (number, sizes, is_available)
SELECT
  num,
  CASE
    WHEN num <= 15 THEN ARRAY['YS', 'YM']::TEXT[]
    WHEN num <= 30 THEN ARRAY['YM', 'YL', 'AS']::TEXT[]
    WHEN num <= 45 THEN ARRAY['YL', 'AS', 'AM']::TEXT[]
    ELSE ARRAY['AS', 'AM', 'AL']::TEXT[]
  END,
  true
FROM generate_series(0, 50) AS num;

-- Add some sample submissions (about 40% of players have submitted)
INSERT INTO player_submissions (player_id, first_choice, second_choice, third_choice, requested_size)
SELECT
  id,
  CASE
    WHEN previous_jersey_number IS NOT NULL THEN previous_jersey_number
    ELSE (RANDOM() * 50)::INTEGER
  END,
  (RANDOM() * 50)::INTEGER,
  (RANDOM() * 50)::INTEGER,
  CASE
    WHEN grade = 6 THEN (ARRAY['YS', 'YM', 'YL'])[floor(random() * 3 + 1)]
    WHEN grade = 7 THEN (ARRAY['YM', 'YL', 'AS'])[floor(random() * 3 + 1)]
    ELSE (ARRAY['YL', 'AS', 'AM'])[floor(random() * 3 + 1)]
  END
FROM players
WHERE random() < 0.4;
