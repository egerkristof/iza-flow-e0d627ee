
-- ═══════════════════════════════════════════════════════════════════
-- PROTOCOL EXECUTION SCHEMA
-- Hybrid model: Bundle scopes context, Playbook drives execution
-- ═══════════════════════════════════════════════════════════════════

-- Status enum for protocol executions
CREATE TYPE public.protocol_execution_status AS ENUM (
  'not_started', 'in_progress', 'paused', 'completed', 'abandoned'
);

-- Status enum for step executions
CREATE TYPE public.step_execution_status AS ENUM (
  'pending', 'in_progress', 'completed', 'skipped', 'blocked'
);

-- Capture type enum
CREATE TYPE public.capture_type AS ENUM (
  'friction', 'drift', 'best_practice', 'learning', 'enhancement', 'exception'
);

-- ─── 1. Workbook Protocols ─────────────────────────────────────────
-- Auto-generated when a bundle with PLAYBOOKs is deployed to a workbook
CREATE TABLE public.workbook_protocols (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  workbook_id UUID NOT NULL REFERENCES public.workbooks(id) ON DELETE CASCADE,
  bundle_id UUID NOT NULL REFERENCES public.bundles(id) ON DELETE CASCADE,
  source_playbook_id UUID NOT NULL REFERENCES public.context_items(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(workbook_id, source_playbook_id)
);

-- ─── 2. Protocol Steps ─────────────────────────────────────────────
-- Derived from PROCEDURE items; DIRECTIVE items become compliance gates
CREATE TABLE public.protocol_steps (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  protocol_id UUID NOT NULL REFERENCES public.workbook_protocols(id) ON DELETE CASCADE,
  source_item_id UUID REFERENCES public.context_items(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  step_type TEXT NOT NULL DEFAULT 'action', -- 'action', 'gate', 'checkpoint', 'review'
  step_order INTEGER NOT NULL DEFAULT 0,
  is_required BOOLEAN NOT NULL DEFAULT true,
  gate_enforcement TEXT, -- for directive gates: 'advisory', 'required_ack', 'blocking'
  agent_prompt TEXT, -- optional AI guidance for this step
  estimated_minutes INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ─── 3. Protocol Context Items ─────────────────────────────────────
-- Links RESEARCH, PRINCIPLE, KNOWLEDGE items as context for the protocol
CREATE TABLE public.protocol_context_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  protocol_id UUID NOT NULL REFERENCES public.workbook_protocols(id) ON DELETE CASCADE,
  context_item_id UUID NOT NULL REFERENCES public.context_items(id) ON DELETE CASCADE,
  injection_scope TEXT NOT NULL DEFAULT 'always', -- 'always', 'step_specific', 'on_demand'
  step_id UUID REFERENCES public.protocol_steps(id) ON DELETE SET NULL, -- for step_specific
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(protocol_id, context_item_id)
);

-- ─── 4. Protocol Executions ────────────────────────────────────────
-- Tracks an operator's run through a protocol
CREATE TABLE public.protocol_executions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  protocol_id UUID NOT NULL REFERENCES public.workbook_protocols(id) ON DELETE CASCADE,
  workbook_id UUID NOT NULL REFERENCES public.workbooks(id) ON DELETE CASCADE,
  executed_by UUID NOT NULL,
  status protocol_execution_status NOT NULL DEFAULT 'not_started',
  current_step_id UUID REFERENCES public.protocol_steps(id),
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  drift_score NUMERIC DEFAULT 0,
  compliance_score NUMERIC DEFAULT 1.0,
  notes TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ─── 5. Step Executions ────────────────────────────────────────────
-- Tracks completion of individual steps within an execution
CREATE TABLE public.step_executions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  execution_id UUID NOT NULL REFERENCES public.protocol_executions(id) ON DELETE CASCADE,
  step_id UUID NOT NULL REFERENCES public.protocol_steps(id) ON DELETE CASCADE,
  status step_execution_status NOT NULL DEFAULT 'pending',
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  gate_acknowledged BOOLEAN DEFAULT false,
  gate_acknowledged_by UUID,
  gate_acknowledged_at TIMESTAMPTZ,
  output_notes TEXT,
  output_chat_id UUID REFERENCES public.workbook_chats(id),
  output_task_ids UUID[] DEFAULT '{}',
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(execution_id, step_id)
);

-- ─── 6. Execution Captures ─────────────────────────────────────────
-- Knowledge captured during execution for the feedback loop
CREATE TABLE public.execution_captures (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  execution_id UUID NOT NULL REFERENCES public.protocol_executions(id) ON DELETE CASCADE,
  step_id UUID REFERENCES public.protocol_steps(id),
  captured_by UUID NOT NULL,
  capture_type capture_type NOT NULL DEFAULT 'learning',
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  severity TEXT DEFAULT 'info', -- 'info', 'warning', 'critical'
  resolution_status TEXT DEFAULT 'open', -- 'open', 'acknowledged', 'resolved', 'promoted'
  promoted_to_item_id UUID REFERENCES public.context_items(id),
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ═══════════════════════════════════════════════════════════════════
-- RLS POLICIES
-- ═══════════════════════════════════════════════════════════════════

ALTER TABLE public.workbook_protocols ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.protocol_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.protocol_context_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.protocol_executions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.step_executions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.execution_captures ENABLE ROW LEVEL SECURITY;

-- workbook_protocols: viewable by workbook members + architects
CREATE POLICY "Members can view protocols" ON public.workbook_protocols
  FOR SELECT USING (
    workbook_id IN (SELECT user_accessible_workbook_ids(auth.uid()))
    OR has_role(auth.uid(), 'architect'::app_role)
  );

CREATE POLICY "Owners/architects can manage protocols" ON public.workbook_protocols
  FOR INSERT WITH CHECK (
    is_workbook_owner(auth.uid(), workbook_id)
    OR has_role(auth.uid(), 'architect'::app_role)
  );

CREATE POLICY "Owners/architects can update protocols" ON public.workbook_protocols
  FOR UPDATE USING (
    is_workbook_owner(auth.uid(), workbook_id)
    OR has_role(auth.uid(), 'architect'::app_role)
  );

CREATE POLICY "Owners/architects can delete protocols" ON public.workbook_protocols
  FOR DELETE USING (
    is_workbook_owner(auth.uid(), workbook_id)
    OR has_role(auth.uid(), 'architect'::app_role)
  );

-- protocol_steps: inherit from protocol's workbook access
CREATE POLICY "Members can view steps" ON public.protocol_steps
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.workbook_protocols wp
      WHERE wp.id = protocol_steps.protocol_id
      AND (wp.workbook_id IN (SELECT user_accessible_workbook_ids(auth.uid()))
           OR has_role(auth.uid(), 'architect'::app_role))
    )
  );

