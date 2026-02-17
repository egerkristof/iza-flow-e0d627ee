
-- Knowledge Sources: living, editable documents that sit before extraction
CREATE TABLE public.knowledge_sources (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  owner_id uuid NOT NULL,
  title text NOT NULL,
  description text,
  content text NOT NULL DEFAULT '',
  source_type text NOT NULL DEFAULT 'blank',  -- 'blank', 'from_upload', 'from_extraction'
  original_document_id uuid REFERENCES public.personal_documents(id) ON DELETE SET NULL,
  domain_tag text,  -- optional domain association
  status text NOT NULL DEFAULT 'draft',  -- 'draft', 'active', 'archived'
  tags text[] DEFAULT '{}',
  metadata jsonb DEFAULT '{}',
  current_version integer NOT NULL DEFAULT 1,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Version history for knowledge sources
CREATE TABLE public.knowledge_source_versions (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  source_id uuid NOT NULL REFERENCES public.knowledge_sources(id) ON DELETE CASCADE,
  version_number integer NOT NULL DEFAULT 1,
  content text NOT NULL DEFAULT '',
  change_note text,
  changed_by uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(source_id, version_number)
);

-- Enable RLS
ALTER TABLE public.knowledge_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.knowledge_source_versions ENABLE ROW LEVEL SECURITY;

-- Knowledge sources RLS
CREATE POLICY "Users can view own sources"
ON public.knowledge_sources FOR SELECT
USING (auth.uid() = owner_id);

CREATE POLICY "Users can create own sources"
ON public.knowledge_sources FOR INSERT
WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Users can update own sources"
ON public.knowledge_sources FOR UPDATE
USING (auth.uid() = owner_id);

CREATE POLICY "Users can delete own sources"
ON public.knowledge_sources FOR DELETE
USING (auth.uid() = owner_id);

-- Knowledge source versions RLS
CREATE POLICY "Users can view own source versions"
ON public.knowledge_source_versions FOR SELECT
USING (EXISTS (
  SELECT 1 FROM public.knowledge_sources ks WHERE ks.id = knowledge_source_versions.source_id AND ks.owner_id = auth.uid()
));

CREATE POLICY "Users can create own source versions"
ON public.knowledge_source_versions FOR INSERT
WITH CHECK (EXISTS (
  SELECT 1 FROM public.knowledge_sources ks WHERE ks.id = knowledge_source_versions.source_id AND ks.owner_id = auth.uid()
));

-- Indexes
CREATE INDEX idx_knowledge_sources_owner ON public.knowledge_sources(owner_id);
CREATE INDEX idx_knowledge_source_versions_source ON public.knowledge_source_versions(source_id);

-- Trigger for updated_at
CREATE TRIGGER update_knowledge_sources_updated_at
BEFORE UPDATE ON public.knowledge_sources
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Add lineage columns to context_items for P0 provenance tracking
ALTER TABLE public.context_items
ADD COLUMN IF NOT EXISTS source_knowledge_id uuid REFERENCES public.knowledge_sources(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS source_section_ref text,
ADD COLUMN IF NOT EXISTS extraction_version integer;
