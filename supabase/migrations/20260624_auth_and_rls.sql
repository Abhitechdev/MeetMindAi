-- ponytail: minimum required schema for user workspaces
alter table meetings 
  add column if not exists user_id uuid references auth.users(id),
  add column if not exists email text;

-- Drop public policies
drop policy if exists "Allow public read access on meetings" on meetings;
drop policy if exists "Allow public insert access on meetings" on meetings;
drop policy if exists "Allow public update access on meetings" on meetings;

drop policy if exists "Allow public read access on action_items" on action_items;
drop policy if exists "Allow public insert access on action_items" on action_items;
drop policy if exists "Allow public update access on action_items" on action_items;

drop policy if exists "Allow public read access on decisions" on decisions;
drop policy if exists "Allow public insert access on decisions" on decisions;
drop policy if exists "Allow public update access on decisions" on decisions;

-- strict RLS for meetings
create policy "Users can manage their own meetings" on meetings
  for all to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

-- strict RLS for action items (join on meetings)
create policy "Users can manage their own action items" on action_items
  for all to authenticated
  using (meeting_id in (select id from meetings where user_id = auth.uid()))
  with check (meeting_id in (select id from meetings where user_id = auth.uid()));

-- strict RLS for decisions (join on meetings)
create policy "Users can manage their own decisions" on decisions
  for all to authenticated
  using (meeting_id in (select id from meetings where user_id = auth.uid()))
  with check (meeting_id in (select id from meetings where user_id = auth.uid()));
