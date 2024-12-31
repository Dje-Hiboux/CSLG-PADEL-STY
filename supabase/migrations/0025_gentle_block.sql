/*
  # Réorganisation de la gestion des utilisateurs

  1. Changements
    - Ajout de fonctions utilitaires pour la gestion des utilisateurs
    - Mise à jour des politiques RLS
    - Ajout de fonctions pour la gestion des métadonnées

  2. Sécurité
    - Toutes les fonctions sont SECURITY DEFINER
    - Politiques RLS mises à jour
*/

-- Fonction pour vérifier si un utilisateur est actif
CREATE OR REPLACE FUNCTION public.is_user_active(user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM public.users
    WHERE id = user_id
    AND is_active = true
  );
END;
$$;

-- Fonction pour vérifier si un utilisateur est admin
CREATE OR REPLACE FUNCTION public.is_user_admin(user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM public.users
    WHERE id = user_id
    AND role = 'admin'
  );
END;
$$;

-- Fonction pour mettre à jour les métadonnées utilisateur
CREATE OR REPLACE FUNCTION public.update_user_metadata(
  target_user_id uuid,
  new_first_name text DEFAULT NULL,
  new_last_name text DEFAULT NULL,
  new_nickname text DEFAULT NULL,
  new_avatar_url text DEFAULT NULL,
  new_role text DEFAULT NULL,
  new_is_active boolean DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Vérifier les permissions
  IF NOT (auth.uid() = target_user_id OR is_user_admin(auth.uid())) THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;

  -- Mettre à jour les champs non NULL
  UPDATE public.users
  SET
    first_name = COALESCE(new_first_name, first_name),
    last_name = COALESCE(new_last_name, last_name),
    nickname = COALESCE(new_nickname, nickname),
    avatar_url = COALESCE(new_avatar_url, avatar_url),
    role = CASE 
      WHEN new_role IS NOT NULL AND is_user_admin(auth.uid()) 
      THEN new_role 
      ELSE role 
    END,
    is_active = CASE 
      WHEN new_is_active IS NOT NULL AND is_user_admin(auth.uid()) 
      THEN new_is_active 
      ELSE is_active 
    END,
    updated_at = now()
  WHERE id = target_user_id;
END;
$$;

-- Accorder les permissions nécessaires
GRANT EXECUTE ON FUNCTION public.is_user_active TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_user_admin TO authenticated;
GRANT EXECUTE ON FUNCTION public.update_user_metadata TO authenticated;

-- Mettre à jour les politiques
DROP POLICY IF EXISTS "users_read_policy_v4" ON public.users;
DROP POLICY IF EXISTS "users_update_policy_v4" ON public.users;

CREATE POLICY "users_read_policy_v5"
  ON public.users FOR SELECT
  TO authenticated
  USING (
    id = auth.uid() OR 
    is_user_admin(auth.uid())
  );

CREATE POLICY "users_update_policy_v5"
  ON public.users FOR UPDATE
  TO authenticated
  USING (
    (id = auth.uid() AND is_user_active(auth.uid())) OR 
    is_user_admin(auth.uid())
  );