-- Reset existing tables
DROP TABLE IF EXISTS public.agent_profiles CASCADE;
DROP TABLE IF EXISTS public.worker_profiles CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;
DROP TYPE IF EXISTS public.user_role CASCADE;

CREATE TYPE public.user_role AS ENUM ('worker', 'company');
CREATE TYPE public.nationality AS ENUM ('India', 'Bangladesh', 'Thailand', 'China');
CREATE TYPE public.language AS ENUM ('Tamil', 'Hindi', 'Bengali', 'Thai', 'Mandarin');
CREATE TYPE public.sector AS ENUM ('Construction', 'Marine');
CREATE TYPE public.work_pass_type AS ENUM ('Work Permit', 'S Pass');
CREATE TYPE public.work_pass_accepted AS ENUM ('Work Permit', 'S Pass', 'Both');
CREATE TYPE public.application_status AS ENUM ('Pending', 'Viewed', 'Contacted', 'Rejected');

-- profiles
CREATE TABLE public.profiles (
  user_id UUID PRIMARY KEY,
  role public.user_role NOT NULL,
  full_name TEXT NOT NULL,
  phone TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "profiles_select_own" ON public.profiles FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "profiles_insert_own" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "profiles_update_own" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = user_id);

-- worker_profiles
CREATE TABLE public.worker_profiles (
  user_id UUID PRIMARY KEY,
  nationality public.nationality NOT NULL,
  date_of_birth DATE NOT NULL,
  language public.language NOT NULL,
  sector public.sector NOT NULL,
  years_experience INTEGER NOT NULL DEFAULT 0,
  skills TEXT NOT NULL DEFAULT '',
  work_pass_end_date DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.worker_profiles TO authenticated;
GRANT ALL ON public.worker_profiles TO service_role;
ALTER TABLE public.worker_profiles ENABLE ROW LEVEL SECURITY;
-- Workers manage own; companies can view worker profiles (for browsing)
CREATE POLICY "worker_profiles_select_self" ON public.worker_profiles FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "worker_profiles_select_companies" ON public.worker_profiles FOR SELECT TO authenticated USING (
  EXISTS (SELECT 1 FROM public.profiles p WHERE p.user_id = auth.uid() AND p.role = 'company')
);
CREATE POLICY "worker_profiles_insert_own" ON public.worker_profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "worker_profiles_update_own" ON public.worker_profiles FOR UPDATE TO authenticated USING (auth.uid() = user_id);

-- company_profiles
CREATE TABLE public.company_profiles (
  user_id UUID PRIMARY KEY,
  company_name TEXT NOT NULL,
  uen TEXT NOT NULL,
  sector public.sector NOT NULL,
  contact_name TEXT NOT NULL,
  contact_phone TEXT NOT NULL,
  work_pass_accepted public.work_pass_accepted NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.company_profiles TO authenticated;
GRANT ALL ON public.company_profiles TO service_role;
ALTER TABLE public.company_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "company_profiles_select_all_auth" ON public.company_profiles FOR SELECT TO authenticated USING (true);
CREATE POLICY "company_profiles_insert_own" ON public.company_profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "company_profiles_update_own" ON public.company_profiles FOR UPDATE TO authenticated USING (auth.uid() = user_id);

-- jobs
CREATE TABLE public.jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL,
  title TEXT NOT NULL,
  sector public.sector NOT NULL,
  work_pass_type public.work_pass_accepted NOT NULL,
  workers_needed INTEGER NOT NULL DEFAULT 1,
  min_salary INTEGER NOT NULL,
  max_salary INTEGER NOT NULL,
  location TEXT NOT NULL,
  contract_duration TEXT NOT NULL,
  start_date DATE NOT NULL,
  work_hours TEXT NOT NULL,
  description TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.jobs TO authenticated;
GRANT ALL ON public.jobs TO service_role;
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "jobs_select_all_auth" ON public.jobs FOR SELECT TO authenticated USING (true);
CREATE POLICY "jobs_insert_own_company" ON public.jobs FOR INSERT TO authenticated WITH CHECK (auth.uid() = company_id);
CREATE POLICY "jobs_update_own_company" ON public.jobs FOR UPDATE TO authenticated USING (auth.uid() = company_id);
CREATE POLICY "jobs_delete_own_company" ON public.jobs FOR DELETE TO authenticated USING (auth.uid() = company_id);
CREATE INDEX idx_jobs_company ON public.jobs(company_id);
CREATE INDEX idx_jobs_sector ON public.jobs(sector);

-- applications
CREATE TABLE public.applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID NOT NULL REFERENCES public.jobs(id) ON DELETE CASCADE,
  worker_id UUID NOT NULL,
  status public.application_status NOT NULL DEFAULT 'Pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (job_id, worker_id)
);
GRANT SELECT, INSERT, UPDATE ON public.applications TO authenticated;
GRANT ALL ON public.applications TO service_role;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
-- Worker can see own
CREATE POLICY "applications_select_worker" ON public.applications FOR SELECT TO authenticated USING (auth.uid() = worker_id);
-- Company can see applications to own jobs
CREATE POLICY "applications_select_company" ON public.applications FOR SELECT TO authenticated USING (
  EXISTS (SELECT 1 FROM public.jobs j WHERE j.id = applications.job_id AND j.company_id = auth.uid())
);
-- Worker creates own application
CREATE POLICY "applications_insert_worker" ON public.applications FOR INSERT TO authenticated WITH CHECK (auth.uid() = worker_id);
-- Company updates status on its jobs' applications
CREATE POLICY "applications_update_company" ON public.applications FOR UPDATE TO authenticated USING (
  EXISTS (SELECT 1 FROM public.jobs j WHERE j.id = applications.job_id AND j.company_id = auth.uid())
);
CREATE INDEX idx_applications_job ON public.applications(job_id);
CREATE INDEX idx_applications_worker ON public.applications(worker_id);

-- updated_at triggers
CREATE TRIGGER trg_profiles_updated BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER trg_worker_profiles_updated BEFORE UPDATE ON public.worker_profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER trg_company_profiles_updated BEFORE UPDATE ON public.company_profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER trg_jobs_updated BEFORE UPDATE ON public.jobs FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER trg_applications_updated BEFORE UPDATE ON public.applications FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();