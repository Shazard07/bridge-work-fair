CREATE TYPE public.salary_period AS ENUM ('day', 'month');

ALTER TABLE public.jobs
ADD COLUMN salary_period public.salary_period NOT NULL DEFAULT 'month';