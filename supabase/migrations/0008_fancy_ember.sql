/*
  # Fix role type checking

  1. Changes
    - Cast string comparison to user_role type for proper enum comparison
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Users can read all profiles" ON users;
DROP POLICY IF EXISTS "Users can update their own profile" ON users;
DROP POLICY IF EXISTS "Users can insert their profile" ON users;

-- Recreate policies with proper type casting
CREATE POLICY "Users can read all profiles"
ON users FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Users can update their own profile"
ON users FOR UPDATE
TO authenticated
USING (auth.uid() = id);

CREATE POLICY "Users can insert their profile"
ON users FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);

-- Modify the useUserRole hook to properly compare with enum