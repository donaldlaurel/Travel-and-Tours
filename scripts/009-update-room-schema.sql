-- Add new columns to room_types table
ALTER TABLE room_types ADD COLUMN IF NOT EXISTS max_adults INTEGER NOT NULL DEFAULT 2;
ALTER TABLE room_types ADD COLUMN IF NOT EXISTS max_children INTEGER NOT NULL DEFAULT 0;
ALTER TABLE room_types ADD COLUMN IF NOT EXISTS breakfast_included INTEGER NOT NULL DEFAULT 0;
ALTER TABLE room_types ADD COLUMN IF NOT EXISTS base_price DECIMAL(10, 2);

-- Update base_price with current price_per_night
UPDATE room_types SET base_price = price_per_night WHERE base_price IS NULL;

-- Create room_rates table for daily pricing
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

-- Create index for room_rates
CREATE INDEX IF NOT EXISTS idx_room_rates_room_type_id ON room_rates(room_type_id);
CREATE INDEX IF NOT EXISTS idx_room_rates_date ON room_rates(date);

-- Enable RLS for room_rates
ALTER TABLE room_rates ENABLE ROW LEVEL SECURITY;

-- RLS Policies for room_rates (public read, admin write)
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

-- Remove price_per_night from hotels table (prices are now on rooms)
ALTER TABLE hotels DROP COLUMN IF EXISTS price_per_night;

-- Add child_policy to hotels if not exists
ALTER TABLE hotels ADD COLUMN IF NOT EXISTS child_policy TEXT DEFAULT 'Children of all ages are welcome';
