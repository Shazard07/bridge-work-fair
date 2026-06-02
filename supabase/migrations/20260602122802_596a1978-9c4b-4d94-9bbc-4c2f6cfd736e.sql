ALTER TABLE public.jobs ADD COLUMN min_salary_day integer, ADD COLUMN max_salary_day integer;
ALTER TABLE public.jobs DROP COLUMN salary_period;
DROP TYPE IF EXISTS public.salary_period;