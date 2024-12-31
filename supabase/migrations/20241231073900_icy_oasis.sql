-- Créer une fonction pour supprimer complètement un utilisateur
CREATE OR REPLACE FUNCTION delete_user_completely(user_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Vérifier que l'utilisateur qui appelle est admin
  IF NOT EXISTS (
    SELECT 1 FROM users
    WHERE id = auth.uid()
    AND role = 'admin'
  ) THEN
    RAISE EXCEPTION 'Only administrators can delete users';
  END IF;

  -- Supprimer l'utilisateur de auth.users
  DELETE FROM auth.users WHERE id = user_id;
  
  -- La suppression dans public.users et les autres tables se fera automatiquement
  -- grâce aux contraintes ON DELETE CASCADE
END;
$$;

-- Accorder l'accès à la fonction pour les utilisateurs authentifiés
GRANT EXECUTE ON FUNCTION delete_user_completely TO authenticated;