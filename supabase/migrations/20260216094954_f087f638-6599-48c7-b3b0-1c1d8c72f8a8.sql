-- Add source_metadata JSONB column to context_items for extraction provenance
ALTER TABLE public.context_items
ADD COLUMN source_metadata jsonb DEFAULT NULL;

COMMENT ON COLUMN public.context_items.source_metadata IS 'Extraction provenance: { pages?: string, chunk_text?: string, section_label?: string, source_document_id?: string }';
