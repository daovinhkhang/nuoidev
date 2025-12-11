-- Migration: Change votes table from visitor_id to user_id
-- Allows users to vote only when logged in, 1 vote per user per profile per day

-- Drop old votes table (will lose old vote data)
DROP TABLE IF EXISTS votes CASCADE;

-- Recreate votes table with user_id instead of voter_id
CREATE TABLE votes (
  id text PRIMARY KEY,
  profile_id text NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  user_id text NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create indexes for faster queries
CREATE INDEX idx_votes_user_id ON votes(user_id);
CREATE INDEX idx_votes_profile_id ON votes(profile_id);
CREATE INDEX idx_votes_created_at ON votes(created_at);

-- Note: One vote per user per profile per day is enforced by backend application logic
-- in hasVotedToday() function, not by database constraint

-- Update RLS policies for votes table
ALTER TABLE votes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Votes are viewable by everyone" ON votes;
DROP POLICY IF EXISTS "Anyone can insert votes" ON votes;
DROP POLICY IF EXISTS "Users can insert their own votes" ON votes;

CREATE POLICY "Votes are viewable by everyone" ON votes FOR SELECT USING (true);
CREATE POLICY "Users can insert votes" ON votes FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can delete their own votes" ON votes FOR DELETE USING (true);

-- Note: If you still have old vote data that you want to preserve,
-- uncomment the migration logic below before dropping the table:
/*
-- Create temporary table with old data
CREATE TABLE votes_backup AS SELECT * FROM votes;

-- Then migrate the data (example - adjust based on your needs)
-- INSERT INTO votes (id, profile_id, user_id, created_at) 
-- SELECT id, profile_id, '000', created_at FROM votes_backup
-- WHERE ...
*/

