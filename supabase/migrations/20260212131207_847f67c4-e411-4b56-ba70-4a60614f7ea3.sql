
-- Create storage bucket for workbook resource files
INSERT INTO storage.buckets (id, name, public) VALUES ('workbook-resources', 'workbook-resources', true);

-- Allow members to upload files to their workbook's folder
CREATE POLICY "Members can upload workbook resource files"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'workbook-resources'
  AND auth.uid() IS NOT NULL
);

-- Allow anyone to view workbook resource files (public bucket)
CREATE POLICY "Workbook resource files are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'workbook-resources');

-- Allow creators to update their uploaded files
CREATE POLICY "Users can update own workbook resource files"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'workbook-resources'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow creators to delete their uploaded files
CREATE POLICY "Users can delete own workbook resource files"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'workbook-resources'
  AND auth.uid()::text = (storage.foldername(name))[1]
);
