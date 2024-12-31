-- Améliorer la fonction de vérification des réservations actives
CREATE OR REPLACE FUNCTION check_booking_limit()
RETURNS TRIGGER AS $$
DECLARE
  active_bookings INTEGER;
BEGIN
  -- Compter uniquement les réservations futures
  SELECT COUNT(*)
  INTO active_bookings
  FROM bookings
  WHERE user_id = auth.uid()
  AND start_time > NOW();

  -- Vérifier la limite
  IF active_bookings >= 2 THEN
    RAISE EXCEPTION 'Vous ne pouvez pas avoir plus de 2 réservations actives à la fois';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recréer le trigger
DROP TRIGGER IF EXISTS check_booking_limit_trigger ON bookings;
CREATE TRIGGER check_booking_limit_trigger
  BEFORE INSERT ON bookings
  FOR EACH ROW
  EXECUTE FUNCTION check_booking_limit();