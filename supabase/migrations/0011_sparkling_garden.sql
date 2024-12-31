/*
  # Amélioration des politiques de réservation

  1. Modifications
    - Suppression des anciennes politiques
    - Ajout de nouvelles politiques plus précises
    - Amélioration de la gestion des chevauchements
    - Optimisation des performances avec des index

  2. Sécurité
    - Vérification des créneaux dans le futur
    - Protection contre les réservations simultanées
    - Attribution automatique de l'utilisateur
*/

-- Supprimer les anciennes politiques
DROP POLICY IF EXISTS "Users can view all bookings" ON bookings;
DROP POLICY IF EXISTS "Users can create bookings" ON bookings;
DROP POLICY IF EXISTS "Users can update their own bookings" ON bookings;
DROP POLICY IF EXISTS "Users can delete their own bookings" ON bookings;

-- Supprimer l'ancienne contrainte
ALTER TABLE bookings DROP CONSTRAINT IF EXISTS no_overlapping_bookings;

-- Créer des index pour optimiser les recherches
CREATE INDEX IF NOT EXISTS idx_bookings_court_id ON bookings(court_id);
CREATE INDEX IF NOT EXISTS idx_bookings_start_time ON bookings(start_time);
CREATE INDEX IF NOT EXISTS idx_bookings_end_time ON bookings(end_time);

-- Nouvelles politiques
CREATE POLICY "Users can view all bookings"
ON bookings FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Users can create bookings"
ON bookings FOR INSERT
TO authenticated
WITH CHECK (
  -- Vérifie que le créneau commence dans le futur
  start_time > now() AND
  -- Vérifie que le créneau est valide (fin après début)
  end_time > start_time
);

-- Fonction pour vérifier les chevauchements
CREATE OR REPLACE FUNCTION check_booking_overlap()
RETURNS TRIGGER AS $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM bookings
    WHERE court_id = NEW.court_id
    AND (
      (NEW.start_time >= start_time AND NEW.start_time < end_time)
      OR
      (NEW.end_time > start_time AND NEW.end_time <= end_time)
      OR
      (NEW.start_time <= start_time AND NEW.end_time >= end_time)
    )
  ) THEN
    RAISE EXCEPTION 'Ce créneau est déjà réservé';
  END IF;

  -- Définir l'ID de l'utilisateur authentifié
  NEW.user_id := auth.uid();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- S'assurer que le trigger est créé
DROP TRIGGER IF EXISTS check_booking_overlap_trigger ON bookings;
CREATE TRIGGER check_booking_overlap_trigger
  BEFORE INSERT ON bookings
  FOR EACH ROW
  EXECUTE FUNCTION check_booking_overlap();