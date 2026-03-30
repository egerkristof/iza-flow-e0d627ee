CREATE POLICY "Allow authenticated uploads to temp-exports"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'temp-exports');

CREATE POLICY "Allow anon uploads to temp-exports"
ON storage.objects FOR INSERT
TO anon
WITH CHECK (bucket_id = 'temp-exports');