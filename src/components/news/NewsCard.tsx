import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Card } from '../ui/Card';

interface NewsCardProps {
  title: string;
  date: Date;
  image: string;
  content: string;
}

export function NewsCard({ title, date, image, content }: NewsCardProps) {
  return (
    <Card className="overflow-hidden">
      <img
        src={image}
        alt={title}
        className="w-full h-48 object-cover"
      />
      <div className="p-6">
        <div className="text-sm text-primary-400 mb-2">
          {format(date, 'dd MMMM yyyy', { locale: fr })}
        </div>
        <h3 className="text-xl font-bold text-gray-100 mb-4">
          {title}
        </h3>
        <p className="text-gray-400">
          {content}
        </p>
      </div>
    </Card>
  );
}