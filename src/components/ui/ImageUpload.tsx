import { useRef } from 'react';
import { Upload } from 'lucide-react';
import { Button } from './Button';
import { useImageUpload } from '../../hooks/useImageUpload';

interface ImageUploadProps {
  bucket: string;
  path?: string;
  currentImage?: string | null;
  onImageUpload: (url: string) => void;
  className?: string;
}

export function ImageUpload({
  bucket,
  path,
  currentImage,
  onImageUpload,
  className = ''
}: ImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { uploadImage, uploading, error } = useImageUpload({ bucket, path });

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const url = await uploadImage(file);
      onImageUpload(url);
    } catch (err) {
      console.error('Error uploading image:', err);
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {error && (
        <div className="text-red-400 text-sm">{error}</div>
      )}
      
      <div className="flex flex-col items-center gap-4">
        <div className="relative w-full aspect-video">
          {currentImage ? (
            <img
              src={currentImage}
              alt="Preview"
              className="w-full h-full object-cover rounded-lg"
            />
          ) : (
            <div className="w-full h-full rounded-lg bg-dark-300 flex items-center justify-center">
              <Upload className="w-8 h-8 text-gray-400" />
            </div>
          )}
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          disabled={uploading}
          className="hidden"
        />

        <Button
          type="button"
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
        >
          {uploading ? 'Téléchargement...' : 'Changer l\'image'}
        </Button>
      </div>
    </div>
  );
}