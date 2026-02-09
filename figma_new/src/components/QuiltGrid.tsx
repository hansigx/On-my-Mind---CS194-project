import { useState } from 'react';
import { Photo, PhotoCard } from './PhotoCard';
import { PhotoViewer } from './PhotoViewer';

interface QuiltGridProps {
  photos: Photo[];
  currentUserId?: string;
  onDeletePhoto?: (photoId: string) => void;
}

export function QuiltGrid({ photos, currentUserId, onDeletePhoto }: QuiltGridProps) {
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);

  // Create a quilt pattern by assigning different sizes to photos
  const getPhotoSize = (index: number): string => {
    const pattern = [
      'col-span-2 row-span-2', // Large square
      'col-span-1 row-span-1', // Small
      'col-span-1 row-span-2', // Tall
      'col-span-2 row-span-1', // Wide
      'col-span-1 row-span-1', // Small
      'col-span-1 row-span-1', // Small
    ];
    return pattern[index % pattern.length];
  };

  if (photos.length === 0) {
    return null;
  }

  return (
    <>
      <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 auto-rows-[150px] gap-3 w-full">
        {photos.map((photo, index) => (
          <div 
            key={photo.id} 
            className={getPhotoSize(index)}
            onClick={() => setSelectedPhoto(photo)}
          >
            <PhotoCard photo={photo} />
          </div>
        ))}
      </div>

      {selectedPhoto && (
        <PhotoViewer
          photo={selectedPhoto}
          onClose={() => setSelectedPhoto(null)}
          currentUserId={currentUserId}
          onDelete={onDeletePhoto}
        />
      )}
    </>
  );
}