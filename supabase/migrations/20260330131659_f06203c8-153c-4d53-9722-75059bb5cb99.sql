UPDATE storage.buckets 
SET allowed_mime_types = ARRAY[
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'application/zip',
  'application/octet-stream'
]
WHERE id = 'temp-exports';