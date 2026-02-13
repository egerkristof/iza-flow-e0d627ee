
-- Add content_hash column for deduplication
ALTER TABLE public.context_items
ADD COLUMN content_hash text;

-- Create function to generate content hash from title + content
CREATE OR REPLACE FUNCTION public.generate_content_hash(p_title text, p_content text)
RETURNS text
LANGUAGE sql
IMMUTABLE
SET search_path = 'public'
AS $$
  SELECT encode(
    sha256(
      convert_to(
        lower(regexp_replace(COALESCE(p_title, '') || '::' || COALESCE(p_content, ''), '\s+', ' ', 'g')),
        'UTF8'
      )
    ),
    'hex'
  );
$$;

-- Create trigger to auto-maintain content_hash on insert/update
CREATE OR REPLACE FUNCTION public.maintain_content_hash()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = 'public'
AS $$
BEGIN
  NEW.content_hash := generate_content_hash(NEW.title, NEW.content_full);
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_context_items_content_hash
BEFORE INSERT OR UPDATE OF title, content_full ON public.context_items
FOR EACH ROW
EXECUTE FUNCTION public.maintain_content_hash();

-- Backfill existing rows
UPDATE public.context_items
SET content_hash = generate_content_hash(title, content_full)
WHERE content_hash IS NULL;

-- Add unique constraint per owner to prevent exact duplicates
CREATE UNIQUE INDEX idx_context_items_owner_hash
ON public.context_items (owner_id, content_hash);
