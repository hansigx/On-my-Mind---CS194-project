import { X, Trash2 } from 'lucide-react';
import { Photo } from './PhotoCard';
import { useState } from 'react';

interface PhotoViewerProps {
  photo: Photo;
  onClose: () => void;
  currentUserId?: string;
  onDelete?: (photoId: string) => void;
}

export function PhotoViewer({ photo, onClose, currentUserId, onDelete }: PhotoViewerProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Check if current user posted this photo
  const canDelete = currentUserId && photo.postedBy.username === 'you'; // Current user's username is 'you'
  
  const handleDelete = async () => {
    if (!onDelete || !window.confirm('Are you sure you want to delete this photo?')) {
      return;
    }
    
    setIsDeleting(true);
    try {
      await onDelete(photo.id);
      onClose();
    } catch (err) {
      console.error('Error deleting photo:', err);
      alert('Failed to delete photo. Please try again.');
      setIsDeleting(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors text-white z-10"
      >
        <X size={24} />
      </button>

      {/* Delete button - only show if user can delete */}
      {canDelete && onDelete && (
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className="absolute top-4 right-20 p-2 bg-red-500/80 hover:bg-red-600/90 rounded-full transition-colors text-white z-10 disabled:opacity-50 disabled:cursor-not-allowed"
          title="Delete photo"
        >
          <Trash2 size={24} />
        </button>
      )}

      {/* Photo and details */}
      <div 
        className="max-w-5xl w-full max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Image */}
        <div className="flex-1 flex items-center justify-center mb-4">
          <img
            src={photo.imageUrl}
            alt={photo.caption || 'Photo'}
            className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-2xl"
          />
        </div>

        {/* Details */}
        <div className="bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-xl">
          <div className="flex items-center gap-3 mb-2">
            <img
              src={photo.postedBy.avatar}
              alt={photo.postedBy.name}
              className="w-10 h-10 rounded-full object-cover"
            />
            <div className="flex-1">
              <p className="font-semibold text-gray-900">{photo.postedBy.name}</p>
              <p className="text-sm text-gray-500">@{photo.postedBy.username}</p>
            </div>
            <span className="text-sm text-gray-500">{photo.timestamp}</span>
          </div>
          {photo.caption && (
            <p className="text-gray-700 mt-2">{photo.caption}</p>
          )}
        </div>
      </div>
    </div>
  );
}