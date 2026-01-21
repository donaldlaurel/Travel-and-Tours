-- Allow public read access to profiles for displaying review author info
-- Drop existing restrictive policy if it exists
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
DROP POLICY IF EXISTS "Public can view profiles" ON profiles;

-- Create new policy that allows everyone to read profiles (for review display)
CREATE POLICY "Public can view profiles" ON profiles 
  FOR SELECT USING (true);

-- Keep the update and insert policies restricted to own profile
-- These should already exist, but recreate if needed
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;

CREATE POLICY "Users can update their own profile" ON profiles 
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON profiles 
  FOR INSERT WITH CHECK (auth.uid() = id);
