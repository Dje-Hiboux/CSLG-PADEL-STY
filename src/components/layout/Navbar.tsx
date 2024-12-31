import { useState } from 'react';
import { LogOut, Menu, X, User, Calendar, Home, Shield, Newspaper } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useAdmin } from '../../contexts/AdminContext';

export function Navbar() {
  const { signOut } = useAuth();
  const { isAdmin } = useAdmin();
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  const navLinks = [
    { to: '/', icon: Home, label: 'Accueil' },
    { to: '/news', icon: Newspaper, label: 'Actualités' },
    { to: '/bookings', icon: Calendar, label: 'Réservations' },
    { to: '/profile', icon: User, label: 'Profil' },
    ...(isAdmin ? [{ to: '/admin', icon: Shield, label: 'Administration' }] : []),
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-dark-200 text-gray-100 shadow-lg fixed w-full z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-100 hover:text-primary-400 hover:bg-dark-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-400 lg:hidden"
            >
              {isOpen ? (
                <X className="block h-6 w-6" />
              ) : (
                <Menu className="block h-6 w-6" />
              )}
            </button>
            <Link to="/" className="flex items-center text-lg font-azonix text-primary-400 mx-auto lg:mx-0">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-6 w-6 mr-2"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M12 2c0 5.523-4.477 10-10 10" />
                <path d="M12 2c0 5.523 4.477 10 10 10" />
                <path d="M2 12c5.523 0 10 4.477 10 10" />
                <path d="M22 12c-5.523 0-10 4.477-10 10" />
              </svg>
              <span>Padel SATORY</span>
            </Link>
          </div>

          <div className="hidden lg:flex items-center space-x-4">
            {navLinks.map(({ to, icon: Icon, label }) => (
              <Link
                key={to}
                to={to}
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                  isActive(to)
                    ? 'bg-primary-600 text-white'
                    : 'hover:bg-dark-100 hover:text-primary-400'
                }`}
              >
                <Icon className="h-5 w-5 mr-1.5" />
                <span>{label}</span>
              </Link>
            ))}
            <button
              onClick={handleSignOut}
              className="flex items-center px-3 py-2 rounded-md text-sm font-medium hover:bg-dark-100 hover:text-primary-400 transition-colors duration-200"
            >
              <LogOut className="h-5 w-5 mr-1.5" />
              <span>Déconnexion</span>
            </button>
          </div>
        </div>
      </div>

      <div className={`lg:hidden ${isOpen ? 'block' : 'hidden'}`}>
        <div className="px-2 pt-2 pb-3 space-y-1 bg-dark-200 shadow-lg">
          {navLinks.map(({ to, icon: Icon, label }) => (
            <Link
              key={to}
              to={to}
              onClick={() => setIsOpen(false)}
              className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                isActive(to)
                  ? 'bg-primary-600 text-white'
                  : 'hover:bg-dark-100 hover:text-primary-400'
              }`}
            >
              <Icon className="h-5 w-5 mr-1.5" />
              <span>{label}</span>
            </Link>
          ))}
          <button
            onClick={handleSignOut}
            className="flex w-full items-center px-3 py-2 rounded-md text-sm font-medium hover:bg-dark-100 hover:text-primary-400 transition-colors duration-200"
          >
            <LogOut className="h-5 w-5 mr-1.5" />
            <span>Déconnexion</span>
          </button>
        </div>
      </div>
    </nav>
  );
}