CREATE POLICY "Owners/architects can manage steps" ON public.protocol_steps
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.workbook_protocols wp
      WHERE wp.id = protocol_steps.protocol_id
      AND (is_workbook_owner(auth.uid(), wp.workbook_id)
           OR has_role(auth.uid(), 'architect'::app_role))
    )
  );

CREATE POLICY "Owners/architects can update steps" ON public.protocol_steps
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.workbook_protocols wp
      WHERE wp.id = protocol_steps.protocol_id
      AND (is_workbook_owner(auth.uid(), wp.workbook_id)
           OR has_role(auth.uid(), 'architect'::app_role))
    )
  );

CREATE POLICY "Owners/architects can delete steps" ON public.protocol_steps
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.workbook_protocols wp
      WHERE wp.id = protocol_steps.protocol_id
      AND (is_workbook_owner(auth.uid(), wp.workbook_id)
           OR has_role(auth.uid(), 'architect'::app_role))
    )
  );

-- protocol_context_items: same pattern
CREATE POLICY "Members can view protocol context" ON public.protocol_context_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.workbook_protocols wp
      WHERE wp.id = protocol_context_items.protocol_id
      AND (wp.workbook_id IN (SELECT user_accessible_workbook_ids(auth.uid()))
           OR has_role(auth.uid(), 'architect'::app_role))
    )
  );

