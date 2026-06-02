ALTER TABLE public.worker_profiles
  ADD COLUMN education text,
  ADD COLUMN certifications text,
  ADD COLUMN sg_experience_years numeric,
  ADD COLUMN sg_experience_period text,
  ADD COLUMN other_experience_years numeric,
  ADD COLUMN other_experience_period text,
  ADD COLUMN last_drawn_salary integer,
  ADD COLUMN expected_salary integer;