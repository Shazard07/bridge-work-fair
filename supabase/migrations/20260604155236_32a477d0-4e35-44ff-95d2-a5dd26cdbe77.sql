-- Drop all policies on worker_profiles
DROP POLICY IF EXISTS "Users can insert own worker profile" ON public.worker_profiles;
DROP POLICY IF EXISTS "Users can view own worker profile" ON public.worker_profiles;
DROP POLICY IF EXISTS "Users can update own worker profile" ON public.worker_profiles;
DROP POLICY IF EXISTS "Users can delete own worker profile" ON public.worker_profiles;

-- Drop all policies on company_profiles
DROP POLICY IF EXISTS "Users can insert own company profile" ON public.company_profiles;
DROP POLICY IF EXISTS "Users can view own company profile" ON public.company_profiles;
DROP POLICY IF EXISTS "Users can update own company profile" ON public.company_profiles;

-- Drop all policies on profiles
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;

-- Drop all policies on saved_workers
DROP POLICY IF EXISTS "Users can insert own saved workers" ON public.saved_workers;
DROP POLICY IF EXISTS "Users can view own saved workers" ON public.saved_workers;
DROP POLICY IF EXISTS "Users can delete own saved workers" ON public.saved_workers;

-- Drop all policies on worker_contacts
DROP POLICY IF EXISTS "Companies can insert contacts" ON public.worker_contacts;
DROP POLICY IF EXISTS "Workers can view own contacts" ON public.worker_contacts;
DROP POLICY IF EXISTS "Companies can view own contacts" ON public.worker_contacts;

-- Disable RLS on all tables
ALTER TABLE public.worker_profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.company_profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_workers DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.worker_contacts DISABLE ROW LEVEL SECURITY;