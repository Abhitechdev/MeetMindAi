-- Add segments column to store timestamped transcript segments
alter table meetings add column if not exists segments jsonb default '[]'::jsonb;
