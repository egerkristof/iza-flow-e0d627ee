
-- Storage bucket for personal documents (CVs, LinkedIn PDFs, Gartner profiles, etc.)
INSERT INTO storage.buckets (id, name, public)
VALUES ('personal-documents', 'personal-documents', false);

-- Storage policies: users can only access their own folder
CREATE POLICY "Users can upload own documents"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'personal-documents' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view own documents"
ON storage.objects FOR SELECT
USING (bucket_id = 'personal-documents' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update own documents"
ON storage.objects FOR UPDATE
USING (bucket_id = 'personal-documents' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete own documents"
ON storage.objects FOR DELETE
USING (bucket_id = 'personal-documents' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Personal documents metadata table
CREATE TABLE public.personal_documents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_type TEXT NOT NULL,
  document_category TEXT NOT NULL DEFAULT 'other',
  description TEXT,
  parsed_status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.personal_documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own documents" ON public.personal_documents FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own documents" ON public.personal_documents FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own documents" ON public.personal_documents FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own documents" ON public.personal_documents FOR DELETE USING (auth.uid() = user_id);

CREATE TRIGGER update_personal_documents_updated_at
BEFORE UPDATE ON public.personal_documents
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Personal goals & KPIs
CREATE TABLE public.personal_goals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  goal_type TEXT NOT NULL DEFAULT 'goal',
  target_value TEXT,
  current_value TEXT,
  unit TEXT,
  status TEXT NOT NULL DEFAULT 'active',
  due_date TIMESTAMPTZ,
  workbook_id UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.personal_goals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own goals" ON public.personal_goals FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own goals" ON public.personal_goals FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own goals" ON public.personal_goals FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own goals" ON public.personal_goals FOR DELETE USING (auth.uid() = user_id);

CREATE TRIGGER update_personal_goals_updated_at
BEFORE UPDATE ON public.personal_goals
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Working preferences (per-user context adjustments)
CREATE TABLE public.working_preferences (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  scope_type TEXT NOT NULL DEFAULT 'global',
  scope_id UUID,
  preference_key TEXT NOT NULL,
  preference_value TEXT NOT NULL,
  description TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, scope_type, scope_id, preference_key)
);

ALTER TABLE public.working_preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own preferences" ON public.working_preferences FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own preferences" ON public.working_preferences FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own preferences" ON public.working_preferences FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own preferences" ON public.working_preferences FOR DELETE USING (auth.uid() = user_id);

CREATE TRIGGER update_working_preferences_updated_at
BEFORE UPDATE ON public.working_preferences
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
