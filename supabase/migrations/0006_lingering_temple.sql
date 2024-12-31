/*
  # Fix users table RLS policies

  1. Changes
    - Simplify RLS policies for users table
    - Ensure authenticated users can read their own data
    - Ensure users with admin role can read all data
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view their own profile" ON users;
DROP POLICY IF EXISTS "Users can insert their profile" ON users;
DROP POLICY IF EXISTS "Users can update their own profile" ON users;
DROP POLICY IF EXISTS "Admins can view all profiles" ON users;

-- Create new simplified policies
CREATE POLICY "Enable read access for authenticated users"
ON users FOR SELECT
TO authenticated
USING (
  id = auth.uid() OR 
  EXISTS (
    SELECT 1 FROM users 
    WHERE users.id = auth.uid() 
    AND users.role = 'admin'
  )
);