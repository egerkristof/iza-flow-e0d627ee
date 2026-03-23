-- Create a public bucket for temporary presentation exports
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('temp-exports', 'temp-exports', true, 52428800, ARRAY['application/vnd.openxmlformats-officedocument.presentationml.presentation']);

-- Allow anyone to read from temp-exports
CREATE POLICY "Public read temp-exports" ON storage.objects
  FOR SELECT TO public
  USING (bucket_id = 'temp-exports');

-- Allow authenticated users to upload to temp-exports
CREATE POLICY "Authenticated upload temp-exports" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'temp-exports');

-- Allow anon users to upload too (for unauthenticated deck viewers)  
CREATE POLICY "Anon upload temp-exports" ON storage.objects
  FOR INSERT TO anon
  WITH CHECK (bucket_id = 'temp-exports');