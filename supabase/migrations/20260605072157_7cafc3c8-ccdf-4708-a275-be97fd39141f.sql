
CREATE TABLE public.job_postings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  company_name TEXT NOT NULL,
  sector public.sector NOT NULL,
  location TEXT NOT NULL,
  salary_min INTEGER,
  salary_max INTEGER,
  salary_period TEXT NOT NULL DEFAULT 'month',
  description TEXT NOT NULL,
  requirements TEXT,
  work_pass_accepted public.work_pass_accepted NOT NULL DEFAULT 'Both',
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.job_postings TO anon, authenticated;
GRANT ALL ON public.job_postings TO service_role;
ALTER TABLE public.job_postings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view active jobs" ON public.job_postings FOR SELECT USING (active = true);
CREATE TRIGGER update_job_postings_updated_at BEFORE UPDATE ON public.job_postings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.job_applications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  job_id UUID NOT NULL REFERENCES public.job_postings(id) ON DELETE CASCADE,
  worker_id UUID NOT NULL,
  status TEXT NOT NULL DEFAULT 'applied',
  note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (job_id, worker_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.job_applications TO authenticated;
GRANT ALL ON public.job_applications TO service_role;
ALTER TABLE public.job_applications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Workers view own applications" ON public.job_applications FOR SELECT TO authenticated USING (auth.uid() = worker_id);
CREATE POLICY "Workers create own applications" ON public.job_applications FOR INSERT TO authenticated WITH CHECK (auth.uid() = worker_id);
CREATE POLICY "Workers delete own applications" ON public.job_applications FOR DELETE TO authenticated USING (auth.uid() = worker_id);
CREATE TRIGGER update_job_applications_updated_at BEFORE UPDATE ON public.job_applications FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
