import { format, parse } from 'date-fns';

export interface TimeSlot {
  id: number;
  start: string;
  end: string;
  label: string;
}

export interface Court {
  id: string;
  name: string;
  is_active: boolean;
}

export interface Booking {
  id: string;
  court_id: string;
  user_id: string;
  slot_number: number;
  start_time: string;
  end_time: string;
  court: Court;
  user: {
    first_name: string;
    last_name: string;
    nickname: string | null;
    avatar_url: string | null;
    is_active: boolean;
  };
}

export interface BookingHistory {
  id: string;
  start_time: string;
  end_time: string;
  court: {
    name: string;
  };
  user: {
    first_name: string;
    last_name: string;
    nickname: string | null;
    avatar_url: string | null;
  };
}

export const TIME_SLOTS: TimeSlot[] = [
  { id: 1, start: '08:00', end: '09:00', label: '8H - 9H' },
  { id: 2, start: '09:00', end: '10:30', label: '9H - 10H30' },
  { id: 3, start: '10:30', end: '12:00', label: '10H30 - 12H' },
  { id: 4, start: '12:00', end: '13:30', label: '12H - 13H30' },
  { id: 5, start: '13:30', end: '15:00', label: '13H30 - 15H' },
  { id: 6, start: '15:00', end: '16:30', label: '15H - 16H30' },
  { id: 7, start: '16:30', end: '18:00', label: '16H30 - 18H' },
  { id: 8, start: '18:00', end: '19:30', label: '18H - 19H30' },
  { id: 9, start: '19:30', end: '21:00', label: '19H30 - 21H' },
  { id: 10, start: '21:00', end: '22:30', label: '21H - 22H30' }
];

export function getTimeSlotById(id: number): TimeSlot | undefined {
  return TIME_SLOTS.find(slot => slot.id === id);
}

export function createBookingDateTime(date: Date, timeString: string): string {
  const [hours, minutes] = timeString.split(':');
  const bookingDate = new Date(date);
  bookingDate.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0);
  return bookingDate.toISOString();
}