-- Add parent_playbook_id to context_item_bundles
-- When NULL: item is shared across all playbooks in the bundle (injected into every protocol)
-- When set: item belongs exclusively to that playbook's protocol
ALTER TABLE public.context_item_bundles 
ADD COLUMN parent_playbook_id uuid REFERENCES public.context_items(id) ON DELETE SET NULL;

-- Index for efficient lookups during protocol generation
CREATE INDEX idx_cib_parent_playbook ON public.context_item_bundles(parent_playbook_id) WHERE parent_playbook_id IS NOT NULL;