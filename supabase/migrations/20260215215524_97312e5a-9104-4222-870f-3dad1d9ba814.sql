
-- Research templates: reusable multi-step research agent configurations
CREATE TABLE public.research_templates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  owner_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  research_type TEXT NOT NULL DEFAULT 'general',
  -- Agent configuration
  agent_model TEXT NOT NULL DEFAULT 'google/gemini-2.5-flash',
  agent_system_prompt TEXT,
  -- Multi-step definition as JSON array of steps
  -- Each step: { title, instruction, output_format?, tool_hints?: string[] }
  steps JSONB NOT NULL DEFAULT '[]'::jsonb,
  -- Metadata
  tags TEXT[] DEFAULT '{}',
  estimated_minutes INTEGER,
  is_public BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.research_templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own templates"
  ON public.research_templates FOR SELECT
  USING (auth.uid() = owner_id OR is_public = true);

CREATE POLICY "Users can create templates"
  ON public.research_templates FOR INSERT
  WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Users can update own templates"
  ON public.research_templates FOR UPDATE
  USING (auth.uid() = owner_id);

CREATE POLICY "Users can delete own templates"
  ON public.research_templates FOR DELETE
  USING (auth.uid() = owner_id);

-- Add research_template_id to protocol_steps so steps can reference a template
ALTER TABLE public.protocol_steps
  ADD COLUMN research_template_id UUID REFERENCES public.research_templates(id) ON DELETE SET NULL;

-- Trigger for updated_at
CREATE TRIGGER update_research_templates_updated_at
  BEFORE UPDATE ON public.research_templates
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
