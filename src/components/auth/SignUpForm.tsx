import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { UserRegistration } from '../../types/auth';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { AuthErrorModal } from './AuthErrorModal';

export function SignUpForm() {
  const [formData, setFormData] = useState<UserRegistration>({
    first_name: '',
    last_name: '',
    nickname: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      await signUp(formData);
      setShowSuccessModal(true);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur lors de la création du compte';
      if (message.includes('en attente de validation')) {
        setShowSuccessModal(true);
      } else {
        setError(message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleModalClose = () => {
    setShowSuccessModal(false);
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark-200 px-4">
      <Card className="max-w-md w-full p-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-primary-400">
            Créer un compte
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="text-red-500 text-sm text-center">{error}</div>
          )}
          <div className="space-y-4">
            <div>
              <input
                type="text"
                name="first_name"
                required
                value={formData.first_name}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-dark-300 border border-dark-100 rounded-md text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Prénom"
              />
            </div>
            <div>
              <input
                type="text"
                name="last_name"
                required
                value={formData.last_name}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-dark-300 border border-dark-100 rounded-md text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Nom"
              />
            </div>
            <div>
              <input
                type="text"
                name="nickname"
                required
                value={formData.nickname}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-dark-300 border border-dark-100 rounded-md text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Surnom"
              />
            </div>
            <div>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-dark-300 border border-dark-100 rounded-md text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Email"
              />
            </div>
            <div>
              <input
                type="password"
                name="password"
                required
                minLength={6}
                value={formData.password}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-dark-300 border border-dark-100 rounded-md text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Mot de passe (minimum 6 caractères)"
              />
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Création...' : 'Créer un compte'}
          </Button>

          <div className="text-sm text-center">
            <Link
              to="/login"
              className="text-primary-400 hover:text-primary-300"
            >
              Déjà un compte ? Connectez-vous
            </Link>
          </div>
        </form>
      </Card>

      <AuthErrorModal
        isOpen={showSuccessModal}
        onClose={handleModalClose}
        message="Votre compte a été créé avec succès et est en attente de validation par un administrateur."
      />
    </div>
  );
}