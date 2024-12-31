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
    <div className="min-h-screen flex items-center justify-center bg-cover bg-center px-4" 
      style={{
        backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url("https://www.aecilluminazione.fr/wp-content/uploads/2021/11/Eclairage-LED-courts-de-padel-interieurs-exterieurs-AEC-Illuminazione-1000x1000.jpg")',
      }}>
      <Card className="max-w-md w-full p-8">
        <div className="text-center space-y-4 mb-8">
          <div className="flex items-center justify-center">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-12 w-12 text-primary-400"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M12 2c0 5.523-4.477 10-10 10" />
              <path d="M12 2c0 5.523 4.477 10 10 10" />
              <path d="M2 12c5.523 0 10 4.477 10 10" />
              <path d="M22 12c-5.523 0-10 4.477-10 10" />
            </svg>
          </div>
          <h2 className="text-3xl font-azonix text-primary-400">
            CSLG PADEL SATORY
          </h2>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
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