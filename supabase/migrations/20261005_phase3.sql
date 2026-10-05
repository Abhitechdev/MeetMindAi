-- Phase 3 Migration: Decision & Commitment Intelligence

-- 1. Enhance Decisions Table
alter table decisions add column if not exists confidence numeric;
alter table decisions add column if not exists participants jsonb;
alter table decisions add column if not exists timestamp text;

-- (Optional) Convert existing decision statuses if they were 'proposed'
update decisions set status = 'CURRENT' where status = 'proposed';

-- 2. Create Commitments Table
create table if not exists commitments (
  id uuid primary key default gen_random_uuid(),
  meeting_id uuid references meetings(id) on delete cascade not null,
  person text not null,
  commitment_text text not null,
  due_date text,
  status text not null default 'OPEN',
  confidence numeric,
  source_reference jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS for commitments
alter table commitments enable row level security;

-- Policy (uses the same pattern as existing tables, assuming meetings are owned by user_id)
create policy "Users can manage their own commitments" on commitments
  for all to authenticated
  using (meeting_id in (select id from meetings where user_id = auth.uid()))
  with check (meeting_id in (select id from meetings where user_id = auth.uid()));

-- Add index for fast lookup
create index if not exists idx_commitments_meeting_id on commitments(meeting_id);
