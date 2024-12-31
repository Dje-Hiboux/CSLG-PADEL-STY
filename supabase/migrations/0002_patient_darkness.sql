/*
  # Fix users policies

  1. Changes
    - Add policy for inserting new users during signup
    - Fix user role check in admin policies
  
  2. Security
    - Enable inserting for authenticated users
    - Ensure users can only insert their own data
*/

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can insert their profile" ON users;
DROP POLICY IF EXISTS "Admins can view all profiles" ON users;

-- Add new policies
CREATE POLICY "Users can insert their profile"
  ON users FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Admins can view all profiles"
  ON users FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );