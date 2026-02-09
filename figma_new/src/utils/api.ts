import { projectId, publicAnonKey } from './supabase/info';

const API_BASE_URL = `https://${projectId}.supabase.co/functions/v1/make-server-afd6797b`;

async function fetchAPI(endpoint: string, options: RequestInit = {}) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${publicAnonKey}`,
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || 'Request failed');
  }

  return response.json();
}

export async function initializeData() {
  return fetchAPI('/init', { method: 'POST' });
}

export async function getUsers() {
  const data = await fetchAPI('/users');
  return data.users;
}

export async function getUser(userId: string) {
  const data = await fetchAPI(`/users/${userId}`);
  return data.user;
}

export async function updateUserProfile(userId: string, profile: { name: string; avatar: string }) {
  const data = await fetchAPI(`/users/${userId}`, {
    method: 'PUT',
    body: JSON.stringify(profile),
  });
  return data.user;
}

export async function addPhotoToBoard(userId: string, photo: {
  imageUrl: string;
  caption?: string;
  postedBy: {
    name: string;
    username: string;
    avatar: string;
  };
}) {
  const data = await fetchAPI(`/users/${userId}/photos`, {
    method: 'POST',
    body: JSON.stringify(photo),
  });
  return data.photo;
}

export async function deletePhotoFromBoard(userId: string, photoId: string) {
  await fetchAPI(`/users/${userId}/photos/${photoId}`, {
    method: 'DELETE',
  });
}

export async function uploadFile(file: File): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${API_BASE_URL}/upload`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${publicAnonKey}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Upload failed' }));
    throw new Error(error.error || 'Upload failed');
  }

  const data = await response.json();
  return data.url;
}

export async function getNotifications() {
  const data = await fetchAPI('/notifications');
  return data.notifications;
}

export async function getNotificationSettings() {
  const data = await fetchAPI('/settings/notifications');
  return data.settings;
}

export async function updateNotificationSettings(settings: {
  newPhotos: boolean;
  friendRequests: boolean;
  weeklyDigest: boolean;
}) {
  const data = await fetchAPI('/settings/notifications', {
    method: 'PUT',
    body: JSON.stringify(settings),
  });
  return data.settings;
}