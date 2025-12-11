-- Drop existing policies before creating new ones
-- This prevents "policy already exists" errors

-- Users table
drop policy if exists "Public users are viewable by everyone" on users;
drop policy if exists "Users can insert their own data" on users;
drop policy if exists "Users can update their own data" on users;
drop policy if exists "Users can delete their own data" on users;

-- Profiles table
drop policy if exists "Profiles are viewable by everyone" on profiles;
drop policy if exists "Anyone can create profile" on profiles;
drop policy if exists "Anyone can update profile" on profiles;
drop policy if exists "Anyone can delete profile" on profiles;

-- Posts table
drop policy if exists "Posts are viewable by everyone" on posts;
drop policy if exists "Anyone can insert posts" on posts;
drop policy if exists "Anyone can update posts" on posts;
drop policy if exists "Anyone can delete posts" on posts;

-- Comments table
drop policy if exists "Comments are viewable by everyone" on comments;
drop policy if exists "Anyone can insert comments" on comments;
drop policy if exists "Anyone can delete comments" on comments;

-- Votes table
drop policy if exists "Votes are viewable by everyone" on votes;
drop policy if exists "Anyone can insert votes" on votes;

-- Chat Messages table
drop policy if exists "Chat is viewable by everyone" on chat_messages;
drop policy if exists "Anyone can insert chat" on chat_messages;
drop policy if exists "Anyone can delete chat" on chat_messages;

-- ============== Now create the new policies ==============

-- Policies (Open for all for simplicity)
create policy "Public users are viewable by everyone" on users for select using (true);
create policy "Users can insert their own data" on users for insert with check (true);
create policy "Users can update their own data" on users for update using (true);
create policy "Users can delete their own data" on users for delete using (true);

create policy "Profiles are viewable by everyone" on profiles for select using (true);
create policy "Anyone can create profile" on profiles for insert with check (true);
create policy "Anyone can update profile" on profiles for update using (true);
create policy "Anyone can delete profile" on profiles for delete using (true);

create policy "Posts are viewable by everyone" on posts for select using (true);
create policy "Anyone can insert posts" on posts for insert with check (true);
create policy "Anyone can update posts" on posts for update using (true);
create policy "Anyone can delete posts" on posts for delete using (true);

create policy "Comments are viewable by everyone" on comments for select using (true);
create policy "Anyone can insert comments" on comments for insert with check (true);
create policy "Anyone can delete comments" on comments for delete using (true);

create policy "Votes are viewable by everyone" on votes for select using (true);
create policy "Anyone can insert votes" on votes for insert with check (true);

create policy "Chat is viewable by everyone" on chat_messages for select using (true);
create policy "Anyone can insert chat" on chat_messages for insert with check (true);
create policy "Anyone can delete chat" on chat_messages for delete using (true);
