import { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { ImageUpload } from '../ui/ImageUpload';
import { News, NewsFormData } from '../../types/news';

interface NewsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: NewsFormData) => Promise<void>;
  news: News | null;
}

export function NewsModal({ isOpen, onClose, onSave, news }: NewsModalProps) {
  const [formData, setFormData] = useState<NewsFormData>({
    title: '',
    content: '',
    image_url: '',
    published_at: new Date().toISOString().split('T')[0],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (news) {
      setFormData({
        title: news.title,
        content: news.content,
        image_url: news.image_url,
        published_at: new Date(news.published_at).toISOString().split('T')[0],
      });
    } else {
      setFormData({
        title: '',
        content: '',
        image_url: '',
        published_at: new Date().toISOString().split('T')[0],
      });
    }
  }, [news]);

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      setError(null);
      await onSave(formData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={handleSubmit}
      title={news ? 'Modifier l\'actualité' : 'Nouvelle actualité'}
      loading={isSubmitting}
    >
      <div className="space-y-4">
        {error && (
          <div className="bg-red-400/20 text-red-400 p-3 rounded-md text-sm">
            {error}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">
            Titre
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            className="w-full px-3 py-2 bg-dark-300 border border-dark-100 rounded-md text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="Titre de l'actualité"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">
            Image
          </label>
          <ImageUpload
            bucket="news"
            currentImage={formData.image_url}
            onImageUpload={(url) => setFormData(prev => ({ ...prev, image_url: url }))}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">
            Date de publication
          </label>
          <input
            type="date"
            value={formData.published_at}
            onChange={(e) => setFormData(prev => ({ ...prev, published_at: e.target.value }))}
            className="w-full px-3 py-2 bg-dark-300 border border-dark-100 rounded-md text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">
            Contenu
          </label>
          <textarea
            value={formData.content}
            onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
            className="w-full px-3 py-2 bg-dark-300 border border-dark-100 rounded-md text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 min-h-[150px]"
            placeholder="Contenu de l'actualité"
            required
          />
        </div>
      </div>
    </Modal>
  );
}