CREATE POLICY "Owners/architects can manage protocol context" ON public.protocol_context_items
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.workbook_protocols wp
      WHERE wp.id = protocol_context_items.protocol_id
      AND (is_workbook_owner(auth.uid(), wp.workbook_id)
           OR has_role(auth.uid(), 'architect'::app_role))
    )
  );

CREATE POLICY "Owners/architects can delete protocol context" ON public.protocol_context_items
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.workbook_protocols wp
      WHERE wp.id = protocol_context_items.protocol_id
      AND (is_workbook_owner(auth.uid(), wp.workbook_id)
           OR has_role(auth.uid(), 'architect'::app_role))
    )
  );

-- protocol_executions: viewable by executor + workbook owners + managers/architects
CREATE POLICY "Users can view own executions" ON public.protocol_executions
  FOR SELECT USING (
    auth.uid() = executed_by
    OR is_workbook_owner(auth.uid(), workbook_id)
    OR has_role(auth.uid(), 'manager'::app_role)
    OR has_role(auth.uid(), 'architect'::app_role)
  );

CREATE POLICY "Members can create executions" ON public.protocol_executions
  FOR INSERT WITH CHECK (
    auth.uid() = executed_by
    AND workbook_id IN (SELECT user_accessible_workbook_ids(auth.uid()))
  );

CREATE POLICY "Users can update own executions" ON public.protocol_executions
  FOR UPDATE USING (
    auth.uid() = executed_by
    OR is_workbook_owner(auth.uid(), workbook_id)
  );

-- step_executions: through execution ownership
CREATE POLICY "Users can view step executions" ON public.step_executions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.protocol_executions pe
      WHERE pe.id = step_executions.execution_id
      AND (pe.executed_by = auth.uid()
           OR is_workbook_owner(auth.uid(), pe.workbook_id)
           OR has_role(auth.uid(), 'manager'::app_role)
           OR has_role(auth.uid(), 'architect'::app_role))
    )
  );

CREATE POLICY "Executors can manage step executions" ON public.step_executions
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.protocol_executions pe
      WHERE pe.id = step_executions.execution_id
      AND pe.executed_by = auth.uid()
    )
  );

CREATE POLICY "Executors can update step executions" ON public.step_executions
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.protocol_executions pe
      WHERE pe.id = step_executions.execution_id
      AND pe.executed_by = auth.uid()
    )
  );

-- execution_captures: viewable by capturer + workbook owners + architects
CREATE POLICY "Users can view captures" ON public.execution_captures
  FOR SELECT USING (
    auth.uid() = captured_by
    OR EXISTS (
      SELECT 1 FROM public.protocol_executions pe
      WHERE pe.id = execution_captures.execution_id
      AND (is_workbook_owner(auth.uid(), pe.workbook_id)
           OR has_role(auth.uid(), 'architect'::app_role)
           OR has_role(auth.uid(), 'manager'::app_role))
    )
  );

CREATE POLICY "Executors can create captures" ON public.execution_captures
  FOR INSERT WITH CHECK (
    auth.uid() = captured_by
    AND EXISTS (
      SELECT 1 FROM public.protocol_executions pe
      WHERE pe.id = execution_captures.execution_id
      AND pe.executed_by = auth.uid()
    )
  );

CREATE POLICY "Users can update own captures" ON public.execution_captures
  FOR UPDATE USING (
    auth.uid() = captured_by
    OR EXISTS (
      SELECT 1 FROM public.protocol_executions pe
      WHERE pe.id = execution_captures.execution_id
      AND has_role(auth.uid(), 'architect'::app_role)
    )
  );

-- ═══════════════════════════════════════════════════════════════════
-- TRIGGERS
-- ═══════════════════════════════════════════════════════════════════

CREATE TRIGGER update_workbook_protocols_updated_at
  BEFORE UPDATE ON public.workbook_protocols
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_protocol_steps_updated_at
  BEFORE UPDATE ON public.protocol_steps
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_protocol_executions_updated_at
  BEFORE UPDATE ON public.protocol_executions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_step_executions_updated_at
  BEFORE UPDATE ON public.step_executions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_execution_captures_updated_at
  BEFORE UPDATE ON public.execution_captures
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
