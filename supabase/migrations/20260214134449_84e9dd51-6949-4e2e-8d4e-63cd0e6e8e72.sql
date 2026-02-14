
-- AI Prompts table: stores all editable AI system prompts
CREATE TABLE public.ai_prompts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  label text NOT NULL,
  description text,
  function_name text NOT NULL,
  prompt_type text NOT NULL DEFAULT 'system',
  content text NOT NULL,
  model text,
  is_active boolean NOT NULL DEFAULT true,
  version integer NOT NULL DEFAULT 1,
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_by uuid
);

-- Enable RLS
ALTER TABLE public.ai_prompts ENABLE ROW LEVEL SECURITY;

-- Only architects can view prompts
CREATE POLICY "Architects can view prompts"
  ON public.ai_prompts FOR SELECT
  USING (has_role(auth.uid(), 'architect'::app_role));

-- Only architects can update prompts
CREATE POLICY "Architects can update prompts"
  ON public.ai_prompts FOR UPDATE
  USING (has_role(auth.uid(), 'architect'::app_role));

-- Only architects can insert prompts  
CREATE POLICY "Architects can insert prompts"
  ON public.ai_prompts FOR INSERT
  WITH CHECK (has_role(auth.uid(), 'architect'::app_role));

-- Prompt version history for audit trail
CREATE TABLE public.ai_prompt_versions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  prompt_id uuid NOT NULL REFERENCES public.ai_prompts(id) ON DELETE CASCADE,
  version integer NOT NULL,
  content text NOT NULL,
  changed_by uuid,
  change_note text,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.ai_prompt_versions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Architects can view prompt versions"
  ON public.ai_prompt_versions FOR SELECT
  USING (has_role(auth.uid(), 'architect'::app_role));

CREATE POLICY "Architects can insert prompt versions"
  ON public.ai_prompt_versions FOR INSERT
  WITH CHECK (has_role(auth.uid(), 'architect'::app_role));

-- Trigger to auto-update updated_at
CREATE TRIGGER update_ai_prompts_updated_at
  BEFORE UPDATE ON public.ai_prompts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
