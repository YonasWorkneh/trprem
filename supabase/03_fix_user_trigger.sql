-- Fix for stack depth limit exceeded error
-- This file fixes the recursive trigger issue in the handle_new_user function

-- Drop the problematic trigger and function
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Create a safer version that prevents recursion
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Only insert if the user doesn't already exist in public.users
  -- This prevents any potential recursive calls
  INSERT INTO public.users (id, email, name, role)
  SELECT 
    new.id, 
    new.email, 
    new.raw_user_meta_data->>'name', 
    'user'
  WHERE NOT EXISTS (
    SELECT 1 FROM public.users WHERE id = new.id
  );
  
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Also fix the is_admin function to be more efficient and prevent recursion
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  -- Use auth.role() instead of querying users table to prevent recursion
  -- Check if the user has admin role in auth.users metadata
  RETURN (
    SELECT COALESCE(
      raw_user_meta_data->>'role' = 'admin' OR 
      raw_app_meta_data->>'role' = 'admin',
      false
    )
    FROM auth.users 
    WHERE id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Alternative approach: Create a separate admin_users table to avoid recursion
-- Uncomment if the above doesn't work
/*
CREATE TABLE IF NOT EXISTS public.admin_users (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.admin_users 
    WHERE user_id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
*/
