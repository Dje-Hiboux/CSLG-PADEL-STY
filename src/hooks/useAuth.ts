import { useSession } from './useSession';
import { useUserRole } from './useUserRole';
import { supabase } from '../lib/supabase';
import { UserRegistration } from '../types/auth';
import { getErrorMessage } from '../utils/errors';

export function useAuth() {
  const { user, loading: sessionLoading, error: sessionError } = useSession();
  const { isAdmin, loading: roleLoading, error: roleError } = useUserRole(user);

  const loading = sessionLoading || (user && roleLoading);
  const error = sessionError || roleError;

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ 
        email, 
        password 
      });
      
      if (error) throw error;

      // Vérifier si l'utilisateur est actif
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('is_active')
        .eq('id', data.user.id)
        .single();

      if (userError) throw userError;

      if (!userData.is_active) {
        await supabase.auth.signOut();
        throw new Error('Votre compte est en attente de validation par un administrateur');
      }
    } catch (err) {
      throw new Error(getErrorMessage(err));
    }
  };

  const signUp = async (userData: UserRegistration) => {
    const { email, password, ...profile } = userData;

    if (password.length < 6) {
      throw new Error('Le mot de passe doit contenir au moins 6 caractères');
    }

    try {
      // 1. Créer l'utilisateur dans auth.users
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: profile.first_name,
            last_name: profile.last_name,
            nickname: profile.nickname,
          },
        },
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error('Erreur lors de la création du compte');

      // 2. Synchroniser avec public.users via la fonction RPC
      const { error: syncError } = await supabase.rpc('sync_missing_users');
      
      if (syncError) throw syncError;

      await supabase.auth.signOut();
      throw new Error('Votre compte a été créé et est en attente de validation par un administrateur');
    } catch (err) {
      throw new Error(getErrorMessage(err));
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (err) {
      throw new Error(getErrorMessage(err));
    }
  };

  return {
    user,
    isAdmin,
    loading,
    error,
    signIn,
    signUp,
    signOut,
  };
}