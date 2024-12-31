-- Mettre à jour la fonction de vérification des réservations
CREATE OR REPLACE FUNCTION check_booking_overlap()
RETURNS TRIGGER AS $$
BEGIN
  -- Vérifier que le créneau commence dans le futur
  -- Utiliser date_trunc pour comparer uniquement les dates sans les millisecondes
  IF date_trunc('minute', NEW.start_time) <= date_trunc('minute', now()) THEN
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