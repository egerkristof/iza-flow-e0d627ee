
-- Phase 1: Add output specification fields to protocol_steps
-- These fields constrain AI generation and define what each step produces

ALTER TABLE public.protocol_steps
ADD COLUMN output_type text DEFAULT 'free_text',
ADD COLUMN output_description text;

-- Add a comment for documentation
COMMENT ON COLUMN public.protocol_steps.output_type IS 'Type of draft artifact this step produces: email_draft, slide_outline, document_section, checklist, analysis_brief, call_prep, proposal_section, free_text';
COMMENT ON COLUMN public.protocol_steps.output_description IS 'Human-readable description of what this step should produce, e.g. "Pricing rationale email to client after discovery call"';

-- Also add output hints to context_items (procedures) so extraction can capture them
ALTER TABLE public.context_items
ADD COLUMN output_type text,
ADD COLUMN output_description text;

COMMENT ON COLUMN public.context_items.output_type IS 'For PROCEDURE items: what type of artifact this procedure produces';
COMMENT ON COLUMN public.context_items.output_description IS 'For PROCEDURE items: description of the expected output';
