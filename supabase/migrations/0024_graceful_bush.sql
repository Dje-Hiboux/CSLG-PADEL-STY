-- Ajouter une fonction pour vérifier si un utilisateur est actif
CREATE OR REPLACE FUNCTION check_user_is_active()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM users
    WHERE id = auth.uid()
    AND is_active = true
  );
END;
$$;

-- Mettre à jour les politiques existantes pour inclure la vérification d'activation
DROP POLICY IF EXISTS "users_read_policy_v3" ON users;
DROP POLICY IF EXISTS "users_update_policy_v3" ON users;

CREATE POLICY "users_read_policy_v4"
  ON users FOR SELECT
  TO authenticated
  USING (
    id = auth.uid() OR 
    check_is_admin()
  );

CREATE POLICY "users_update_policy_v4"
  ON users FOR UPDATE
  TO authenticated
  USING (
    (id = auth.uid() AND check_user_is_active()) OR 
    check_is_admin()
  );

-- Mettre à jour les politiques des réservations
DROP POLICY IF EXISTS "Users can view all bookings" ON bookings;
DROP POLICY IF EXISTS "Users can create bookings" ON bookings;

CREATE POLICY "bookings_read_policy"
  ON bookings FOR SELECT
  TO authenticated
  USING (check_user_is_active() OR check_is_admin());

CREATE POLICY "bookings_create_policy"
  ON bookings FOR INSERT
  TO authenticated
  WITH CHECK (check_user_is_active());