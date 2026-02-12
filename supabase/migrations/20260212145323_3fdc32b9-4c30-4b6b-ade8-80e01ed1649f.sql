-- ═══════════════════════════════════════════════════════
-- MANDATES: Extend context_items + acknowledgment tracking
-- ═══════════════════════════════════════════════════════

-- 1. Enforcement level enum
CREATE TYPE public.mandate_enforcement AS ENUM ('advisory', 'required_ack', 'blocking');

-- 2. Mandate lifecycle enum
CREATE TYPE public.mandate_status AS ENUM ('draft', 'published', 'active', 'superseded', 'revoked');

-- 3. Extend context_items with mandate-specific columns
ALTER TABLE public.context_items
  ADD COLUMN is_mandate boolean NOT NULL DEFAULT false,
  ADD COLUMN mandate_status public.mandate_status DEFAULT NULL,
  ADD COLUMN enforcement_level public.mandate_enforcement DEFAULT NULL,
  ADD COLUMN mandate_scope jsonb DEFAULT NULL,
  ADD COLUMN published_at timestamptz DEFAULT NULL,
  ADD COLUMN published_by uuid DEFAULT NULL,
  ADD COLUMN superseded_by uuid DEFAULT NULL,
  ADD COLUMN mandate_description text DEFAULT NULL;

-- Comment: mandate_scope stores targeting config, e.g.:
-- { "type": "organization" } — broadcast to all
-- { "type": "targeted", "workbook_ids": ["..."], "domain_tags": ["sales"] }

-- 4. Acknowledgment tracking table
CREATE TABLE public.mandate_acknowledgments (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  mandate_id uuid NOT NULL REFERENCES public.context_items(id) ON DELETE CASCADE,
  workbook_id uuid NOT NULL REFERENCES public.workbooks(id) ON DELETE CASCADE,
  acknowledged_by uuid NOT NULL,
  acknowledged_at timestamptz NOT NULL DEFAULT now(),
  status text NOT NULL DEFAULT 'acknowledged',
  notes text DEFAULT NULL,
  UNIQUE(mandate_id, workbook_id)
);

-- 5. Enable RLS on acknowledgments
ALTER TABLE public.mandate_acknowledgments ENABLE ROW LEVEL SECURITY;

-- Leaders/architects can view all acknowledgments
CREATE POLICY "Leaders can view all acknowledgments"
  ON public.mandate_acknowledgments FOR SELECT
  USING (
    has_role(auth.uid(), 'manager'::app_role)
    OR has_role(auth.uid(), 'architect'::app_role)
  );

-- Workbook members can view their workbook's acknowledgments
CREATE POLICY "Members can view own workbook acknowledgments"
  ON public.mandate_acknowledgments FOR SELECT
  USING (
    is_workbook_member(auth.uid(), workbook_id)
    OR is_workbook_owner(auth.uid(), workbook_id)
  );

-- Authenticated users can acknowledge mandates for their workbooks
CREATE POLICY "Users can acknowledge mandates"
  ON public.mandate_acknowledgments FOR INSERT
  WITH CHECK (
    auth.uid() = acknowledged_by
    AND (
      is_workbook_member(auth.uid(), workbook_id)
      OR is_workbook_owner(auth.uid(), workbook_id)
    )
  );

-- Users can update their own acknowledgments
CREATE POLICY "Users can update own acknowledgments"
  ON public.mandate_acknowledgments FOR UPDATE
  USING (auth.uid() = acknowledged_by);

-- 6. Index for fast mandate queries
CREATE INDEX idx_context_items_mandate ON public.context_items (is_mandate, mandate_status)
  WHERE is_mandate = true;

CREATE INDEX idx_mandate_acks_mandate ON public.mandate_acknowledgments (mandate_id);
CREATE INDEX idx_mandate_acks_workbook ON public.mandate_acknowledgments (workbook_id);