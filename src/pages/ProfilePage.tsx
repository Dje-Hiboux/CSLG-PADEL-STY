import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabase';
import { Card } from '../components/ui/Card';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { AvatarUpload } from '../components/profile/AvatarUpload';
import { PasswordChange } from '../components/profile/PasswordChange';
import { ProfileInfo } from '../components/profile/ProfileInfo';
import { UpcomingBookings } from '../components/profile/UpcomingBookings';
import { User } from '../types/auth';

export function ProfilePage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  async function fetchProfile() {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', user?.id)
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (err) {
      console.error('Error fetching profile:', err);
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  }

  const handleAvatarUpdate = (url: string) => {
    setProfile(prev => prev ? { ...prev, avatar_url: url } : null);
  };

  const handleProfileUpdate = (updatedProfile: User) => {
    setProfile(updatedProfile);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-dark-200 text-gray-100 flex items-center justify-center">
        <Card className="p-6">
          <p className="text-red-400">{error}</p>
        </Card>
      </div>
    );
  }

  if (!profile || !user) {
    return (
      <div className="min-h-screen bg-dark-200 text-gray-100 flex items-center justify-center">
        <Card className="p-6">
          <p className="text-gray-400">Profil non trouvé</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-200 text-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        <Card className="p-6">
          <h3 className="text-xl font-medium text-primary-400 mb-4">
            Mes prochaines réservations
          </h3>
          <UpcomingBookings />
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="p-6">
            <div className="mb-6">
              <AvatarUpload
                userId={user.id}
                avatarUrl={profile.avatar_url}
                onAvatarUpdate={handleAvatarUpdate}
              />
            </div>
            <ProfileInfo 
              profile={profile} 
              onProfileUpdate={handleProfileUpdate}
            />
          </Card>

          <Card className="p-6">
            <PasswordChange />
          </Card>
        </div>
      </div>
    </div>
  );
}