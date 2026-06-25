-- Subscriptions Table
create table if not exists subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  plan text not null,
  meeting_limit integer not null,
  purchased_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  constraint unique_user_subscription unique (user_id)
);

-- Enable RLS
alter table subscriptions enable row level security;

-- Policies
create policy "Users can view their own subscription" on subscriptions for select to authenticated using (auth.uid() = user_id);
create policy "Service role can manage all subscriptions" on subscriptions for all to service_role using (true) with check (true);

-- Adding a function to automatically set updated_at
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger update_subscriptions_updated_at
before update on subscriptions
for each row
execute function update_updated_at_column();
