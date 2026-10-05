-- Phase 5 Migration: Relationship Intelligence

create table if not exists meeting_relationships (
  id uuid primary key default gen_random_uuid(),
  meeting_id uuid references meetings(id) on delete cascade not null,
  source_name text not null,
  source_type text,
  relationship_type text not null,
  target_name text not null,
  target_type text,
  confidence numeric,
  source_reference jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS for meeting_relationships
alter table meeting_relationships enable row level security;

-- Policy (uses the same pattern as existing tables, assuming meetings are owned by user_id)
create policy "Users can manage their own meeting relationships" on meeting_relationships
  for all to authenticated
  using (meeting_id in (select id from meetings where user_id = auth.uid()))
  with check (meeting_id in (select id from meetings where user_id = auth.uid()));

-- Add indexes for fast lookup and search
create index if not exists idx_meeting_relationships_meeting_id on meeting_relationships(meeting_id);
create index if not exists idx_meeting_relationships_source on meeting_relationships(source_name);
create index if not exists idx_meeting_relationships_target on meeting_relationships(target_name);
