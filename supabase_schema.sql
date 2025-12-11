
-- Users table
create table if not exists users (
  id text primary key,
  username text unique not null,
  password text not null, -- Hashed password
  display_name text not null,
  avatar text,
  profile_id text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Profiles table
create table if not exists profiles (
  id text primary key,
  user_id text references users(id),
  name text not null,
  nickname text,
  avatar text not null,
  bio text,
  skills jsonb default '[]'::jsonb,
  fun_facts jsonb default '[]'::jsonb, -- stored as array of strings
  catchphrase text,
  mood text, -- 'happy', 'sad', etc.
  level integer default 1,
  xp integer default 0,
  votes integer default 0,
  rank text default 'bronze',
  achievements jsonb default '[]'::jsonb,
  social_links jsonb default '[]'::jsonb,
  gallery_images jsonb default '[]'::jsonb, -- array of strings
  theme jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Posts table
create table if not exists posts (
  id text primary key,
  user_id text references users(id),
  author_name text not null,
  author_avatar text,
  content text not null,
  type text default 'normal', -- 'normal' | 'support_call'
  target_profile_id text references profiles(id),
  images jsonb default '[]'::jsonb,
  likes integer default 0,
  liked_by jsonb default '[]'::jsonb, -- array of user ids
  is_pinned boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Comments table (extracted from nested structure)
create table if not exists comments (
  id text primary key,
  post_id text references posts(id) on delete cascade,
  user_id text references users(id),
  author_name text not null,
  author_avatar text,
  content text not null,
  parent_id text references comments(id), -- for nested replies
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Votes table
create table if not exists votes (
  id text primary key,
  profile_id text references profiles(id),
  voter_id text not null, -- IP or session ID for anonymous voting
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Chat Messages table
create table if not exists chat_messages (
  id text primary key,
  room_id text,
  user_id text references users(id),
  profile_id text references profiles(id),
  sender_name text not null,
  sender_avatar text,
  message text not null,
  reply_to text,
  is_pinned boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS (Optional but recommended, though for this task I will leave it open or simple)
alter table users enable row level security;
alter table profiles enable row level security;
alter table posts enable row level security;
alter table comments enable row level security;
alter table votes enable row level security;
alter table chat_messages enable row level security;

-- Policies (Open for all for simplicity as per "100% logic migration" without complex auth setup in Supabase side yet)
create policy "Public users are viewable by everyone" on users for select using (true);
create policy "Users can insert their own data" on users for insert with check (true);
create policy "Users can update their own data" on users for update using (true);

create policy "Profiles are viewable by everyone" on profiles for select using (true);
create policy "Anyone can create profile" on profiles for insert with check (true);
create policy "Anyone can update profile" on profiles for update using (true);

create policy "Posts are viewable by everyone" on posts for select using (true);
create policy "Anyone can insert posts" on posts for insert with check (true);
create policy "Anyone can update posts" on posts for update using (true);

create policy "Comments are viewable by everyone" on comments for select using (true);
create policy "Anyone can insert comments" on comments for insert with check (true);

create policy "Votes are viewable by everyone" on votes for select using (true);
create policy "Anyone can insert votes" on votes for insert with check (true);

create policy "Chat is viewable by everyone" on chat_messages for select using (true);
create policy "Anyone can insert chat" on chat_messages for insert with check (true);
