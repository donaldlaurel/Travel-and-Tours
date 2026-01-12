-- Add role column to profiles table
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin'));

-- Create index for role lookups
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);

-- Update RLS policies to allow admins to manage content

-- Drop existing policies first
DROP POLICY IF EXISTS "Hotels are viewable by everyone" ON hotels;
DROP POLICY IF EXISTS "Hotel images are viewable by everyone" ON hotel_images;
DROP POLICY IF EXISTS "Room types are viewable by everyone" ON room_types;
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can view their own bookings" ON bookings;
DROP POLICY IF EXISTS "Users can create their own bookings" ON bookings;
DROP POLICY IF EXISTS "Users can update their own bookings" ON bookings;
DROP POLICY IF EXISTS "Reviews are viewable by everyone" ON reviews;
DROP POLICY IF EXISTS "Users can create their own reviews" ON reviews;
DROP POLICY IF EXISTS "Users can update their own reviews" ON reviews;
DROP POLICY IF EXISTS "Users can delete their own reviews" ON reviews;

-- Function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() 
    AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Hotels policies (public read, admin write)
CREATE POLICY "Hotels are viewable by everyone" ON hotels FOR SELECT USING (true);
CREATE POLICY "Admins can insert hotels" ON hotels FOR INSERT WITH CHECK (public.is_admin());
CREATE POLICY "Admins can update hotels" ON hotels FOR UPDATE USING (public.is_admin());
CREATE POLICY "Admins can delete hotels" ON hotels FOR DELETE USING (public.is_admin());

-- Hotel images policies (public read, admin write)
CREATE POLICY "Hotel images are viewable by everyone" ON hotel_images FOR SELECT USING (true);
CREATE POLICY "Admins can insert hotel images" ON hotel_images FOR INSERT WITH CHECK (public.is_admin());
CREATE POLICY "Admins can update hotel images" ON hotel_images FOR UPDATE USING (public.is_admin());
CREATE POLICY "Admins can delete hotel images" ON hotel_images FOR DELETE USING (public.is_admin());

-- Room types policies (public read, admin write)
CREATE POLICY "Room types are viewable by everyone" ON room_types FOR SELECT USING (true);
CREATE POLICY "Admins can insert room types" ON room_types FOR INSERT WITH CHECK (public.is_admin());
CREATE POLICY "Admins can update room types" ON room_types FOR UPDATE USING (public.is_admin());
CREATE POLICY "Admins can delete room types" ON room_types FOR DELETE USING (public.is_admin());

-- Profiles policies (users see own, admins see all)
CREATE POLICY "Users can view their own profile" ON profiles FOR SELECT USING (auth.uid() = id OR public.is_admin());
CREATE POLICY "Users can update their own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admins can update any profile" ON profiles FOR UPDATE USING (public.is_admin());
CREATE POLICY "Users can insert their own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Bookings policies (users see own, admins see all)
CREATE POLICY "Users can view their own bookings" ON bookings FOR SELECT USING (auth.uid() = user_id OR public.is_admin());
CREATE POLICY "Users can create their own bookings" ON bookings FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own bookings" ON bookings FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Admins can update any booking" ON bookings FOR UPDATE USING (public.is_admin());
CREATE POLICY "Admins can delete any booking" ON bookings FOR DELETE USING (public.is_admin());

-- Reviews policies (public read, users write own, admins manage all)
CREATE POLICY "Reviews are viewable by everyone" ON reviews FOR SELECT USING (true);
CREATE POLICY "Users can create their own reviews" ON reviews FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own reviews" ON reviews FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Admins can update any review" ON reviews FOR UPDATE USING (public.is_admin());
CREATE POLICY "Users can delete their own reviews" ON reviews FOR DELETE USING (auth.uid() = user_id);
CREATE POLICY "Admins can delete any review" ON reviews FOR DELETE USING (public.is_admin());

-- Update handle_new_user function to include role
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, role)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name', 'user');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
