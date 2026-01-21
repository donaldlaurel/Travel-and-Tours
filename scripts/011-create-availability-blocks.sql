-- Availability blocks table for custom date ranges
-- Can be used to block dates for hotels (all rooms) or specific room types
CREATE TABLE IF NOT EXISTS availability_blocks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hotel_id UUID NOT NULL REFERENCES hotels(id) ON DELETE CASCADE,
  room_type_id UUID REFERENCES room_types(id) ON DELETE CASCADE,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  block_type TEXT NOT NULL DEFAULT 'blocked' CHECK (block_type IN ('blocked', 'maintenance', 'renovation', 'seasonal_closure', 'special_event')),
  reason TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT valid_date_range CHECK (end_date >= start_date)
);

-- Create indexes for efficient querying
CREATE INDEX IF NOT EXISTS idx_availability_blocks_hotel ON availability_blocks(hotel_id);
CREATE INDEX IF NOT EXISTS idx_availability_blocks_room ON availability_blocks(room_type_id);
CREATE INDEX IF NOT EXISTS idx_availability_blocks_dates ON availability_blocks(start_date, end_date);

-- Enable RLS
ALTER TABLE availability_blocks ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Everyone can read availability blocks (needed for availability checking)
DROP POLICY IF EXISTS "Availability blocks are viewable by everyone" ON availability_blocks;
CREATE POLICY "Availability blocks are viewable by everyone" 
  ON availability_blocks FOR SELECT USING (true);

-- Only admins can manage availability blocks
DROP POLICY IF EXISTS "Admins can insert availability blocks" ON availability_blocks;
CREATE POLICY "Admins can insert availability blocks" 
  ON availability_blocks FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

DROP POLICY IF EXISTS "Admins can update availability blocks" ON availability_blocks;
CREATE POLICY "Admins can update availability blocks" 
  ON availability_blocks FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

DROP POLICY IF EXISTS "Admins can delete availability blocks" ON availability_blocks;
CREATE POLICY "Admins can delete availability blocks" 
  ON availability_blocks FOR DELETE 
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );
