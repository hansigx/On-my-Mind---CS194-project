// import 'react-native-url-polyfill/auto';
// const USE_MOCK = true;

// const projectId = 'YOUR_PROJECT_ID';
// const publicAnonKey = 'YOUR_ANON_KEY';

// const API_BASE_URL = `https://${projectId}.supabase.co/functions/v1/make-server-afd6797b`;

// async function fetchAPI(endpoint: string, options: RequestInit = {}) {
//   const response = await fetch(`${API_BASE_URL}${endpoint}`, {
//     ...options,
//     headers: {
//       'Content-Type': 'application/json',
//       'Authorization': `Bearer ${publicAnonKey}`,
//       ...options.headers,
//     },
//   });

//   if (!response.ok) {
//     const error = await response.json().catch(() => ({ error: 'Request failed' }));
//     throw new Error(error.error || 'Request failed');
//   }

//   return response.json();
// }

// export async function initializeData() {
//   return fetchAPI('/init', { method: 'POST' });
// }

// export async function resetData() {
//   return fetchAPI('/reset', { method: 'POST' });
// }

// export async function getUsers() {
//   const data = await fetchAPI('/users');
//   return data.users;
// }

// export async function getUser(userId: string) {
//   const data = await fetchAPI(`/users/${userId}`);
//   return data.user;
// }

// export async function updateUserProfile(userId: string, profile: { name: string; avatar: string }) {
//   const data = await fetchAPI(`/users/${userId}`, {
//     method: 'PUT',
//     body: JSON.stringify(profile),
//   });
//   return data.user;
// }

// export async function addPhotoToBoard(userId: string, photo: {
//   imageUrl: string;
//   caption?: string;
//   postedBy: {
//     name: string;
//     username: string;
//     avatar: string;
//   };
// }) {
//   const data = await fetchAPI(`/users/${userId}/photos`, {
//     method: 'POST',
//     body: JSON.stringify(photo),
//   });
//   return data.photo;
// }

// export async function deletePhotoFromBoard(userId: string, photoId: string) {
//   await fetchAPI(`/users/${userId}/photos/${photoId}`, {
//     method: 'DELETE',
//   });
// }

// export async function uploadFile(fileUri: string, fileName: string, fileType: string): Promise<string> {
//   const formData = new FormData();
//   formData.append('file', {
//     uri: fileUri,
//     name: fileName,
//     type: fileType,
//   } as any);

//   const response = await fetch(`${API_BASE_URL}/upload`, {
//     method: 'POST',
//     headers: {
//       'Authorization': `Bearer ${publicAnonKey}`,
//     },
//     body: formData,
//   });

//   if (!response.ok) {
//     const error = await response.json().catch(() => ({ error: 'Upload failed' }));
//     throw new Error(error.error || 'Upload failed');
//   }

//   const data = await response.json();
//   return data.url;
// }

// export async function getNotifications() {
//   const data = await fetchAPI('/notifications');
//   return data.notifications;
// }

// export async function getNotificationSettings() {
//   const data = await fetchAPI('/settings/notifications');
//   return data.settings;
// }

// export async function updateNotificationSettings(settings: {
//   newPhotos: boolean;
//   friendRequests: boolean;
//   weeklyDigest: boolean;
// }) {
//   const data = await fetchAPI('/settings/notifications', {
//     method: 'PUT',
//     body: JSON.stringify(settings),
//   });
//   return data.settings;
// }

// export async function getFriendRequests() {
//   const data = await fetchAPI('/friend-requests');
//   return data.requests;
// }

// export async function acceptFriendRequest(requestId: string, permissionLevel: 'viewer' | 'editor') {
//   const data = await fetchAPI(`/friend-requests/${requestId}/accept`, {
//     method: 'POST',
//     body: JSON.stringify({ permissionLevel }),
//   });
//   return data.request;
// }

// export async function declineFriendRequest(requestId: string) {
//   const data = await fetchAPI(`/friend-requests/${requestId}/block`, {
//     method: 'POST',
//   });
//   return data.request;
// }

import "react-native-url-polyfill/auto";
import { User, Notification } from "../types";

const USE_MOCK = true;

// --- Supabase placeholders (for later) ---
const projectId = "YOUR_PROJECT_ID";
const publicAnonKey = "YOUR_ANON_KEY";
const API_BASE_URL = `https://${projectId}.supabase.co/functions/v1/make-server-afd6797b`;

// --- Mock in-memory DB (for now) ---
let mockUsers: User[] = [
  {
    id: "1",
    name: "You",
    username: "@you",
    avatar:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=200&h=200&fit=crop",
    photos: [
      {
        id: "p1",
        imageUrl:
          "https://images.unsplash.com/photo-1520975682031-a9ce6a2f3f9b?w=800&fit=crop",
        caption: "first memory 🧵",
        timestamp: Date.now() - 1000 * 60 * 60 * 24 * 2,
        postedBy: {
          name: "A friend",
          username: "@friend",
          avatar:
            "https://images.unsplash.com/photo-1502685104226-ee32379fefbe?w=200&h=200&fit=crop",
        },
      },
    ],
  },
  {
    id: "2",
    name: "Ishvi",
    username: "@ishvi",
    avatar:
      "https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=200&h=200&fit=crop",
    photos: [],
  },
  {
    id: "3",
    name: "Joaquin",
    username: "@joaquin",
    avatar:
      "https://images.unsplash.com/photo-1552058544-f2b08422138a?w=200&h=200&fit=crop",
    photos: [],
  },
];

let mockNotifications: Notification[] = [
  {
    id: "n1",
    type: "photo",
    message: "Someone posted a photo to your board",
    timestamp: Date.now() - 1000 * 60 * 60 * 5,
    read: false,
    avatar:
      "https://images.unsplash.com/photo-1502685104226-ee32379fefbe?w=200&h=200&fit=crop",
  },
  {
    id: "n2",
    type: "friend",
    message: "New friend request",
    timestamp: Date.now() - 1000 * 60 * 60 * 24,
    read: true,
    avatar:
      "https://images.unsplash.com/photo-1552058544-f2b08422138a?w=200&h=200&fit=crop",
    friendRequestId: "fr1",
  },
];

let mockNotificationSettings = {
  newPhotos: true,
  friendRequests: true,
  weeklyDigest: false,
};

let mockFriendRequests = [
  {
    id: "fr1",
    fromUserId: "3",
    fromName: "Joaquin",
    fromUsername: "@joaquin",
    fromAvatar:
      "https://images.unsplash.com/photo-1552058544-f2b08422138a?w=200&h=200&fit=crop",
    timestamp: Date.now() - 1000 * 60 * 60 * 24,
  },
];

// --- Real fetch (for later) ---
async function fetchAPI(endpoint: string, options: RequestInit = {}) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${publicAnonKey}`,
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: "Request failed" }));
    throw new Error(error.error || "Request failed");
  }

  return response.json();
}

// --- Exported API (mock-aware) ---
export async function initializeData() {
  if (USE_MOCK) return { ok: true };
  return fetchAPI("/init", { method: "POST" });
}

export async function resetData() {
  if (USE_MOCK) {
    // reset to initial state (quick + simple)
    mockUsers = mockUsers.map((u) => (u.id === "1" ? u : { ...u, photos: [] }));
    return { ok: true };
  }
  return fetchAPI("/reset", { method: "POST" });
}

export async function getUsers() {
  if (USE_MOCK) return mockUsers;
  const data = await fetchAPI("/users");
  return data.users;
}

export async function getUser(userId: string) {
  if (USE_MOCK) {
    const user = mockUsers.find((u) => u.id === userId);
    if (!user) throw new Error("User not found");
    return user;
  }
  const data = await fetchAPI(`/users/${userId}`);
  return data.user;
}

export async function updateUserProfile(
  userId: string,
  profile: { name: string; avatar: string }
) {
  if (USE_MOCK) {
    mockUsers = mockUsers.map((u) => (u.id === userId ? { ...u, ...profile } : u));
    const updated = mockUsers.find((u) => u.id === userId)!;
    return updated;
  }
  const data = await fetchAPI(`/users/${userId}`, {
    method: "PUT",
    body: JSON.stringify(profile),
  });
  return data.user;
}

export async function addPhotoToBoard(
  userId: string,
  photo: {
    imageUrl: string;
    caption?: string;
    postedBy: {
      name: string;
      username: string;
      avatar: string;
    };
  }
) {
  if (USE_MOCK) {
    const newPhoto = {
      id: `p_${Date.now()}`,
      imageUrl: photo.imageUrl,
      caption: photo.caption,
      timestamp: Date.now(),
      postedBy: photo.postedBy,
    };

    mockUsers = mockUsers.map((u) =>
      u.id === userId ? { ...u, photos: [newPhoto, ...(u.photos ?? [])] } : u
    );

    // also add a notification for the owner of that board
    mockNotifications = [
      {
        id: `n_${Date.now()}`,
        type: "photo",
        message: `${photo.postedBy.name} posted a photo to your board`,
        timestamp: Date.now(),
        read: false,
        avatar: photo.postedBy.avatar,
      },
      ...mockNotifications,
    ];

    return newPhoto;
  }

  const data = await fetchAPI(`/users/${userId}/photos`, {
    method: "POST",
    body: JSON.stringify(photo),
  });
  return data.photo;
}

export async function deletePhotoFromBoard(userId: string, photoId: string) {
  if (USE_MOCK) {
    mockUsers = mockUsers.map((u) =>
      u.id === userId ? { ...u, photos: (u.photos ?? []).filter((p) => p.id !== photoId) } : u
    );
    return;
  }

  await fetchAPI(`/users/${userId}/photos/${photoId}`, {
    method: "DELETE",
  });
}

export async function uploadFile(fileUri: string, _fileName: string, _fileType: string) {
  // mock: just return the local URI so the UI can render it immediately
  if (USE_MOCK) return fileUri;

  const formData = new FormData();
  formData.append(
    "file",
    {
      uri: fileUri,
      name: _fileName,
      type: _fileType,
    } as any
  );

  const response = await fetch(`${API_BASE_URL}/upload`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${publicAnonKey}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: "Upload failed" }));
    throw new Error(error.error || "Upload failed");
  }

  const data = await response.json();
  return data.url;
}

export async function getNotifications() {
  if (USE_MOCK) return mockNotifications;
  const data = await fetchAPI("/notifications");
  return data.notifications;
}

export async function getNotificationSettings() {
  if (USE_MOCK) return mockNotificationSettings;
  const data = await fetchAPI("/settings/notifications");
  return data.settings;
}

export async function updateNotificationSettings(settings: {
  newPhotos: boolean;
  friendRequests: boolean;
  weeklyDigest: boolean;
}) {
  if (USE_MOCK) {
    mockNotificationSettings = { ...settings };
    return mockNotificationSettings;
  }
  const data = await fetchAPI("/settings/notifications", {
    method: "PUT",
    body: JSON.stringify(settings),
  });
  return data.settings;
}

export async function getFriendRequests() {
  if (USE_MOCK) return mockFriendRequests;
  const data = await fetchAPI("/friend-requests");
  return data.requests;
}

export async function acceptFriendRequest(requestId: string, _permissionLevel: "viewer" | "editor") {
  if (USE_MOCK) {
    mockFriendRequests = mockFriendRequests.filter((r) => r.id !== requestId);
    return { id: requestId, status: "accepted" };
  }
  const data = await fetchAPI(`/friend-requests/${requestId}/accept`, {
    method: "POST",
    body: JSON.stringify({ permissionLevel: _permissionLevel }),
  });
  return data.request;
}

export async function declineFriendRequest(requestId: string) {
  if (USE_MOCK) {
    mockFriendRequests = mockFriendRequests.filter((r) => r.id !== requestId);
    return { id: requestId, status: "declined" };
  }
  const data = await fetchAPI(`/friend-requests/${requestId}/block`, {
    method: "POST",
  });
  return data.request;
}
