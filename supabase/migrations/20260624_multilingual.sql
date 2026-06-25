ALTER TABLE meetings
ADD COLUMN IF NOT EXISTS language text,
ADD COLUMN IF NOT EXISTS language_code text;
