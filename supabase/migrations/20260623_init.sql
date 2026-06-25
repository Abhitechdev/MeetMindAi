-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Meetings Table
create table if not exists meetings (
  id uuid primary key default gen_random_uuid(),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  title text not null,
  transcript text not null,
  executive_summary text not null,
  duration integer not null,
  sentiment text,
  priority text,
  tags text[],
  word_count integer not null,
  next_steps text[]
);

-- Action Items Table
create table if not exists action_items (
  id uuid primary key default gen_random_uuid(),
  meeting_id uuid references meetings(id) on delete cascade not null,
  action_text text not null,
  status text not null default 'pending',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Decisions Table
create table if not exists decisions (
  id uuid primary key default gen_random_uuid(),
  meeting_id uuid references meetings(id) on delete cascade not null,
  decision_text text not null,
  status text not null default 'proposed',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS)
alter table meetings enable row level security;
alter table action_items enable row level security;
alter table decisions enable row level security;

-- Create basic anon policies for MVP (No Auth yet)
create policy "Allow public read access on meetings" on meetings for select to anon using (true);
create policy "Allow public insert access on meetings" on meetings for insert to anon with check (true);
create policy "Allow public update access on meetings" on meetings for update to anon using (true) with check (true);

create policy "Allow public read access on action_items" on action_items for select to anon using (true);
create policy "Allow public insert access on action_items" on action_items for insert to anon with check (true);
create policy "Allow public update access on action_items" on action_items for update to anon using (true) with check (true);

create policy "Allow public read access on decisions" on decisions for select to anon using (true);
create policy "Allow public insert access on decisions" on decisions for insert to anon with check (true);
create policy "Allow public update access on decisions" on decisions for update to anon using (true) with check (true);
