import { Photo } from './PhotoCard';

export interface User {
  id: string;
  name: string;
  username: string;
  avatar: string;
  photos: Photo[];
}

interface UserGridProps {
  users: User[];
  currentUserId: string;
  onSelectUser: (userId: string) => void;
}

export function UserGrid({ users, currentUserId, onSelectUser }: UserGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {users.map((user) => {
        const isCurrentUser = user.id === currentUserId;
        const photoCount = user.photos.length;
        const uniqueContributors = new Set(user.photos.map(p => p.postedBy.username)).size;
        
        return (
          <button
            key={user.id}
            onClick={() => onSelectUser(user.id)}
            className="group bg-white rounded-lg shadow-sm hover:shadow-lg transition-all overflow-hidden text-left"
          >
            {/* Preview Grid */}
            <div className="aspect-square bg-gray-100 relative overflow-hidden">
              {photoCount === 0 ? (
                <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                  <span className="text-sm">No photos yet</span>
                </div>
              ) : photoCount === 1 ? (
                <img
                  src={user.photos[0].imageUrl}
                  alt="Board preview"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
              ) : photoCount === 2 ? (
                <div className="grid grid-cols-2 gap-0.5 h-full">
                  {user.photos.slice(0, 2).map((photo) => (
                    <img
                      key={photo.id}
                      src={photo.imageUrl}
                      alt="Board preview"
                      className="w-full h-full object-cover"
                    />
                  ))}
                </div>
              ) : photoCount === 3 ? (
                <div className="grid grid-cols-2 gap-0.5 h-full">
                  <img
                    src={user.photos[0].imageUrl}
                    alt="Board preview"
                    className="w-full h-full object-cover row-span-2"
                  />
                  <img
                    src={user.photos[1].imageUrl}
                    alt="Board preview"
                    className="w-full h-full object-cover"
                  />
                  <img
                    src={user.photos[2].imageUrl}
                    alt="Board preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-0.5 h-full">
                  {user.photos.slice(0, 4).map((photo) => (
                    <img
                      key={photo.id}
                      src={photo.imageUrl}
                      alt="Board preview"
                      className="w-full h-full object-cover"
                    />
                  ))}
                </div>
              )}
              {photoCount > 4 && (
                <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
                  +{photoCount - 4} more
                </div>
              )}
            </div>

            {/* User Info */}
            <div className="p-4">
              <div className="flex items-center gap-3 mb-2">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold truncate">
                    {user.name}
                    {isCurrentUser && (
                      <span className="text-xs text-blue-600 ml-2">(You)</span>
                    )}
                  </h3>
                  <p className="text-sm text-gray-500 truncate">@{user.username}</p>
                </div>
              </div>
              <div className="flex gap-4 text-sm text-gray-600">
                <span>{photoCount} photos</span>
                {photoCount > 0 && (
                  <span>{uniqueContributors} contributors</span>
                )}
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
