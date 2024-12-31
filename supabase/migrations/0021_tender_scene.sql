/*
  # Add role management and admin policies
  
  1. Changes
    - Add role column to users table
    - Create admin check function
    - Update RLS policies for role-based access
  
  2. Security
    - Enable RLS policies for admin access
    - Grant necessary permissions
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Enable read access for all authenticated users" ON users;
DROP POLICY IF EXISTS "Enable update for users based on id" ON users;
DROP POLICY IF EXISTS "Enable insert for users based on id" ON users;
DROP POLICY IF EXISTS "Anyone can view courts" ON courts;

-- Add role column to users table if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'users' 
    AND column_name = 'role'
  ) THEN
    -- Add the column with a default value
    ALTER TABLE users ADD COLUMN role text DEFAULT 'member';
    
    -- Update existing users
    UPDATE users SET role = 'member' WHERE role IS NULL;
    
    -- Add constraint after setting defaults
    ALTER TABLE users 
      ALTER COLUMN role SET NOT NULL,
      ADD CONSTRAINT valid_role CHECK (role IN ('admin', 'member'));
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

-- Create new policies with unique names
CREATE POLICY "authenticated_users_read"
  ON users FOR SELECT
  TO authenticated
  USING (
    id = auth.uid() OR 
    check_is_admin()
  );

CREATE POLICY "authenticated_users_update"
  ON users FOR UPDATE
  TO authenticated
  USING (
    id = auth.uid() OR 
    check_is_admin()
  );

CREATE POLICY "authenticated_users_insert"
  ON users FOR INSERT
  TO authenticated
  WITH CHECK (id = auth.uid());

-- Courts policies
CREATE POLICY "authenticated_courts_read"
  ON courts FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "admin_courts_manage"
  ON courts FOR ALL
  TO authenticated
  USING (check_is_admin());