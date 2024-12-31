/*
  # Fix Booking Overlap Issues

  1. Changes
    - Remove existing overlap check trigger and function
    - Add new overlap check function with proper timestamp comparison
    - Create new trigger for overlap checking
    - Update booking policies

  2. Security
    - Maintain RLS policies for bookings
    - Ensure proper user authentication checks
*/

-- Drop existing trigger and function
DROP TRIGGER IF EXISTS check_booking_overlap_trigger ON bookings;
DROP FUNCTION IF EXISTS check_booking_overlap();

-- Create new overlap check function with proper timestamp handling
CREATE OR REPLACE FUNCTION check_booking_overlap()
RETURNS TRIGGER AS $$
BEGIN
  -- Check for overlapping bookings
  IF EXISTS (
    SELECT 1 FROM bookings
    WHERE court_id = NEW.court_id
    AND (
      (NEW.start_time, NEW.end_time) OVERLAPS (start_time, end_time)
    )
  ) THEN
    RAISE EXCEPTION 'Ce créneau est déjà réservé';
  END IF;

  -- Set authenticated user ID
  NEW.user_id := auth.uid();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create new trigger
CREATE TRIGGER check_booking_overlap_trigger
  BEFORE INSERT ON bookings
  FOR EACH ROW
  EXECUTE FUNCTION check_booking_overlap();

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view all bookings" ON bookings;
DROP POLICY IF EXISTS "Users can create bookings" ON bookings;
DROP POLICY IF EXISTS "Users can update their own bookings" ON bookings;
DROP POLICY IF EXISTS "Users can delete their own bookings" ON bookings;

-- Create new policies
CREATE POLICY "Users can view all bookings"
ON bookings FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Users can create bookings"
ON bookings FOR INSERT
TO authenticated
WITH CHECK (
  -- Ensure booking starts in the future
  start_time > now() AND
  -- Ensure end time is after start time
  end_time > start_time
);

CREATE POLICY "Users can update their own bookings"
ON bookings FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own bookings"
ON bookings FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- Create index for overlap checks
CREATE INDEX IF NOT EXISTS idx_bookings_overlap 
ON bookings (court_id, start_time, end_time);