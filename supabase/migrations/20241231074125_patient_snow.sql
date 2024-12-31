-- Fonction pour synchroniser les utilisateurs de auth.users vers public.users
CREATE OR REPLACE FUNCTION sync_missing_users()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
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
  SELECT 
    au.id,
    au.email,
    COALESCE((au.raw_user_meta_data->>'first_name')::text, ''),
    COALESCE((au.raw_user_meta_data->>'last_name')::text, ''),
    COALESCE((au.raw_user_meta_data->>'nickname')::text, ''),
    'member',
    false,
    NOW(),
    NOW()
  FROM auth.users au
  LEFT JOIN public.users pu ON au.id = pu.id
  WHERE pu.id IS NULL;
END;
$$;

-- Mettre à jour la fonction de suppression pour gérer les deux tables
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

  -- Supprimer de public.users (les contraintes CASCADE s'appliqueront)
  DELETE FROM public.users WHERE id = user_id;
  
  -- Supprimer de auth.users
  DELETE FROM auth.users WHERE id = user_id;
END;
$$;

-- Exécuter la synchronisation initiale
SELECT sync_missing_users();