/*
  # Add admin role management
  
  1. Changes
    - Add role column to users table
    - Update RLS policies
  
  2. Security
    - Enable RLS policies for admin access
*/

-- Add role column to users table if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'users' 
    AND column_name = 'role'
  ) THEN
    ALTER TABLE users ADD COLUMN role text DEFAULT 'member' CHECK (role IN ('admin', 'member'));
  END IF;
END $$;

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

-- Update RLS policies
DROP POLICY IF EXISTS "Enable read access for all authenticated users" ON users;
DROP POLICY IF EXISTS "Enable update for users based on id" ON users;
DROP POLICY IF EXISTS "Enable insert for users based on id" ON users;
DROP POLICY IF EXISTS "Anyone can view courts" ON courts;

-- Users policies
CREATE POLICY "Users can read their own profile"
  ON users FOR SELECT
  TO authenticated
  USING (
    id = auth.uid() OR 
    check_is_admin()
  );

CREATE POLICY "Users can update their own profile"
  ON users FOR UPDATE
  TO authenticated
  USING (
    id = auth.uid() OR 
    check_is_admin()
  );

CREATE POLICY "Users can insert their profile"
  ON users FOR INSERT
  TO authenticated
  WITH CHECK (id = auth.uid());

-- Courts policies
CREATE POLICY "Anyone can view courts"
  ON courts FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Only admins can manage courts"
  ON courts FOR ALL
  TO authenticated
  USING (check_is_admin());