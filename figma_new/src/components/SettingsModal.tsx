import { useState, useEffect } from 'react';
import { X, User, Bell, Upload, Link } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: {
    name: string;
    username: string;
    avatar: string;
  };
  onUpdateProfile: (data: { name: string; avatar: string }) => void;
  notificationSettings: {
    newPhotos: boolean;
    friendRequests: boolean;
    weeklyDigest: boolean;
  };
  onUpdateNotifications: (settings: {
    newPhotos: boolean;
    friendRequests: boolean;
    weeklyDigest: boolean;
  }) => void;
  initialTab?: 'profile' | 'notifications';
}

export function SettingsModal({
  isOpen,
  onClose,
  currentUser,
  onUpdateProfile,
  notificationSettings,
  onUpdateNotifications,
  initialTab = 'profile',
}: SettingsModalProps) {
  const [activeTab, setActiveTab] = useState<'profile' | 'notifications'>(initialTab);
  const [avatar, setAvatar] = useState(currentUser.avatar);
  const [avatarMode, setAvatarMode] = useState<'file' | 'url'>('file');
  const [localNotificationSettings, setLocalNotificationSettings] = useState(notificationSettings);

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab, isOpen]);

  useEffect(() => {
    setAvatar(currentUser.avatar);
  }, [currentUser.avatar]);

  useEffect(() => {
    setLocalNotificationSettings(notificationSettings);
  }, [notificationSettings]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Create a local URL for preview
      const url = URL.createObjectURL(file);
      setAvatar(url);
    }
  };

  const handleSaveProfile = () => {
    onUpdateProfile({ name: currentUser.name, avatar });
    onClose();
  };

  const handleSaveNotifications = () => {
    onUpdateNotifications(localNotificationSettings);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white rounded-t-2xl z-10">
          <h2 className="text-xl font-bold">Settings</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 sticky top-[73px] bg-white z-10">
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 font-semibold transition-colors ${
              activeTab === 'profile'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <User size={18} />
            Profile
          </button>
          <button
            onClick={() => setActiveTab('notifications')}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 font-semibold transition-colors ${
              activeTab === 'notifications'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Bell size={18} />
            Notifications
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold mb-2">Name</label>
                <input
                  type="text"
                  value={currentUser.name}
                  disabled
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
                />
                <p className="text-xs text-gray-500 mt-1">Your name cannot be changed</p>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Username</label>
                <input
                  type="text"
                  value={currentUser.username}
                  disabled
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
                />
                <p className="text-xs text-gray-500 mt-1">Your username cannot be changed</p>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Avatar</label>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setAvatarMode('file')}
                    className={`px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-semibold ${
                      avatarMode === 'file' ? 'bg-gray-50' : ''
                    }`}
                  >
                    Upload File
                  </button>
                  <button
                    onClick={() => setAvatarMode('url')}
                    className={`px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-semibold ${
                      avatarMode === 'url' ? 'bg-gray-50' : ''
                    }`}
                  >
                    Enter URL
                  </button>
                </div>
              </div>

              {avatarMode === 'file' && (
                <div>
                  <label className="block text-sm font-semibold mb-2">Avatar File</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              )}

              {avatarMode === 'url' && (
                <div>
                  <label className="block text-sm font-semibold mb-2">Avatar URL</label>
                  <input
                    type="text"
                    value={avatar}
                    onChange={(e) => setAvatar(e.target.value)}
                    placeholder="https://example.com/avatar.jpg"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">Enter a URL to an image for your avatar</p>
                </div>
              )}

              {avatar && (
                <div>
                  <label className="block text-sm font-semibold mb-2">Avatar Preview</label>
                  <img
                    src={avatar}
                    alt="Avatar preview"
                    className="w-24 h-24 rounded-full object-cover border-2 border-gray-200"
                    onError={(e) => {
                      e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect fill="%23ddd" width="100" height="100"/%3E%3Ctext fill="%23999" x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle"%3E?%3C/text%3E%3C/svg%3E';
                    }}
                  />
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={onClose}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveProfile}
                  className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold shadow-md"
                >
                  Save Changes
                </button>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-semibold">New Photos</p>
                    <p className="text-sm text-gray-500">Get notified when friends post to your board</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={localNotificationSettings.newPhotos}
                      onChange={(e) =>
                        setLocalNotificationSettings({
                          ...localNotificationSettings,
                          newPhotos: e.target.checked,
                        })
                      }
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-semibold">Friend Requests</p>
                    <p className="text-sm text-gray-500">Get notified of new friend requests</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={localNotificationSettings.friendRequests}
                      onChange={(e) =>
                        setLocalNotificationSettings({
                          ...localNotificationSettings,
                          friendRequests: e.target.checked,
                        })
                      }
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-semibold">Weekly Digest</p>
                    <p className="text-sm text-gray-500">Receive a weekly summary of activity</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={localNotificationSettings.weeklyDigest}
                      onChange={(e) =>
                        setLocalNotificationSettings({
                          ...localNotificationSettings,
                          weeklyDigest: e.target.checked,
                        })
                      }
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={onClose}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveNotifications}
                  className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold shadow-md"
                >
                  Save Changes
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}