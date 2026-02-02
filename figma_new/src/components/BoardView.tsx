import { Photo, PhotoCard } from './PhotoCard';
import { QuiltGrid } from './QuiltGrid';
import { ArrowLeft, Plus } from 'lucide-react';

interface BoardViewProps {
  user: {
    name: string;
    username: string;
    avatar: string;
  };
  photos: Photo[];
  onBack: () => void;
  onPostToBoard: () => void;
  isOwnBoard: boolean;
  currentUserId?: string;
  onDeletePhoto?: (photoId: string) => void;
}

export function BoardView({ user, photos, onBack, onPostToBoard, isOwnBoard, currentUserId, onDeletePhoto }: BoardViewProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={onBack}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <ArrowLeft size={24} />
              </button>
              <div className="flex items-center gap-3">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-14 h-14 rounded-full object-cover border-2 border-blue-100"
                />
                <div>
                  <h1 className="text-xl font-bold">{user.name}'s Quilt</h1>
                  <p className="text-sm text-gray-500">
                    {photos.length} {photos.length === 1 ? 'photo' : 'photos'}
                  </p>
                </div>
              </div>
            </div>
            {!isOwnBoard && (
              <button
                onClick={onPostToBoard}
                className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg font-semibold"
              >
                <Plus size={20} />
                <span>Add Photo</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Board Content */}
      <div className="max-w-7xl mx-auto px-4 py-8 pb-28">
        {photos.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full mx-auto mb-4 flex items-center justify-center">
              <Plus size={40} className="text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold mb-2">
              {isOwnBoard ? 'Your quilt is empty' : `${user.name}'s quilt is empty`}
            </h2>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
              {isOwnBoard
                ? 'Your friends can add photos to your quilt to create a beautiful collection of shared memories'
                : 'Be the first to add a photo and start creating their quilt!'}
            </p>
            {!isOwnBoard && (
              <button
                onClick={onPostToBoard}
                className="px-6 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors shadow-md font-semibold"
              >
                Add First Photo
              </button>
            )}
          </div>
        ) : (
          <QuiltGrid photos={photos} currentUserId={currentUserId} onDeletePhoto={onDeletePhoto} />
        )}
      </div>
    </div>
  );
}