export interface User {
  id: string;
  name: string;
  username: string;
  avatar: string;
  photos: Photo[];
}

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

export interface Notification {
  id: string;
  type: 'photo' | 'friend';
  message: string;
  timestamp: string;
  read: boolean;
  avatar: string;
  friendRequestId?: string;
}

export interface NotificationSettings {
  newPhotos: boolean;
  friendRequests: boolean;
  weeklyDigest: boolean;
}
