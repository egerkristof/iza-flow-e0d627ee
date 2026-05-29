
-- 1. Lock down workbook-resources bucket
UPDATE storage.buckets SET public = false WHERE id = 'workbook-resources';

DROP POLICY IF EXISTS "Workbook resource files are publicly accessible" ON storage.objects;

CREATE POLICY "Workbook members can view workbook resource files"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'workbook-resources'
  AND EXISTS (
    SELECT 1 FROM public.workbook_resources wr
    WHERE wr.file_path = storage.objects.name
      AND (
        public.is_workbook_owner(auth.uid(), wr.workbook_id)
        OR public.is_workbook_member(auth.uid(), wr.workbook_id)
      )
  )
);

-- 2. Lock down temp-exports bucket
UPDATE storage.buckets SET public = false WHERE id = 'temp-exports';

DROP POLICY IF EXISTS "Public read temp-exports" ON storage.objects;
DROP POLICY IF EXISTS "Anon upload temp-exports" ON storage.objects;
DROP POLICY IF EXISTS "Allow anon uploads to temp-exports" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated upload temp-exports" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated uploads to temp-exports" ON storage.objects;

CREATE POLICY "Users can view own temp-exports"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'temp-exports'
  AND (auth.uid())::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can upload own temp-exports"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'temp-exports'
  AND (auth.uid())::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete own temp-exports"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'temp-exports'
  AND (auth.uid())::text = (storage.foldername(name))[1]
);
