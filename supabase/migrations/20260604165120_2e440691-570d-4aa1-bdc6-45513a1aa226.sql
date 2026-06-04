
CREATE TYPE public.app_role AS ENUM ('worker', 'company');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read their own roles" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

INSERT INTO public.user_roles (user_id, role)
SELECT p.user_id, p.role::text::public.app_role
FROM public.profiles p
JOIN auth.users u ON u.id = p.user_id
ON CONFLICT DO NOTHING;

CREATE OR REPLACE FUNCTION public.sync_user_role_from_profile()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.user_id, NEW.role::text::public.app_role)
  ON CONFLICT (user_id, role) DO NOTHING;
  RETURN NEW;
END;
$$;
CREATE TRIGGER sync_role_on_profile_change
AFTER INSERT OR UPDATE OF role ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.sync_user_role_from_profile();

CREATE TABLE public.worker_sensitive (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  phone text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.worker_sensitive TO authenticated;
GRANT ALL ON public.worker_sensitive TO service_role;

INSERT INTO public.worker_sensitive (user_id, phone)
SELECT p.user_id, p.phone
FROM public.profiles p
JOIN auth.users u ON u.id = p.user_id
WHERE p.role::text = 'worker' AND p.phone IS NOT NULL
ON CONFLICT DO NOTHING;

ALTER TABLE public.profiles DROP COLUMN phone;

ALTER TABLE public.worker_sensitive ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Owner reads own sensitive" ON public.worker_sensitive FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Owner inserts own sensitive" ON public.worker_sensitive FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Owner updates own sensitive" ON public.worker_sensitive FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Owner deletes own sensitive" ON public.worker_sensitive FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE TRIGGER update_worker_sensitive_updated_at BEFORE UPDATE ON public.worker_sensitive
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DO $$
DECLARE r record;
BEGIN
  FOR r IN SELECT schemaname, tablename, policyname FROM pg_policies WHERE schemaname='public'
           AND tablename IN ('profiles','worker_profiles','company_profiles','saved_workers','worker_contacts') LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', r.policyname, r.tablename);
  END LOOP;
END $$;

GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated can read profiles" ON public.profiles FOR SELECT TO authenticated USING (true);
CREATE POLICY "Owner inserts own profile" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Owner updates own profile" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.worker_profiles TO authenticated;
GRANT ALL ON public.worker_profiles TO service_role;
ALTER TABLE public.worker_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Read worker profile" ON public.worker_profiles FOR SELECT TO authenticated
  USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'company'));
CREATE POLICY "Owner inserts own worker profile" ON public.worker_profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Owner updates own worker profile" ON public.worker_profiles FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Owner deletes own worker profile" ON public.worker_profiles FOR DELETE TO authenticated USING (auth.uid() = user_id);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.company_profiles TO authenticated;
GRANT ALL ON public.company_profiles TO service_role;
ALTER TABLE public.company_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Company reads own" ON public.company_profiles FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Company inserts own" ON public.company_profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Company updates own" ON public.company_profiles FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Company deletes own" ON public.company_profiles FOR DELETE TO authenticated USING (auth.uid() = user_id);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.saved_workers TO authenticated;
GRANT ALL ON public.saved_workers TO service_role;
ALTER TABLE public.saved_workers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Company manages own saves" ON public.saved_workers FOR ALL TO authenticated
  USING (auth.uid() = company_id) WITH CHECK (auth.uid() = company_id);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.worker_contacts TO authenticated;
GRANT ALL ON public.worker_contacts TO service_role;
ALTER TABLE public.worker_contacts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Company inserts own contacts" ON public.worker_contacts FOR INSERT TO authenticated WITH CHECK (auth.uid() = company_id);
CREATE POLICY "Participants read contacts" ON public.worker_contacts FOR SELECT TO authenticated
  USING (auth.uid() = company_id OR auth.uid() = worker_id);
CREATE POLICY "Company deletes own contacts" ON public.worker_contacts FOR DELETE TO authenticated USING (auth.uid() = company_id);

CREATE OR REPLACE FUNCTION public.get_worker_contact(_worker_id uuid)
RETURNS TABLE(phone text)
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NOT public.has_role(auth.uid(), 'company') THEN
    RAISE EXCEPTION 'Not authorized';
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM public.saved_workers WHERE company_id = auth.uid() AND worker_id = _worker_id
    UNION ALL
    SELECT 1 FROM public.worker_contacts WHERE company_id = auth.uid() AND worker_id = _worker_id
  ) THEN
    RAISE EXCEPTION 'Reveal not authorized for this worker';
  END IF;
  RETURN QUERY SELECT ws.phone FROM public.worker_sensitive ws WHERE ws.user_id = _worker_id;
END;
$$;
GRANT EXECUTE ON FUNCTION public.get_worker_contact(uuid) TO authenticated;
