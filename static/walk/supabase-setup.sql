-- Walk Audit: Supabase setup
-- Paste this into your Supabase SQL Editor and run it.

create table entries (
  id uuid primary key default gen_random_uuid(),
  segment text not null default 'Segment 1',
  location text,
  lat double precision,
  lng double precision,
  sidewalk text check (sidewalk in ('good','fair','poor','none')),
  crosswalk text check (crosswalk in ('good','fair','poor','none')),
  lighting text check (lighting in ('good','fair','poor')),
  traffic text check (traffic in ('low','moderate','high')),
  safety text check (safety in ('safe','concerns','unsafe')),
  flagged boolean default false,
  photo_url text,
  notes text,
  observer text,
  created_at timestamptz default now()
);

-- Allow anonymous read/write (no auth needed for walk audit participants)
alter table entries enable row level security;
create policy "anon_read"   on entries for select using (true);
create policy "anon_insert" on entries for insert with check (true);
create policy "anon_delete" on entries for delete using (true);

-- Enable realtime so all team members see new entries live
alter publication supabase_realtime add table entries;
