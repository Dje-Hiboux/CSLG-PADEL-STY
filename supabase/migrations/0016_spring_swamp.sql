/*
  # Add booking limit trigger

  1. Changes
    - Add trigger to enforce maximum of 2 active bookings per user
*/

CREATE OR REPLACE FUNCTION check_booking_limit()
RETURNS TRIGGER AS $$
DECLARE
  active_bookings INTEGER;
BEGIN
  -- Count active bookings for the user
  SELECT COUNT(*)
  INTO active_bookings
  FROM bookings
  WHERE user_id = auth.uid()
  AND end_time > NOW();

  -- Check if user has reached the limit
  IF active_bookings >= 2 THEN
    RAISE EXCEPTION 'Vous ne pouvez pas avoir plus de 2 réservations actives à la fois';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger
DROP TRIGGER IF EXISTS check_booking_limit_trigger ON bookings;
CREATE TRIGGER check_booking_limit_trigger
  BEFORE INSERT ON bookings
  FOR EACH ROW
  EXECUTE FUNCTION check_booking_limit();