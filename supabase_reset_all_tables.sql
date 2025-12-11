-- ============================================
-- RESET & RECREATE ALL TABLES
-- ============================================
-- This script will drop all existing tables and recreate them

-- Drop tables in reverse order of dependencies (due to foreign keys)
DROP TABLE IF EXISTS votes CASCADE;
DROP TABLE IF EXISTS chat_messages CASCADE;
DROP TABLE IF EXISTS comments CASCADE;
DROP TABLE IF EXISTS posts CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- ============================================
-- CREATE TABLES
-- ============================================

-- Users table
CREATE TABLE users (
  id text primary key,
  username text unique not null,
  password text not null,
  display_name text not null,
  avatar text,
  profile_id text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Profiles table
CREATE TABLE profiles (
  id text primary key,
  user_id text references users(id),
  name text not null,
  nickname text,
  avatar text not null,
  bio text,
  skills jsonb default '[]'::jsonb,
  fun_facts jsonb default '[]'::jsonb,
  catchphrase text,
  mood text,
  level integer default 1,
  xp integer default 0,
  votes integer default 0,
  rank text default 'bronze',
  achievements jsonb default '[]'::jsonb,
  social_links jsonb default '[]'::jsonb,
  gallery_images jsonb default '[]'::jsonb,
  theme jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Posts table
CREATE TABLE posts (
  id text primary key,
  user_id text references users(id),
  author_name text not null,
  author_avatar text,
  content text not null,
  type text default 'normal',
  target_profile_id text references profiles(id) on delete set null,
  images jsonb default '[]'::jsonb,
  likes integer default 0,
  liked_by jsonb default '[]'::jsonb,
  is_pinned boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Comments table
CREATE TABLE comments (
  id text primary key,
  post_id text references posts(id) on delete cascade,
  user_id text references users(id),
  author_name text not null,
  author_avatar text,
  content text not null,
  parent_id text references comments(id),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Votes table
CREATE TABLE votes (
  id text primary key,
  profile_id text not null references profiles(id) on delete cascade,
  user_id text not null references users(id) on delete cascade,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create indexes for votes
CREATE INDEX idx_votes_user_id ON votes(user_id);
CREATE INDEX idx_votes_profile_id ON votes(profile_id);
CREATE INDEX idx_votes_created_at ON votes(created_at);

-- Chat Messages table
CREATE TABLE chat_messages (
  id text primary key,
  room_id text,
  user_id text references users(id),
  profile_id text references profiles(id) on delete set null,
  sender_name text not null,
  sender_avatar text,
  message text not null,
  reply_to text,
  is_pinned boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ============================================
-- ENABLE RLS
-- ============================================

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- ============================================
-- DROP OLD POLICIES
-- ============================================

DROP POLICY IF EXISTS "Public users are viewable by everyone" ON users;
DROP POLICY IF EXISTS "Users can insert their own data" ON users;
DROP POLICY IF EXISTS "Users can update their own data" ON users;
DROP POLICY IF EXISTS "Users can delete their own data" ON users;

DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON profiles;
DROP POLICY IF EXISTS "Anyone can create profile" ON profiles;
DROP POLICY IF EXISTS "Anyone can update profile" ON profiles;
DROP POLICY IF EXISTS "Anyone can delete profile" ON profiles;

DROP POLICY IF EXISTS "Posts are viewable by everyone" ON posts;
DROP POLICY IF EXISTS "Anyone can insert posts" ON posts;
DROP POLICY IF EXISTS "Anyone can update posts" ON posts;
DROP POLICY IF EXISTS "Anyone can delete posts" ON posts;

DROP POLICY IF EXISTS "Comments are viewable by everyone" ON comments;
DROP POLICY IF EXISTS "Anyone can insert comments" ON comments;
DROP POLICY IF EXISTS "Anyone can delete comments" ON comments;

DROP POLICY IF EXISTS "Votes are viewable by everyone" ON votes;
DROP POLICY IF EXISTS "Anyone can insert votes" ON votes;
DROP POLICY IF EXISTS "Users can insert their own votes" ON votes;
DROP POLICY IF EXISTS "Users can delete their own votes" ON votes;

DROP POLICY IF EXISTS "Chat is viewable by everyone" ON chat_messages;
DROP POLICY IF EXISTS "Anyone can insert chat" ON chat_messages;
DROP POLICY IF EXISTS "Anyone can delete chat" ON chat_messages;

-- ============================================
-- CREATE NEW POLICIES
-- ============================================

-- Users policies
CREATE POLICY "Public users are viewable by everyone" ON users FOR SELECT USING (true);
CREATE POLICY "Users can insert their own data" ON users FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update their own data" ON users FOR UPDATE USING (true);
CREATE POLICY "Users can delete their own data" ON users FOR DELETE USING (true);

-- Profiles policies
CREATE POLICY "Profiles are viewable by everyone" ON profiles FOR SELECT USING (true);
CREATE POLICY "Anyone can create profile" ON profiles FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update profile" ON profiles FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete profile" ON profiles FOR DELETE USING (true);

-- Posts policies
CREATE POLICY "Posts are viewable by everyone" ON posts FOR SELECT USING (true);
CREATE POLICY "Anyone can insert posts" ON posts FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update posts" ON posts FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete posts" ON posts FOR DELETE USING (true);

-- Comments policies
CREATE POLICY "Comments are viewable by everyone" ON comments FOR SELECT USING (true);
CREATE POLICY "Anyone can insert comments" ON comments FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can delete comments" ON comments FOR DELETE USING (true);

-- Votes policies
CREATE POLICY "Votes are viewable by everyone" ON votes FOR SELECT USING (true);
CREATE POLICY "Users can insert votes" ON votes FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can delete votes" ON votes FOR DELETE USING (true);

-- Chat policies
CREATE POLICY "Chat is viewable by everyone" ON chat_messages FOR SELECT USING (true);
CREATE POLICY "Anyone can insert chat" ON chat_messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can delete chat" ON chat_messages FOR DELETE USING (true);

-- ============================================
-- DONE!
-- ============================================
-- All tables have been reset and recreated with the latest schema
