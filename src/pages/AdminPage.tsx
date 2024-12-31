import { useState } from 'react';
import { Users, Dumbbell, History, Newspaper } from 'lucide-react';
import { UserManagement } from '../components/admin/UserManagement';
import { CourtManagement } from '../components/admin/CourtManagement';
import { BookingHistory } from '../components/admin/BookingHistory';
import { NewsManagement } from '../components/admin/NewsManagement';

type Tab = 'users' | 'courts' | 'history' | 'news';

export function AdminPage() {
  const [activeTab, setActiveTab] = useState<Tab>('users');

  const tabs = [
    { id: 'users' as Tab, label: 'Utilisateurs', icon: Users },
    { id: 'courts' as Tab, label: 'Terrains', icon: Dumbbell },
    { id: 'news' as Tab, label: 'Actualités', icon: Newspaper },
    { id: 'history' as Tab, label: 'Historique', icon: History },
  ];

  return (
    <div className="min-h-screen bg-dark-200 text-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-primary-400">
            Administration
          </h1>
          <div className="flex bg-dark-100 rounded-lg p-1 overflow-x-auto">
            {tabs.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex items-center px-3 sm:px-4 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
                  activeTab === id
                    ? 'bg-primary-600 text-white'
                    : 'text-gray-400 hover:text-gray-100'
                }`}
              >
                <Icon className="w-4 h-4 sm:mr-2" />
                <span className="hidden sm:inline">{label}</span>
              </button>
            ))}
          </div>
        </div>

        {activeTab === 'users' && <UserManagement />}
        {activeTab === 'courts' && <CourtManagement />}
        {activeTab === 'news' && <NewsManagement />}
        {activeTab === 'history' && <BookingHistory />}
      </div>
    </div>
  );
}