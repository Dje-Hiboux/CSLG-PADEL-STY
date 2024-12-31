-- Créer une fonction pour vérifier le rôle admin
CREATE OR REPLACE FUNCTION check_is_admin()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  user_role text;
BEGIN
  -- Récupérer le rôle de l'utilisateur authentifié
  SELECT role INTO user_role
  FROM users
  WHERE id = auth.uid();
  
  -- Retourner true si le rôle est 'admin', false sinon
  RETURN user_role = 'admin';
END;
$$;

-- Accorder l'accès à la fonction pour les utilisateurs authentifiés
GRANT EXECUTE ON FUNCTION check_is_admin TO authenticated;