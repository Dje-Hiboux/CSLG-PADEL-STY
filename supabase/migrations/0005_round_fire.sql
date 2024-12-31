/*
  # Configuration du stockage des avatars

  1. Modifications
    - Mise à jour du bucket 'avatars' pour le rendre public
    - Ajout des politiques manquantes pour le bucket

  Note: Les politiques existantes sont ignorées pour éviter les conflits
*/

-- Update avatars bucket to be public if it exists
UPDATE storage.buckets 
SET public = true 
WHERE id = 'avatars';

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Anyone can view avatars" ON storage.objects;

-- Create new policy for public access
CREATE POLICY "Anyone can view avatars"
ON storage.objects FOR SELECT
USING (bucket_id = 'avatars');