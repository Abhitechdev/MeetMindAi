-- Add processed_count to subscriptions
alter table subscriptions add column if not exists processed_count integer default 0;

-- Transactions Table
create table if not exists transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) not null,
  order_id text unique not null,
  payment_id text not null,
  payment_provider text not null,
  plan text not null,
  amount numeric not null,
  status text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table transactions enable row level security;

-- Policies
create policy "Users can view their own transactions" on transactions 
  for select to authenticated 
  using (auth.uid() = user_id);

create policy "Service role can manage all transactions" on transactions 
  for all to service_role 
  using (true) with check (true);

-- RPC for atomic increment of processed_count
create or replace function increment_processed_count()
returns void as $$
begin
  update subscriptions
  set processed_count = processed_count + 1
  where user_id = auth.uid();
end;
$$ language plpgsql security invoker;
