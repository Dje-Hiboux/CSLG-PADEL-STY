import { Card } from '../components/ui/Card';
import { BookingCalendar } from '../components/bookings/BookingCalendar';

export function BookingsPage() {
  return (
    <div className="min-h-screen bg-dark-200 text-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-primary-400 mb-8">
          Réserver un terrain
        </h1>
        
        <Card className="p-6">
          <BookingCalendar />
        </Card>
      </div>
    </div>
  );
}