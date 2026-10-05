-- Enable pg_trgm for better text search if needed
create extension if not exists pg_trgm;

-- Add source_reference to existing tables
alter table action_items add column if not exists source_reference jsonb;
alter table action_items add column if not exists owner text;
alter table decisions add column if not exists source_reference jsonb;

-- Create entities table
create table if not exists meeting_entities (
  id uuid primary key default gen_random_uuid(),
  meeting_id uuid references meetings(id) on delete cascade not null,
  entity_type text not null, -- 'person', 'topic', 'commitment', 'project', 'risk'
  entity_name text not null,
  normalized_name text,
  metadata jsonb,
  source_reference jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS for meeting_entities
alter table meeting_entities enable row level security;

-- Policy (uses the same pattern as existing tables, assuming meetings are owned by user_id)
create policy "Users can manage their own meeting entities" on meeting_entities
  for all to authenticated
  using (meeting_id in (select id from meetings where user_id = auth.uid()))
  with check (meeting_id in (select id from meetings where user_id = auth.uid()));

-- Add indexes for fast lookup and search
create index if not exists idx_meeting_entities_meeting_id on meeting_entities(meeting_id);
create index if not exists idx_meeting_entities_name_trgm on meeting_entities using gin(entity_name gin_trgm_ops);
create index if not exists idx_action_items_meeting_id on action_items(meeting_id);
create index if not exists idx_decisions_meeting_id on decisions(meeting_id);
