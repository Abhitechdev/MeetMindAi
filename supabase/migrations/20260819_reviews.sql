-- admin_users table for RBAC
create table if not exists admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- reviews table
create table if not exists reviews (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  name text not null,
  rating integer not null check (rating >= 1 and rating <= 5),
  title text not null,
  review text not null,
  role text,
  avatar_url text,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  verified_user boolean not null default false,
  trustpilot_invited boolean not null default false,
  trustpilot_review_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Table for private review data (e.g. email) to avoid exposure via Realtime
create table if not exists review_private_data (
  review_id uuid primary key references reviews(id) on delete cascade,
  email text not null,
  contact_requested boolean not null default false
);

-- Indexes for performance
create index if not exists reviews_status_idx on reviews(status);
create index if not exists reviews_created_at_idx on reviews(created_at desc);
create index if not exists reviews_rating_idx on reviews(rating);

-- Enable RLS
alter table admin_users enable row level security;
alter table reviews enable row level security;
alter table review_private_data enable row level security;

-- Admin Users Policies
-- Only admins can read the admin table
create policy "Admins can read admin_users" on admin_users for select to authenticated using (
  exists (select 1 from admin_users where user_id = auth.uid())
);

-- Reviews Policies
-- Public can insert only pending reviews with safe defaults
create policy "Anyone can insert a review" on reviews for insert to public with check (
  status = 'pending' and
  verified_user = false and
  trustpilot_invited = false
);

-- Public can read approved reviews ONLY
create policy "Anyone can read approved reviews" on reviews for select to public using (status = 'approved');

-- Admins can do everything on reviews
create policy "Admins can read all reviews" on reviews for select to authenticated using (
  exists (select 1 from admin_users where user_id = auth.uid())
);

create policy "Admins can update reviews" on reviews for update to authenticated using (
  exists (select 1 from admin_users where user_id = auth.uid())
) with check (
  exists (select 1 from admin_users where user_id = auth.uid())
);

create policy "Admins can delete reviews" on reviews for delete to authenticated using (
  exists (select 1 from admin_users where user_id = auth.uid())
);

-- Private Data Policies
create policy "Anyone can insert private data" on review_private_data for insert to public with check (true);

create policy "Admins can read private data" on review_private_data for select to authenticated using (
  exists (select 1 from admin_users where user_id = auth.uid())
);

create policy "Admins can delete private data" on review_private_data for delete to authenticated using (
  exists (select 1 from admin_users where user_id = auth.uid())
);

-- Enable Realtime for reviews table
alter publication supabase_realtime add table reviews;
