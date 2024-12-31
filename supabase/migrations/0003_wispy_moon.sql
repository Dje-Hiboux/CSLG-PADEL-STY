/*
  # Fix recursive RLS policies

  1. Changes
    - Remove recursive admin policy
    - Add simplified policies for user roles
  
  2. Security
    - Users can view their own profile
    - Admins can view all profiles based on auth.jwt() role
    - Users can insert their own profile during signup
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view their own profile" ON users;
DROP POLICY IF EXISTS "Admins can view all profiles" ON users;
DROP POLICY IF EXISTS "Users can insert their profile" ON users;
DROP POLICY IF EXISTS "Users can update their own profile" ON users;

-- Create new policies
CREATE POLICY "Users can view their own profile"
  ON users FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their profile"
  ON users FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON users FOR UPDATE
  USING (auth.uid() = id);

-- Admin policy using JWT claim instead of recursive check
CREATE POLICY "Admins can view all profiles"
  ON users FOR SELECT
  USING (auth.jwt() ->> 'role' = 'admin');