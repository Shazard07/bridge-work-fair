ALTER TABLE public.worker_profiles
  ADD COLUMN IF NOT EXISTS last_drawn_salary_day integer,
  ADD COLUMN IF NOT EXISTS expected_salary_day integer;