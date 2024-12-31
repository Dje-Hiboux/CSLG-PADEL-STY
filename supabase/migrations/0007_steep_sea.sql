/*
  # Fix infinite recursion in users RLS policies

  1. Changes
    - Simplify RLS policies to avoid recursion
    - Allow authenticated users to read their own data
    - Allow all authenticated users to read basic user data
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON users;

-- Create new non-recursive policies
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