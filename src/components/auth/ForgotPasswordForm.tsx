import { useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { getErrorMessage } from '../../utils/errors';

export function ForgotPasswordForm() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;
      setSuccess(true);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark-200 px-4">
      <Card className="max-w-md w-full p-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-primary-400">
            Mot de passe oublié
          </h2>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="text-red-500 text-sm text-center">{error}</div>
          )}

          {success ? (
            <div className="text-center space-y-4">
              <div className="text-green-400 text-sm">
                Un email de réinitialisation a été envoyé à {email}
              </div>
              <Link
                to="/login"
                className="text-primary-400 hover:text-primary-300 text-sm"
              >
                Retour à la connexion
              </Link>
            </div>
          ) : (
            <>
              <div>
                <p className="text-gray-400 text-sm mb-4">
                  Entrez votre adresse email pour recevoir un lien de réinitialisation
                </p>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-dark-300 border border-dark-100 rounded-md text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Email"
                />
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Envoi...' : 'Envoyer le lien'}
              </Button>

              <div className="text-sm text-center">
                <Link
                  to="/login"
                  className="text-primary-400 hover:text-primary-300"
                >
                  Retour à la connexion
                </Link>
              </div>
            </>
          )}
        </form>
      </Card>
    </div>
  );
}