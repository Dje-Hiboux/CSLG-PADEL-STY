/*
  # Schéma initial pour l'application Padel

  1. Nouvelles Tables
    - `users` (extension de la table auth.users)
      - `id` (uuid, clé primaire)
      - `first_name` (text)
      - `last_name` (text)
      - `nickname` (text)
      - `role` (text)
      - `is_active` (boolean)
      - `email` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `courts` (terrains de padel)
      - `id` (uuid, clé primaire)
      - `name` (text)
      - `is_active` (boolean)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `bookings` (réservations)
      - `id` (uuid, clé primaire)
      - `court_id` (uuid, référence courts)
      - `user_id` (uuid, référence users)
      - `start_time` (timestamp)
      - `end_time` (timestamp)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Sécurité
    - RLS activé sur toutes les tables
    - Politiques pour la lecture/écriture selon les rôles
*/

-- Create custom types
CREATE TYPE user_role AS ENUM ('admin', 'member', 'guest');

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT auth.uid(),
  first_name text NOT NULL,
  last_name text NOT NULL,
  nickname text,
  role user_role DEFAULT 'member',
  is_active boolean DEFAULT true,
  email text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT users_email_key UNIQUE (email)
);

-- Create courts table
CREATE TABLE IF NOT EXISTS courts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  court_id uuid REFERENCES courts(id) ON DELETE CASCADE,
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  start_time timestamptz NOT NULL,
  end_time timestamptz NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT bookings_time_check CHECK (end_time > start_time),
  CONSTRAINT no_overlapping_bookings UNIQUE (court_id, start_time, end_time)
);

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE courts ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view their own profile"
  ON users FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles"
  ON users FOR SELECT
  USING (
    auth.jwt() ->> 'role' = 'admin'
  );

CREATE POLICY "Users can update their own profile"
  ON users FOR UPDATE
  USING (auth.uid() = id);

-- Courts policies
CREATE POLICY "Anyone can view active courts"
  ON courts FOR SELECT
  USING (is_active = true);

CREATE POLICY "Only admins can manage courts"
  ON courts FOR ALL
  USING (
    auth.jwt() ->> 'role' = 'admin'
  );

-- Bookings policies
CREATE POLICY "Users can view all bookings"
  ON bookings FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create their own bookings"
  ON bookings FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can manage their own bookings"
  ON bookings FOR UPDATE
  USING (auth.uid() = user_id);

-- Insert initial courts
INSERT INTO courts (name) VALUES
  ('Court 1'),
  ('Court 2');