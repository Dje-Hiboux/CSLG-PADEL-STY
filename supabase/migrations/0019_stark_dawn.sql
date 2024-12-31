/*
  # Suppression de la gestion des rôles admin

  1. Modifications
    - Suppression des politiques existantes
    - Suppression de la fonction check_is_admin
    - Suppression de la colonne role avec CASCADE
    - Création de nouvelles politiques simplifiées

  2. Sécurité
    - Nouvelles politiques basées uniquement sur l'authentification
*/

-- Supprimer la fonction check_is_admin
DROP FUNCTION IF EXISTS check_is_admin();

-- Supprimer les politiques existantes
DROP POLICY IF EXISTS "Users can read all profiles" ON users;
DROP POLICY IF EXISTS "Users can update their own profile" ON users;
DROP POLICY IF EXISTS "Users can insert their profile" ON users;
DROP POLICY IF EXISTS "Only admins can manage courts" ON courts;
DROP POLICY IF EXISTS "Anyone can view active courts" ON courts;

-- Supprimer la colonne role avec CASCADE
ALTER TABLE users DROP COLUMN IF EXISTS role CASCADE;

-- Créer de nouvelles politiques simplifiées
CREATE POLICY "Enable read access for all authenticated users"
ON users FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Enable update for users based on id"
ON users FOR UPDATE
TO authenticated
USING (auth.uid() = id);

CREATE POLICY "Enable insert for users based on id"
ON users FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);

-- Mettre à jour les politiques des courts
CREATE POLICY "Anyone can view courts"
ON courts FOR SELECT
TO authenticated
USING (true);