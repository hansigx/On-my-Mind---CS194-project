import { X } from 'lucide-react';
import { User } from './UserGrid';

interface UploadSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  users: User[];
  currentUserId: string;
  onSelectUser: (userId: string) => void;
  hasUploadedPhoto?: boolean;
}

export function UploadSelector({ isOpen, onClose, users, currentUserId, onSelectUser, hasUploadedPhoto = false }: UploadSelectorProps) {
  const friendUsers = users.filter(u => u.id !== currentUserId);

  const handleSelectUser = (userId: string) => {
    onSelectUser(userId);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white rounded-t-2xl">
          <h2 className="text-xl font-bold">
            {hasUploadedPhoto ? "Choose Friend's Board" : "Choose a Friend's Board"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Description */}
        <div className="px-6 py-4 bg-gradient-to-r from-blue-50 to-purple-50">
          <p className="text-sm text-gray-600">
            {hasUploadedPhoto 
              ? "Select which friend's quilt to add your photo to"
              : "Select which friend's quilt you'd like to add a photo to"
            }
          </p>
        </div>

        {/* Friends List */}
        <div className="p-4">
          <div className="space-y-2">
            {friendUsers.map((user) => (
              <button
                key={user.id}
                onClick={() => handleSelectUser(user.id)}
                className="w-full p-4 flex items-center gap-4 hover:bg-gray-50 rounded-xl transition-colors border border-gray-200 hover:border-blue-300"
              >
                {/* Avatar */}
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-14 h-14 rounded-full object-cover"
                />

                {/* User Info */}
                <div className="flex-1 text-left">
                  <p className="font-semibold text-gray-900">{user.name}</p>
                  <p className="text-sm text-gray-500">@{user.username}</p>
                </div>

                {/* Photo Count */}
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-600">
                    {user.photos.length}
                  </p>
                  <p className="text-xs text-gray-500">
                    {user.photos.length === 1 ? 'photo' : 'photos'}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}