-- Add sort_order to context_item_bundles to preserve extraction order
ALTER TABLE public.context_item_bundles
ADD COLUMN sort_order integer NOT NULL DEFAULT 0;