-- Fix Foreign Key Constraint for posts.target_profile_id
-- Allow cascade delete when profile is deleted

-- First, drop the existing foreign key constraint
ALTER TABLE posts DROP CONSTRAINT IF EXISTS posts_target_profile_id_fkey;

-- Recreate the foreign key with ON DELETE SET NULL (safer option - keeps posts but removes profile reference)
ALTER TABLE posts ADD CONSTRAINT posts_target_profile_id_fkey 
  FOREIGN KEY (target_profile_id) REFERENCES profiles(id) ON DELETE SET NULL;

-- Also check and fix other foreign keys if needed
-- Fix votes table if it has issues
ALTER TABLE votes DROP CONSTRAINT IF EXISTS votes_profile_id_fkey;
ALTER TABLE votes ADD CONSTRAINT votes_profile_id_fkey 
  FOREIGN KEY (profile_id) REFERENCES profiles(id) ON DELETE CASCADE;

-- Fix chat_messages table
ALTER TABLE chat_messages DROP CONSTRAINT IF EXISTS chat_messages_profile_id_fkey;
ALTER TABLE chat_messages ADD CONSTRAINT chat_messages_profile_id_fkey 
  FOREIGN KEY (profile_id) REFERENCES profiles(id) ON DELETE SET NULL;
