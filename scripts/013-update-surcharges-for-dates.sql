-- Add date range columns to room_surcharges for date-based surcharges
ALTER TABLE room_surcharges ADD COLUMN IF NOT EXISTS surcharge_name TEXT;
ALTER TABLE room_surcharges ADD COLUMN IF NOT EXISTS surcharge_price NUMERIC;
ALTER TABLE room_surcharges ADD COLUMN IF NOT EXISTS start_date DATE;
ALTER TABLE room_surcharges ADD COLUMN IF NOT EXISTS end_date DATE;

-- Update existing records to use new column names if they have data in old columns
UPDATE room_surcharges 
SET surcharge_name = name,
    surcharge_price = price_per_night
WHERE surcharge_name IS NULL AND name IS NOT NULL;

-- Create an index for faster queries on date ranges
CREATE INDEX IF NOT EXISTS idx_room_surcharges_room_type_dates ON room_surcharges(room_type_id, start_date, end_date);
