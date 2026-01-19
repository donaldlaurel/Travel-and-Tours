-- Create storage bucket for hotel and room images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'images',
  'images',
  true,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 5242880,
  allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

-- Policy: Anyone can view images (public bucket)
CREATE POLICY "Public can view images"
ON storage.objects FOR SELECT
USING (bucket_id = 'images');

-- Policy: Admins can upload images
CREATE POLICY "Admins can upload images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'images' 
  AND EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
    AND role = 'admin'
  )
);

-- Policy: Admins can update images
CREATE POLICY "Admins can update images"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'images' 
  AND EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
    AND role = 'admin'
  )
);

-- Policy: Admins can delete images
CREATE POLICY "Admins can delete images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'images' 
  AND EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
    AND role = 'admin'
  )
);
