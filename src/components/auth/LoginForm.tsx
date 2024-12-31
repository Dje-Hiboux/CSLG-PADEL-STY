import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { AuthErrorModal } from './AuthErrorModal';

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showInactiveModal, setShowInactiveModal] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      await signIn(email, password);
      navigate('/');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Email ou mot de passe incorrect';
      if (message.includes('en attente de validation')) {
        setShowInactiveModal(true);
      } else {
        setError(message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark-200 px-4">
      <Card className="max-w-md w-full p-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-primary-400">
            Connexion
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="text-red-500 text-sm text-center">{error}</div>
          )}
          <div className="space-y-4">
            <div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 bg-dark-300 border border-dark-100 rounded-md text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Email"
              />
            </div>
            <div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 bg-dark-300 border border-dark-100 rounded-md text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Mot de passe"
              />
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Connexion...' : 'Se connecter'}
          </Button>

          <div className="text-sm text-center space-y-2">
            <Link
              to="/signup"
              className="block text-primary-400 hover:text-primary-300"
            >
              Pas encore de compte ? Inscrivez-vous
            </Link>
            <Link
              to="/forgot-password"
              className="block text-gray-400 hover:text-gray-300"
            >
              Mot de passe oublié ?
            </Link>
          </div>
        </form>
      </Card>

      <AuthErrorModal
        isOpen={showInactiveModal}
        onClose={() => setShowInactiveModal(false)}
        message="Votre compte est en attente de validation par un administrateur."
      />
    </div>
  );
}