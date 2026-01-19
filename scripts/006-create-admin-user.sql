-- IMPORTANT: Run this script AFTER creating the admin user via Supabase Auth
-- 
-- Default Admin Credentials:
-- Email: admin@tmjph.com
-- Password: Admin@123456
--
-- Steps to create admin:
-- 1. Go to the Sign Up page and create an account with the above credentials
-- 2. Verify the email (check inbox or use Supabase dashboard to confirm)
-- 3. Run this script to promote the user to admin role

-- Promote user to admin by email
UPDATE profiles 
SET role = 'admin' 
WHERE id = (
  SELECT id FROM auth.users WHERE email = 'admin@tmjph.com'
);

-- Alternative: If you need to create multiple admins, use this pattern:
-- UPDATE profiles SET role = 'admin' WHERE id = (SELECT id FROM auth.users WHERE email = 'your-email@example.com');
