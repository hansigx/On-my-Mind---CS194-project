import { Users, Upload, Bell, Settings } from 'lucide-react';

interface BottomNavigationProps {
  onHomeClick: () => void;
  onUploadClick: () => void;
  onNotificationsClick: () => void;
  onSettingsClick: () => void;
  activeTab?: 'home' | 'upload' | 'notifications' | 'settings';
}

export function BottomNavigation({ 
  onHomeClick, 
  onUploadClick, 
  onNotificationsClick,
  onSettingsClick,
  activeTab = 'home'
}: BottomNavigationProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-40">
      <div className="max-w-2xl mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          {/* Home/Friends Icon */}
          <button
            onClick={onHomeClick}
            className={`flex flex-col items-center gap-1 p-3 rounded-xl transition-all ${
              activeTab === 'home'
                ? 'bg-blue-100 text-blue-600'
                : 'text-gray-500 hover:bg-gray-100'
            }`}
          >
            <Users size={24} />
            <span className="text-xs font-semibold">Friends</span>
          </button>

          {/* Upload Icon */}
          <button
            onClick={onUploadClick}
            className={`flex flex-col items-center gap-1 p-3 rounded-xl transition-all ${
              activeTab === 'upload'
                ? 'bg-blue-100 text-blue-600'
                : 'text-gray-500 hover:bg-gray-100'
            }`}
          >
            <Upload size={24} />
            <span className="text-xs font-semibold">Upload</span>
          </button>

          {/* Notifications Icon */}
          <button
            onClick={onNotificationsClick}
            className={`flex flex-col items-center gap-1 p-3 rounded-xl transition-all ${
              activeTab === 'notifications'
                ? 'bg-blue-100 text-blue-600'
                : 'text-gray-500 hover:bg-gray-100'
            }`}
          >
            <Bell size={24} />
            <span className="text-xs font-semibold">Notifications</span>
          </button>

          {/* Settings Icon */}
          <button
            onClick={onSettingsClick}
            className={`flex flex-col items-center gap-1 p-3 rounded-xl transition-all ${
              activeTab === 'settings'
                ? 'bg-blue-100 text-blue-600'
                : 'text-gray-500 hover:bg-gray-100'
            }`}
          >
            <Settings size={24} />
            <span className="text-xs font-semibold">Settings</span>
          </button>
        </div>
      </div>
    </div>
  );
}