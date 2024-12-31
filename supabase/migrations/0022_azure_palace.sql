/*
  # Fix role management and policies
  
  1. Changes
    - Drop existing policies and functions with CASCADE
    - Add role column with proper constraints
    - Create new admin check function
    - Set up new RLS policies
  
  2. Security
    - Enable RLS policies for role-based access
    - Grant necessary permissions
*/

-- Drop existing policies and functions with CASCADE
DROP POLICY IF EXISTS "authenticated_users_read" ON users CASCADE;
DROP POLICY IF EXISTS "authenticated_users_update" ON users CASCADE;
DROP POLICY IF EXISTS "authenticated_users_insert" ON users CASCADE;
DROP POLICY IF EXISTS "authenticated_courts_read" ON courts CASCADE;
DROP POLICY IF EXISTS "admin_courts_manage" ON courts CASCADE;
DROP FUNCTION IF EXISTS check_is_admin() CASCADE;

-- Drop role column if it exists
ALTER TABLE users DROP COLUMN IF EXISTS role CASCADE;

-- Add role column with proper constraints
ALTER TABLE users ADD COLUMN role text DEFAULT 'member';

-- Update existing users
UPDATE users SET role = 'member' WHERE role IS NULL;

-- Add constraint after setting defaults
ALTER TABLE users 
  ALTER COLUMN role SET NOT NULL,
  ADD CONSTRAINT valid_role CHECK (role IN ('admin', 'member'));

-- Create admin check function
CREATE OR REPLACE FUNCTION check_is_admin()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM users
    WHERE id = auth.uid()
    AND role = 'admin'
  );
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION check_is_admin TO authenticated;

-- Create new policies with unique names
CREATE POLICY "authenticated_users_read_v2"
  ON users FOR SELECT
  TO authenticated
  USING (
    id = auth.uid() OR 
    check_is_admin()
  );

CREATE POLICY "authenticated_users_update_v2"
  ON users FOR UPDATE
  TO authenticated
  USING (
    id = auth.uid() OR 
    check_is_admin()
  );

CREATE POLICY "authenticated_users_insert_v2"
  ON users FOR INSERT
  TO authenticated
  WITH CHECK (id = auth.uid());

-- Courts policies
CREATE POLICY "authenticated_courts_read_v2"
  ON courts FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "admin_courts_manage_v2"
  ON courts FOR ALL
  TO authenticated
  USING (check_is_admin());