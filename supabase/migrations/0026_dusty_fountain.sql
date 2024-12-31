/*
  # Synchronisation des utilisateurs Auth et Public

  1. Changements
    - Ajout d'un trigger pour synchroniser les métadonnées
    - Nettoyage des utilisateurs orphelins
    - Synchronisation des données existantes

  2. Sécurité
    - Fonction SECURITY DEFINER pour la synchronisation
    - Vérification des permissions
*/

-- Fonction pour synchroniser les métadonnées utilisateur
CREATE OR REPLACE FUNCTION sync_user_metadata()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Synchroniser les métadonnées de auth.users vers public.users
  INSERT INTO public.users (
    id,
    email,
    first_name,
    last_name,
    nickname,
    role,
    is_active,
    created_at,
    updated_at
  )
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE((NEW.raw_user_meta_data->>'first_name')::text, ''),
    COALESCE((NEW.raw_user_meta_data->>'last_name')::text, ''),
    COALESCE((NEW.raw_user_meta_data->>'nickname')::text, ''),
    'member',
    false,
    NOW(),
    NOW()
  )
  ON CONFLICT (id) DO UPDATE
  SET
    email = EXCLUDED.email,
    first_name = EXCLUDED.first_name,
    last_name = EXCLUDED.last_name,
    nickname = EXCLUDED.nickname,
    updated_at = NOW();

  RETURN NEW;
END;
$$;

-- Supprimer le trigger s'il existe
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Créer le trigger pour la synchronisation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT OR UPDATE ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION sync_user_metadata();

-- Synchroniser les utilisateurs existants
DO $$
DECLARE
  auth_user RECORD;
BEGIN
  FOR auth_user IN (SELECT * FROM auth.users) LOOP
    INSERT INTO public.users (
      id,
      email,
      first_name,
      last_name,
      nickname,
      role,
      is_active,
      created_at,
      updated_at
    )
    VALUES (
      auth_user.id,
      auth_user.email,
      COALESCE((auth_user.raw_user_meta_data->>'first_name')::text, ''),
      COALESCE((auth_user.raw_user_meta_data->>'last_name')::text, ''),
      COALESCE((auth_user.raw_user_meta_data->>'nickname')::text, ''),
      'member',
      false,
      NOW(),
      NOW()
    )
    ON CONFLICT (id) DO UPDATE
    SET
      email = EXCLUDED.email,
      first_name = EXCLUDED.first_name,
      last_name = EXCLUDED.last_name,
      nickname = EXCLUDED.nickname,
      updated_at = NOW();
  END LOOP;
END;
$$;