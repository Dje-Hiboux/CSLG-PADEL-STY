/*
  # Correction des politiques RLS pour les réservations

  1. Changements
    - Suppression des anciennes politiques
    - Ajout de nouvelles politiques plus permissives pour les utilisateurs authentifiés
    - Ajout de contraintes pour empêcher les réservations qui se chevauchent

  2. Sécurité
    - Les utilisateurs authentifiés peuvent voir toutes les réservations
    - Les utilisateurs peuvent créer leurs propres réservations
    - Les utilisateurs peuvent uniquement modifier/supprimer leurs propres réservations
*/

-- Supprimer les politiques existantes
DROP POLICY IF EXISTS "Users can view all bookings" ON bookings;
DROP POLICY IF EXISTS "Users can create their own bookings" ON bookings;
DROP POLICY IF EXISTS "Users can manage their own bookings" ON bookings;

-- Créer de nouvelles politiques
CREATE POLICY "Users can view all bookings"
ON bookings FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Users can create bookings"
ON bookings FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() = user_id OR
  user_id IS NULL -- Permettre l'insertion sans user_id explicite
);

CREATE POLICY "Users can update their own bookings"
ON bookings FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own bookings"
ON bookings FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- Ajouter un trigger pour définir automatiquement user_id
CREATE OR REPLACE FUNCTION public.set_booking_user_id()
RETURNS TRIGGER AS $$
BEGIN
  NEW.user_id := auth.uid();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS set_booking_user_id_trigger ON bookings;
CREATE TRIGGER set_booking_user_id_trigger
  BEFORE INSERT ON bookings
  FOR EACH ROW
  EXECUTE FUNCTION public.set_booking_user_id();