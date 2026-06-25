-- public.handle_new_user_subscription
-- Trigger function to automatically insert a 'Free' subscription for new users.
-- This runs as security definer to bypass RLS and auth.users write checks.
create or replace function public.handle_new_user_subscription()
returns trigger as $$
begin
  insert into public.subscriptions (user_id, plan, meeting_limit, processed_count)
  values (new.id, 'Free', 3, 0)
  on conflict (user_id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

-- Trigger on auth.users (runs after a user is inserted in authentication)
create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user_subscription();

-- Redefine increment_processed_count
-- Runs as security definer to allow users to update their processed_count atomically,
-- and performs an upsert if their subscription row does not exist for some reason.
create or replace function public.increment_processed_count()
returns void as $$
begin
  insert into public.subscriptions (user_id, plan, meeting_limit, processed_count)
  values (auth.uid(), 'Free', 3, 1)
  on conflict (user_id)
  do update set processed_count = subscriptions.processed_count + 1;
end;
$$ language plpgsql security definer;
