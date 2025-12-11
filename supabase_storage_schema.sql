
-- Insert 'uploads' bucket if not exists
insert into storage.buckets (id, name, public)
values ('uploads', 'uploads', true)
on conflict (id) do nothing;

-- Allow public access to 'uploads' bucket
create policy "Public Access"
on storage.objects for select
using ( bucket_id = 'uploads' );

-- Allow uploads (insert) to 'uploads' bucket for everyone (mimicking previous open upload behavior)
create policy "Public Upload"
on storage.objects for insert
with check ( bucket_id = 'uploads' );
