
-- Drop old job/application system
DROP TABLE IF EXISTS public.applications CASCADE;
DROP TABLE IF EXISTS public.jobs CASCADE;
DROP TYPE IF EXISTS public.application_status CASCADE;
DROP TYPE IF EXISTS public.work_pass_type CASCADE;

-- Worker profile additions
ALTER TABLE public.worker_profiles
  ADD COLUMN IF NOT EXISTS available_now boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS available_from date,
  ADD COLUMN IF NOT EXISTS sg_experiences jsonb NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS overseas_experiences jsonb NOT NULL DEFAULT '[]'::jsonb;

-- Drop superseded flat experience columns
ALTER TABLE public.worker_profiles
  DROP COLUMN IF EXISTS sg_experience_years,
  DROP COLUMN IF EXISTS sg_experience_period,
  DROP COLUMN IF EXISTS other_experience_years,
  DROP COLUMN IF EXISTS other_experience_period;

-- saved_workers
CREATE TABLE public.saved_workers (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id uuid NOT NULL,
  worker_id uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (company_id, worker_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.saved_workers TO authenticated;
GRANT ALL ON public.saved_workers TO service_role;
ALTER TABLE public.saved_workers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "saved_workers_select_own_company" ON public.saved_workers
  FOR SELECT TO authenticated USING (auth.uid() = company_id);
CREATE POLICY "saved_workers_insert_own_company" ON public.saved_workers
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = company_id);
CREATE POLICY "saved_workers_delete_own_company" ON public.saved_workers
  FOR DELETE TO authenticated USING (auth.uid() = company_id);

-- worker_contacts
CREATE TABLE public.worker_contacts (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id uuid NOT NULL,
  worker_id uuid NOT NULL,
  message text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.worker_contacts TO authenticated;
GRANT ALL ON public.worker_contacts TO service_role;
ALTER TABLE public.worker_contacts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "worker_contacts_select_company" ON public.worker_contacts
  FOR SELECT TO authenticated USING (auth.uid() = company_id);
CREATE POLICY "worker_contacts_select_worker" ON public.worker_contacts
  FOR SELECT TO authenticated USING (auth.uid() = worker_id);
CREATE POLICY "worker_contacts_insert_company" ON public.worker_contacts
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = company_id);
