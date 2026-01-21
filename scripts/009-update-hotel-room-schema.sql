-- Add child_policy to hotels table and remove price_per_night
ALTER TABLE hotels ADD COLUMN IF NOT EXISTS child_policy TEXT DEFAULT 'Children of all ages are welcome';

-- Update room_types table with capacity fields
ALTER TABLE room_types ADD COLUMN IF NOT EXISTS max_adults INTEGER DEFAULT 2;
ALTER TABLE room_types ADD COLUMN IF NOT EXISTS max_children INTEGER DEFAULT 2;
ALTER TABLE room_types ADD COLUMN IF NOT EXISTS breakfast_included INTEGER DEFAULT 0;
ALTER TABLE room_types ADD COLUMN IF NOT EXISTS base_price DECIMAL(10, 2);

-- Set base_price from existing price_per_night
UPDATE room_types SET base_price = price_per_night WHERE base_price IS NULL;

-- Create room_rates table for calendar-based pricing
CREATE TABLE IF NOT EXISTS room_rates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_type_id UUID NOT NULL REFERENCES room_types(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  available_rooms INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(room_type_id, date)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_room_rates_room_type_id ON room_rates(room_type_id);
CREATE INDEX IF NOT EXISTS idx_room_rates_date ON room_rates(date);

-- Enable RLS
ALTER TABLE room_rates ENABLE ROW LEVEL SECURITY;

-- RLS Policies for room_rates (public read)
DROP POLICY IF EXISTS "Room rates are viewable by everyone" ON room_rates;
CREATE POLICY "Room rates are viewable by everyone" ON room_rates FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins can insert room rates" ON room_rates;
CREATE POLICY "Admins can insert room rates" ON room_rates FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

DROP POLICY IF EXISTS "Admins can update room rates" ON room_rates;
CREATE POLICY "Admins can update room rates" ON room_rates FOR UPDATE USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

DROP POLICY IF EXISTS "Admins can delete room rates" ON room_rates;
CREATE POLICY "Admins can delete room rates" ON room_rates FOR DELETE USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
