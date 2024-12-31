/*
  # Add role column and admin policies

  1. Changes
    - Add role column to users table
    - Set default role for existing users
    - Add role constraint
    - Create admin check function
    - Update RLS policies for admin access

  2. Security
    - Enable RLS for users and courts tables
    - Add policies for admin access
*/

-- Drop existing policies first to avoid conflicts
DROP POLICY IF EXISTS "authenticated_users_read_v2" ON users;
DROP POLICY IF EXISTS "authenticated_users_update_v2" ON users;
DROP POLICY IF EXISTS "authenticated_users_insert_v2" ON users;
DROP POLICY IF EXISTS "authenticated_courts_read_v2" ON courts;
DROP POLICY IF EXISTS "admin_courts_manage_v2" ON courts;
DROP FUNCTION IF EXISTS check_is_admin();

-- Add role column if it doesn't exist
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
CREATE POLICY "users_read_policy_v3"
  ON users FOR SELECT
  TO authenticated
  USING (
    id = auth.uid() OR 
    check_is_admin()
  );

CREATE POLICY "users_update_policy_v3"
  ON users FOR UPDATE
  TO authenticated
  USING (
    id = auth.uid() OR 
    check_is_admin()
  );

CREATE POLICY "users_insert_policy_v3"
  ON users FOR INSERT
  TO authenticated
  WITH CHECK (id = auth.uid());

-- Courts policies
CREATE POLICY "courts_read_policy_v3"
  ON courts FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "courts_admin_policy_v3"
  ON courts FOR ALL
  TO authenticated
  USING (check_is_admin());