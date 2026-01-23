-- Create room_surcharges table
CREATE TABLE IF NOT EXISTS room_surcharges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_type_id UUID NOT NULL REFERENCES room_types(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  price_per_night NUMERIC NOT NULL DEFAULT 0,
  minimum_nights INTEGER NOT NULL DEFAULT 1,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create room_extra_person table
ALTER TABLE room_types ADD COLUMN IF NOT EXISTS extra_person_count INTEGER DEFAULT 0;
ALTER TABLE room_types ADD COLUMN IF NOT EXISTS extra_person_price NUMERIC DEFAULT 0;
ALTER TABLE room_types ADD COLUMN IF NOT EXISTS extra_person_breakfast BOOLEAN DEFAULT FALSE;

-- Enable RLS
ALTER TABLE room_surcharges ENABLE ROW LEVEL SECURITY;

-- RLS Policies for room_surcharges
CREATE POLICY "Surcharges are viewable by everyone"
  ON room_surcharges FOR SELECT
  USING (true);

CREATE POLICY "Admins can insert surcharges"
  ON room_surcharges FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can update surcharges"
  ON room_surcharges FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can delete surcharges"
  ON room_surcharges FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );
