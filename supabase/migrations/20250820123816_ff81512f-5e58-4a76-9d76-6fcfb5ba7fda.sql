-- Create storage bucket for story images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('story-images', 'story-images', true, 52428800, ARRAY['image/jpeg', 'image/png', 'image/webp']);

-- Create RLS policies for story images bucket
CREATE POLICY "Allow authenticated users to upload story images"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'story-images' 
  AND auth.uid() IS NOT NULL
);

CREATE POLICY "Allow public read access to story images"
ON storage.objects
FOR SELECT
USING (bucket_id = 'story-images');

CREATE POLICY "Allow users to update their own story images"
ON storage.objects
FOR UPDATE
USING (
  bucket_id = 'story-images' 
  AND auth.uid() IS NOT NULL
);

CREATE POLICY "Allow users to delete their own story images"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'story-images' 
  AND auth.uid() IS NOT NULL
);