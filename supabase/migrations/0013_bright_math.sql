/*
  # Implémentation des créneaux numérotés avec index IMMUTABLE

  1. Changements
    - Ajout de la colonne slot_number
    - Création de fonctions IMMUTABLE pour l'extraction de date
    - Optimisation des index et contraintes

  2. Sécurité
    - Validation des numéros de créneaux
    - Vérification des chevauchements
*/

-- Créer des fonctions IMMUTABLE pour l'extraction de date
CREATE OR REPLACE FUNCTION get_date_part(ts timestamptz)
RETURNS date
LANGUAGE sql IMMUTABLE
AS $$
  SELECT date_trunc('day', ts)::date;
$$;

-- Ajouter la colonne slot_number avec une valeur par défaut temporaire
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS slot_number INTEGER DEFAULT 1;

-- Mettre à jour les réservations existantes avec un numéro de créneau basé sur l'heure
UPDATE bookings
SET slot_number = CASE
  WHEN EXTRACT(HOUR FROM start_time) = 8 THEN 1
  WHEN EXTRACT(HOUR FROM start_time) = 9 THEN 2
  WHEN EXTRACT(HOUR FROM start_time) = 10 THEN 3
  WHEN EXTRACT(HOUR FROM start_time) = 12 THEN 4
  WHEN EXTRACT(HOUR FROM start_time) = 13 THEN 5
  WHEN EXTRACT(HOUR FROM start_time) = 15 THEN 6
  WHEN EXTRACT(HOUR FROM start_time) = 16 THEN 7
  WHEN EXTRACT(HOUR FROM start_time) = 18 THEN 8
  WHEN EXTRACT(HOUR FROM start_time) = 19 THEN 9
  WHEN EXTRACT(HOUR FROM start_time) = 21 THEN 10
  ELSE 1
END;

-- Supprimer la valeur par défaut et rendre la colonne NOT NULL
ALTER TABLE bookings ALTER COLUMN slot_number DROP DEFAULT;
ALTER TABLE bookings ALTER COLUMN slot_number SET NOT NULL;

-- Créer un index pour les recherches par numéro de créneau
CREATE INDEX IF NOT EXISTS idx_bookings_slot_number 
ON bookings (court_id, slot_number, start_time);

-- Créer une contrainte pour valider les numéros de créneaux
ALTER TABLE bookings ADD CONSTRAINT valid_slot_number 
CHECK (slot_number BETWEEN 1 AND 10);

-- Créer un index unique utilisant la fonction IMMUTABLE
CREATE UNIQUE INDEX unique_court_slot_date ON bookings (
  court_id,
  slot_number,
  get_date_part(start_time)
);

-- Mettre à jour la fonction de vérification des réservations
CREATE OR REPLACE FUNCTION check_booking_overlap()
RETURNS TRIGGER AS $$
BEGIN
  -- Vérifier que le créneau commence dans le futur
  IF NEW.start_time <= now() THEN
    RAISE EXCEPTION 'La réservation doit commencer dans le futur';
  END IF;

  -- Vérifier s'il existe déjà une réservation pour ce créneau
  IF EXISTS (
    SELECT 1 FROM bookings
    WHERE court_id = NEW.court_id
    AND slot_number = NEW.slot_number
    AND get_date_part(start_time) = get_date_part(NEW.start_time)
  ) THEN
    RAISE EXCEPTION 'Ce créneau est déjà réservé';
  END IF;

  -- Définir l'ID de l'utilisateur authentifié
  NEW.user_id := auth.uid();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recréer le trigger
DROP TRIGGER IF EXISTS check_booking_overlap_trigger ON bookings;
CREATE TRIGGER check_booking_overlap_trigger
  BEFORE INSERT ON bookings
  FOR EACH ROW
  EXECUTE FUNCTION check_booking_overlap();