-- Fix for RLS policies causing stack depth limit exceeded
-- This file updates the RLS policies to avoid recursive calls

-- Drop existing problematic policies
DROP POLICY IF EXISTS "Admins can view all users" ON public.users;
DROP POLICY IF EXISTS "Admins can update all users" ON public.users;

-- Create a more efficient is_admin function that doesn't query users table
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  -- Check auth.users metadata directly to avoid recursion
  DECLARE
    user_role TEXT;
  BEGIN
    SELECT 
      COALESCE(
        raw_user_meta_data->>'role',
        raw_app_meta_data->>'role',
        'user'
      ) INTO user_role
    FROM auth.users 
    WHERE id = auth.uid();
    
    RETURN user_role = 'admin';
  EXCEPTION 
    WHEN OTHERS THEN
      RETURN FALSE;
  END;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Alternative: Use JWT claims if available
-- CREATE OR REPLACE FUNCTION public.is_admin()
-- RETURNS BOOLEAN AS $$
-- BEGIN
--   -- Check if the JWT contains admin role claim
--   RETURN auth.jwt() ->> 'role' = 'admin';
-- END;
-- $$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate admin policies with the fixed function
CREATE POLICY "Admins can view all users" ON public.users
    FOR SELECT USING (is_admin());

CREATE POLICY "Admins can update all users" ON public.users
    FOR UPDATE USING (is_admin());

-- Also create a policy for admins to insert users (needed for some operations)
CREATE POLICY "Admins can insert users" ON public.users
    FOR INSERT WITH CHECK (is_admin());

-- Add a bypass for system functions
CREATE POLICY "System bypass for user operations" ON public.users
    FOR ALL USING (auth.role() = 'service_role');

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO service_role;
GRANT ALL ON public.users TO service_role;
