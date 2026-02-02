import { useState, useEffect } from 'react';
import { User } from './components/UserGrid';
import { CircleNavigation } from './components/CircleNavigation';
import { BoardView } from './components/BoardView';
import { PostPhotoModal } from './components/PostPhotoModal';
import { SettingsModal } from './components/SettingsModal';
import { Photo } from './components/PhotoCard';
import { SearchBar } from './components/SearchBar';
import { BottomNavigation } from './components/BottomNavigation';
import { NotificationsPanel } from './components/NotificationsPanel';
import { UploadSelector } from './components/UploadSelector';
import { UploadPhotoModal } from './components/UploadPhotoModal';
import { ShareInviteModal } from './components/ShareInviteModal';
import * as api from './utils/api';

const currentUserId = '1';

export default function App() {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [postTargetUserId, setPostTargetUserId] = useState<string | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [settingsInitialTab, setSettingsInitialTab] = useState<'profile' | 'notifications'>('profile');
  const [notificationSettings, setNotificationSettings] = useState({
    newPhotos: true,
    friendRequests: true,
    weeklyDigest: false,
  });
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isUploadSelectorOpen, setIsUploadSelectorOpen] = useState(false);
  const [isUploadPhotoModalOpen, setIsUploadPhotoModalOpen] = useState(false);
  const [uploadedImageUrl, setUploadedImageUrl] = useState('');
  const [uploadedCaption, setUploadedCaption] = useState('');
  const [activeNavTab, setActiveNavTab] = useState<'home' | 'upload' | 'notifications' | 'settings'>('home');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isShareInviteOpen, setIsShareInviteOpen] = useState(false);

  // Initialize data and load users on mount
  useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true);
        setError(null);
        
        // Initialize data if needed
        await api.initializeData();
        
        // Load users
        const loadedUsers = await api.getUsers();
        setUsers(loadedUsers);
        
        // Load notification settings
        const settings = await api.getNotificationSettings();
        setNotificationSettings(settings);
      } catch (err) {
        console.error('Error loading data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load data');
      } finally {
        setIsLoading(false);
      }
    }
    
    loadData();
  }, []);

  const selectedUser = users.find(u => u.id === selectedUserId);
  const postTargetUser = users.find(u => u.id === postTargetUserId);
  const currentUser = users.find(u => u.id === currentUserId);

  const handleSelectUser = (userId: string) => {
    setSelectedUserId(userId);
  };

  const handleBack = () => {
    setSelectedUserId(null);
  };

  const handlePostToBoard = () => {
    setPostTargetUserId(selectedUserId);
    setIsPostModalOpen(true);
  };

  const handlePost = async (imageUrl: string, caption: string) => {
    if (!postTargetUserId || !currentUser) return;

    try {
      await api.addPhotoToBoard(postTargetUserId, {
        imageUrl,
        caption,
        postedBy: {
          name: currentUser.name,
          username: currentUser.username,
          avatar: currentUser.avatar,
        },
      });

      // Reload users to get updated data
      const loadedUsers = await api.getUsers();
      setUsers(loadedUsers);
    } catch (err) {
      console.error('Error posting photo:', err);
      alert('Failed to post photo. Please try again.');
    }
  };

  const handleUpdateProfile = async (data: { name: string; avatar: string }) => {
    try {
      // If avatar is a blob URL (uploaded file), upload it first
      let avatarUrl = data.avatar;
      if (data.avatar.startsWith('blob:')) {
        const response = await fetch(data.avatar);
        const blob = await response.blob();
        const file = new File([blob], 'avatar.jpg', { type: blob.type });
        avatarUrl = await api.uploadFile(file);
      }

      await api.updateUserProfile(currentUserId, {
        name: data.name,
        avatar: avatarUrl,
      });

      // Reload users to get updated data
      const loadedUsers = await api.getUsers();
      setUsers(loadedUsers);
    } catch (err) {
      console.error('Error updating profile:', err);
      alert('Failed to update profile. Please try again.');
    }
  };

  const handleAddFriend = (userId: string) => {
    // Open the share invite modal
    setIsShareInviteOpen(true);
  };

  const handleHomeClick = () => {
    setActiveNavTab('home');
    setSelectedUserId(null);
  };

  const handleUploadClick = () => {
    setActiveNavTab('upload');
    setIsUploadPhotoModalOpen(true);
  };

  const handleNotificationsClick = () => {
    setActiveNavTab('notifications');
    setIsNotificationsOpen(true);
  };

  const handleContinueToFriendSelection = async (imageUrl: string, caption: string) => {
    try {
      // If imageUrl is a blob URL (uploaded file), upload it first
      let finalImageUrl = imageUrl;
      if (imageUrl.startsWith('blob:')) {
        const response = await fetch(imageUrl);
        const blob = await response.blob();
        const file = new File([blob], 'photo.jpg', { type: blob.type });
        finalImageUrl = await api.uploadFile(file);
      }
      
      setUploadedImageUrl(finalImageUrl);
      setUploadedCaption(caption);
      setIsUploadPhotoModalOpen(false);
      setIsUploadSelectorOpen(true);
    } catch (err) {
      console.error('Error uploading photo:', err);
      alert('Failed to upload photo. Please try again.');
    }
  };

  const handleUploadSelectUser = async (userId: string) => {
    // Post the uploaded photo to the selected friend's board
    if (!currentUser || !uploadedImageUrl) return;

    try {
      await api.addPhotoToBoard(userId, {
        imageUrl: uploadedImageUrl,
        caption: uploadedCaption,
        postedBy: {
          name: currentUser.name,
          username: currentUser.username,
          avatar: currentUser.avatar,
        },
      });

      // Reload users to get updated data
      const loadedUsers = await api.getUsers();
      setUsers(loadedUsers);

      // Reset upload state
      setUploadedImageUrl('');
      setUploadedCaption('');
    } catch (err) {
      console.error('Error posting photo:', err);
      alert('Failed to post photo. Please try again.');
    }
  };

  const handleSettingsClick = () => {
    setActiveNavTab('settings');
    setSettingsInitialTab('profile');
    setIsSettingsOpen(true);
  };

  const handleUpdateNotificationSettings = async (settings: {
    newPhotos: boolean;
    friendRequests: boolean;
    weeklyDigest: boolean;
  }) => {
    try {
      await api.updateNotificationSettings(settings);
      setNotificationSettings(settings);
    } catch (err) {
      console.error('Error updating notification settings:', err);
      alert('Failed to update notification settings. Please try again.');
    }
  };

  const handleDeletePhoto = async (photoId: string) => {
    if (!selectedUserId) return;

    try {
      await api.deletePhotoFromBoard(selectedUserId, photoId);

      // Reload users to get updated data
      const loadedUsers = await api.getUsers();
      setUsers(loadedUsers);
    } catch (err) {
      console.error('Error deleting photo:', err);
      throw err; // Re-throw so PhotoViewer can handle the error
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-semibold">Loading Quilts...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="bg-red-100 text-red-600 p-4 rounded-lg mb-4">
            <p className="font-semibold mb-2">Error loading data</p>
            <p className="text-sm">{error}</p>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
          >
            Reload Page
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Search Bar - only show on home/friends view */}
      {!selectedUser && (
        <SearchBar
          users={users}
          currentUserId={currentUserId}
          onSelectUser={handleSelectUser}
        />
      )}

      {/* Main Content with top padding for search bar */}
      <div className={!selectedUser ? 'pt-20' : ''}>
        {!selectedUser ? (
          <CircleNavigation
            users={users}
            currentUserId={currentUserId}
            onSelectUser={handleSelectUser}
            onOpenSettings={() => {
              setSettingsInitialTab('profile');
              setIsSettingsOpen(true);
            }}
            onOpenAddFriends={handleAddFriend}
          />
        ) : (
          <BoardView
            user={selectedUser}
            photos={selectedUser.photos}
            onBack={handleBack}
            onPostToBoard={handlePostToBoard}
            isOwnBoard={selectedUser.id === currentUserId}
            currentUserId={currentUserId}
            onDeletePhoto={handleDeletePhoto}
          />
        )}
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation
        onHomeClick={handleHomeClick}
        onUploadClick={handleUploadClick}
        onNotificationsClick={handleNotificationsClick}
        onSettingsClick={handleSettingsClick}
        activeTab={activeNavTab}
      />

      {/* Upload Photo Modal - First Step */}
      <UploadPhotoModal
        isOpen={isUploadPhotoModalOpen}
        onClose={() => setIsUploadPhotoModalOpen(false)}
        onContinueToFriendSelection={handleContinueToFriendSelection}
      />

      {/* Upload Selector Modal - Second Step */}
      <UploadSelector
        isOpen={isUploadSelectorOpen}
        onClose={() => {
          setIsUploadSelectorOpen(false);
          setUploadedImageUrl('');
          setUploadedCaption('');
        }}
        users={users}
        currentUserId={currentUserId}
        onSelectUser={handleUploadSelectUser}
        hasUploadedPhoto={!!uploadedImageUrl}
      />

      {/* Notifications Panel */}
      <NotificationsPanel
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
      />

      {postTargetUser && (
        <PostPhotoModal
          isOpen={isPostModalOpen}
          onClose={() => {
            setIsPostModalOpen(false);
            setPostTargetUserId(null);
          }}
          targetUser={postTargetUser}
          onPost={handlePost}
        />
      )}

      {currentUser && (
        <SettingsModal
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
          currentUser={currentUser}
          onUpdateProfile={handleUpdateProfile}
          notificationSettings={notificationSettings}
          onUpdateNotifications={handleUpdateNotificationSettings}
          initialTab={settingsInitialTab}
        />
      )}

      {/* Share Invite Modal */}
      {currentUser && (
        <ShareInviteModal
          isOpen={isShareInviteOpen}
          onClose={() => setIsShareInviteOpen(false)}
          currentUser={currentUser}
        />
      )}
    </div>
  );
}