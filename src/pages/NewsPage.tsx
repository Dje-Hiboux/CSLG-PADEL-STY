import { NewsCard } from '../components/news/NewsCard';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { useNews } from '../hooks/useNews';
import { useSortedNews } from '../hooks/useSortedNews';

export function NewsPage() {
  const { news, loading, error } = useNews();
  const { items: sortedNews } = useSortedNews(news);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-dark-200 text-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-primary-400 mb-8">
          Actualités
        </h1>
        
        {error ? (
          <div className="text-red-400 text-center p-4">
            {error}
          </div>
        ) : sortedNews.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {sortedNews.map((item) => (
              <NewsCard
                key={item.id}
                title={item.title}
                date={new Date(item.published_at)}
                image={item.image_url}
                content={item.content}
              />
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-400 py-8">
            Aucune actualité disponible
          </div>
        )}
      </div>
    </div>
  );
}