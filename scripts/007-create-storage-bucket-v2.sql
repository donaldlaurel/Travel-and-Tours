-- Create storage bucket for images (if not exists)
INSERT INTO storage.buckets (id, name, public)
VALUES ('images', 'images', true)
ON CONFLICT (id) DO NOTHING;

-- Drop existing policies first
DROP POLICY IF EXISTS "Public can view images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can upload images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can update images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete images" ON storage.objects;

-- Allow public read access to images
CREATE POLICY "Public can view images"
ON storage.objects FOR SELECT
USING (bucket_id = 'images');

-- Allow admins to upload images
CREATE POLICY "Admins can upload images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'images' 
  AND EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() 
    AND role = 'admin'
  )
);

-- Allow admins to update images
CREATE POLICY "Admins can update images"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'images' 
  AND EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() 
    AND role = 'admin'
  )
);

-- Allow admins to delete images
CREATE POLICY "Admins can delete images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'images' 
  AND EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() 
    AND role = 'admin'
  )
);
