import { User2 } from 'lucide-react';

export interface Photo {
  id: string;
  imageUrl: string;
  postedBy: {
    name: string;
    username: string;
    avatar: string;
  };
  timestamp: string;
  caption?: string;
}

interface PhotoCardProps {
  photo: Photo;
}

export function PhotoCard({ photo }: PhotoCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-lg bg-white shadow-sm hover:shadow-lg transition-shadow cursor-pointer">
      <img
        src={photo.imageUrl}
        alt={photo.caption || 'Photo'}
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
          <div className="flex items-center gap-2 mb-1">
            <img
              src={photo.postedBy.avatar}
              alt={photo.postedBy.name}
              className="w-6 h-6 rounded-full object-cover border-2 border-white"
            />
            <div>
              <p className="text-sm font-semibold">{photo.postedBy.name}</p>
              <p className="text-xs text-gray-200">{photo.timestamp}</p>
            </div>
          </div>
          {photo.caption && (
            <p className="text-sm mt-2">{photo.caption}</p>
          )}
        </div>
      </div>
    </div>
  );
}