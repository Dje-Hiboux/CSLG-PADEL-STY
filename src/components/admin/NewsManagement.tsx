import { Plus } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { NewsModal } from './NewsModal';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useNews } from '../../hooks/useNews';
import { supabase } from '../../lib/supabase';
import { News, NewsFormData } from '../../types/news';
import { useState } from 'react';
import { SortableHeader } from './SortableHeader';
import { useSortedNews } from '../../hooks/useSortedNews';

export function NewsManagement() {
  const { news, loading, error } = useNews();
  const { items: sortedNews, sortConfig, requestSort } = useSortedNews(news);
  const [selectedNews, setSelectedNews] = useState<News | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSave = async (formData: NewsFormData) => {
    try {
      if (selectedNews) {
        const { error } = await supabase
          .from('news')
          .update({
            title: formData.title,
            content: formData.content,
            image_url: formData.image_url,
            published_at: formData.published_at,
            updated_at: new Date().toISOString()
          })
          .eq('id', selectedNews.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('news')
          .insert([{
            title: formData.title,
            content: formData.content,
            image_url: formData.image_url,
            published_at: formData.published_at
          }]);

        if (error) throw error;
      }

      setIsModalOpen(false);
      setSelectedNews(null);
    } catch (err) {
      console.error('Error saving news:', err);
      throw err;
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('news')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (err) {
      console.error('Error deleting news:', err);
      throw err;
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="text-red-400">{error}</div>;

  return (
    <Card>
      <div className="p-4 border-b border-dark-300 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-medium text-primary-400">
            Gestion des actualités
          </h2>
          <div className="flex items-center gap-2">
            <SortableHeader
              label="Date"
              field="date"
              currentField={sortConfig.field}
              direction={sortConfig.direction}
              onSort={requestSort}
            />
            <SortableHeader
              label="Titre"
              field="title"
              currentField={sortConfig.field}
              direction={sortConfig.direction}
              onSort={requestSort}
            />
          </div>
        </div>
        <Button
          onClick={() => {
            setSelectedNews(null);
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">Nouvelle actualité</span>
        </Button>
      </div>

      <div className="p-4">
        <div className="space-y-4">
          {sortedNews.map((item) => (
            <div
              key={item.id}
              className="bg-dark-200 rounded-lg p-4 flex flex-col md:flex-row gap-4"
            >
              <img
                src={item.image_url}
                alt={item.title}
                className="w-full md:w-48 h-32 object-cover rounded-lg"
              />
              <div className="flex-1">
                <div className="text-sm text-primary-400 mb-1">
                  {format(new Date(item.published_at), 'dd MMMM yyyy', { locale: fr })}
                </div>
                <h3 className="text-lg font-medium text-gray-100 mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-400 line-clamp-2">
                  {item.content}
                </p>
              </div>
              <div className="flex md:flex-col gap-2 justify-end">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSelectedNews(item);
                    setIsModalOpen(true);
                  }}
                >
                  Modifier
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  className="text-red-400 hover:text-red-300"
                  onClick={() => handleDelete(item.id)}
                >
                  Supprimer
                </Button>
              </div>
            </div>
          ))}

          {sortedNews.length === 0 && (
            <div className="text-center py-8 text-gray-400">
              Aucune actualité n'a été créée
            </div>
          )}
        </div>
      </div>

      <NewsModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedNews(null);
        }}
        onSave={handleSave}
        news={selectedNews}
      />
    </Card>
  );
}