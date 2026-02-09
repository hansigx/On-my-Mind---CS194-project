import { useState, useEffect } from 'react';
import { X, User, Image } from 'lucide-react';
import * as api from '../utils/api';

interface Notification {
  id: string;
  type: 'photo' | 'friend';
  message: string;
  timestamp: string;
  read: boolean;
  avatar: string;
}

interface NotificationsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NotificationsPanel({ isOpen, onClose }: NotificationsPanelProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadNotifications();
    }
  }, [isOpen]);

  async function loadNotifications() {
    try {
      setIsLoading(true);
      const data = await api.getNotifications();
      setNotifications(data);
    } catch (err) {
      console.error('Error loading notifications:', err);
    } finally {
      setIsLoading(false);
    }
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white rounded-t-2xl">
          <h2 className="text-xl font-bold">Notifications</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Notifications List */}
        <div className="divide-y divide-gray-100">
          {isLoading ? (
            <div className="py-16 px-4 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Image size={32} className="text-gray-400" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">Loading...</h3>
              <p className="text-sm text-gray-500">
                Fetching your notifications
              </p>
            </div>
          ) : notifications.length > 0 ? (
            notifications.map((notification) => (
              <div
                key={notification.id}
                className="p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start gap-3">
                  {/* User Avatar */}
                  <img
                    src={notification.avatar}
                    alt="User"
                    className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                  />

                  {/* Notification Content */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm">
                      <span className="font-semibold text-gray-900">
                        User
                      </span>{' '}
                      <span className="text-gray-600">{notification.message}</span>
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {notification.timestamp}
                    </p>
                  </div>

                  {/* Friend Request Icon */}
                  {notification.type === 'friend' && (
                    <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <User size={24} className="text-blue-600" />
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="py-16 px-4 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Image size={32} className="text-gray-400" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">No notifications yet</h3>
              <p className="text-sm text-gray-500">
                When friends add photos to your quilt, you'll see them here
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}