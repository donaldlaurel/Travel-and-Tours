-- Create room_images table for storing gallery images for room types
CREATE TABLE room_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_type_id UUID NOT NULL REFERENCES room_types(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  alt_text TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX idx_room_images_room_type_id ON room_images(room_type_id);

-- Enable RLS
ALTER TABLE room_images ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Room images are viewable by everyone
CREATE POLICY "Room images are viewable by everyone" ON room_images FOR SELECT USING (true);

-- RLS Policy: Admins can manage room images (protected via application logic)
CREATE POLICY "Authenticated users can manage room images" ON room_images FOR ALL USING (
  auth.role() = 'authenticated'
) WITH CHECK (
  auth.role() = 'authenticated'
);
