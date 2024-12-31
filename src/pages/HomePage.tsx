import { Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { PendingUsersNotification } from '../components/admin/PendingUsersNotification';
import { useAdmin } from '../contexts/AdminContext';

export function HomePage() {
  const { isAdmin } = useAdmin();

  return (
    <div className="min-h-screen bg-dark-200 text-gray-100">
      {/* Hero section avec image en arrière-plan */}
      <div className="relative h-[60vh] mb-12">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url("https://www.aecilluminazione.fr/wp-content/uploads/2021/11/Eclairage-LED-courts-de-padel-interieurs-exterieurs-AEC-Illuminazione-1000x1000.jpg")',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-dark-200/90 to-dark-200/60" />
        </div>
        <div className="relative h-full max-w-7xl mx-auto px-4 flex items-center justify-center">
          <h1 className="text-5xl md:text-7xl font-bold text-white text-center">
            CSLG PADEL SATORY
          </h1>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="max-w-7xl mx-auto px-4">
        {isAdmin && <PendingUsersNotification />}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="overflow-hidden flex flex-col">
            <div className="p-6 flex-1 text-center">
              <h2 className="text-2xl font-bold text-primary-400 mb-4">
                Notre structure
              </h2>
              <p className="text-gray-400">
                Découvrez nos 2 terrains de padel couverts, parfaits pour jouer toute l'année, quelles que soient les conditions météo.
              </p>
            </div>
            <img
              src="https://cdn.prod.website-files.com/65c9d134325d487977091fc1/66afc5e4cb30cb40dd35cb71_terrain-padel-indoor-la-chataigneraie.webp"
              alt="Terrain de padel couvert"
              className="w-full h-48 object-cover"
            />
          </Card>
          
          <Card className="overflow-hidden flex flex-col">
            <div className="p-6 flex-1 text-center">
              <h2 className="text-2xl font-bold text-primary-400 mb-4">
                Un espace chaleureux
              </h2>
              <p className="text-gray-400">
                Profitez d'un coin détente pensé pour vous. Prolongez les discussions après votre match dans une ambiance conviviale et relaxante.
              </p>
            </div>
            <img
              src="https://cdn.prod.website-files.com/65c9d134325d487977091fc1/66ba2880660f23c07f4deb15_la-casa-de-padel-club-albigeois-04.webp"
              alt="Espace détente"
              className="w-full h-48 object-cover"
            />
          </Card>
        </div>

        <div className="text-center mt-12 mb-12">
          <p className="text-xl text-gray-400 mb-8">
            Réservez votre terrain et commencez à jouer !
          </p>
          <Link to="/bookings">
            <Button size="lg" className="gap-2">
              <Calendar className="h-5 w-5" />
              Réserver un terrain
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}