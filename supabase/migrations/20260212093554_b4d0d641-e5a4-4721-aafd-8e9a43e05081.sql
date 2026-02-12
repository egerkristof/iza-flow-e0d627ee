
-- ============================================================
-- LizaOS AACE v3.1 — Core Schema
-- ============================================================

-- 1. ENUMS
CREATE TYPE public.app_role AS ENUM ('operator', 'architect', 'manager');
CREATE TYPE public.context_category AS ENUM ('DIRECTIVE', 'KNOWLEDGE', 'PROCEDURE', 'PLAYBOOK', 'PREFERENCE');
CREATE TYPE public.action_logic AS ENUM ('APPEND', 'OVERRIDE', 'BLOCK');
CREATE TYPE public.priority_level AS ENUM ('STANDARD', 'CRITICAL');
CREATE TYPE public.security_scope AS ENUM ('INTERNAL', 'CONFIDENTIAL', 'ADMIN_ONLY');
CREATE TYPE public.workbook_status AS ENUM ('draft', 'active', 'review', 'completed', 'archived');

-- 2. PROFILES (public user info)
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE,
  display_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view all profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 3. USER ROLES
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL DEFAULT 'operator',
  UNIQUE (user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role
  )
$$;

CREATE POLICY "Users can view own roles" ON public.user_roles FOR SELECT USING (auth.uid() = user_id);

-- 4. WORKBOOKS
CREATE TABLE public.workbooks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  status workbook_status NOT NULL DEFAULT 'draft',
  strategic_outcome TEXT,
  drift_score NUMERIC(3,2) DEFAULT 0,
  locked_playbook_id UUID,
  current_step TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.workbooks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own workbooks" ON public.workbooks FOR SELECT USING (auth.uid() = owner_id);
CREATE POLICY "Users can create workbooks" ON public.workbooks FOR INSERT WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "Users can update own workbooks" ON public.workbooks FOR UPDATE USING (auth.uid() = owner_id);
CREATE POLICY "Users can delete own workbooks" ON public.workbooks FOR DELETE USING (auth.uid() = owner_id);
-- Managers can view all workbooks
CREATE POLICY "Managers can view all workbooks" ON public.workbooks FOR SELECT USING (public.has_role(auth.uid(), 'manager'));

-- 5. CONTEXT ITEMS (AACE v3.1 data model)
CREATE TABLE public.context_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL,
  title TEXT NOT NULL,
  content_full TEXT NOT NULL,
  category context_category NOT NULL DEFAULT 'KNOWLEDGE',
  operation_mode JSONB DEFAULT '[]'::jsonb,
  domain_scope JSONB DEFAULT '["GLOBAL"]'::jsonb,
  action_type action_logic NOT NULL DEFAULT 'APPEND',
  priority priority_level NOT NULL DEFAULT 'STANDARD',
  security_level security_scope NOT NULL DEFAULT 'INTERNAL',
  target_reference_id TEXT,
  trigger_intent TEXT,
  version TEXT DEFAULT 'v1.0',
  last_used_at TIMESTAMPTZ,
  expiry_date TIMESTAMPTZ,
  bundle_id UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.context_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own context items" ON public.context_items FOR SELECT USING (auth.uid() = owner_id);
CREATE POLICY "Architects can view all context items" ON public.context_items FOR SELECT USING (public.has_role(auth.uid(), 'architect'));
CREATE POLICY "Users can create context items" ON public.context_items FOR INSERT WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "Users can update own context items" ON public.context_items FOR UPDATE USING (auth.uid() = owner_id);
CREATE POLICY "Users can delete own context items" ON public.context_items FOR DELETE USING (auth.uid() = owner_id);

-- 6. BUNDLES (Capability Modules)
CREATE TABLE public.bundles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  scope_level TEXT NOT NULL DEFAULT 'draft',
  version TEXT DEFAULT 'v1.0',
  health_score NUMERIC(3,2) DEFAULT 1.0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.bundles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own bundles" ON public.bundles FOR SELECT USING (auth.uid() = owner_id);
CREATE POLICY "Architects can view all bundles" ON public.bundles FOR SELECT USING (public.has_role(auth.uid(), 'architect'));
CREATE POLICY "Users can create bundles" ON public.bundles FOR INSERT WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "Users can update own bundles" ON public.bundles FOR UPDATE USING (auth.uid() = owner_id);

-- 7. UPDATED_AT trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_workbooks_updated_at BEFORE UPDATE ON public.workbooks FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_context_items_updated_at BEFORE UPDATE ON public.context_items FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_bundles_updated_at BEFORE UPDATE ON public.bundles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 8. Auto-create profile + default role on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, display_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.email));
  
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'operator');
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
