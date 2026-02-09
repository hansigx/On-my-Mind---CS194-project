import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "npm:@supabase/supabase-js@2";
import * as kv from "./kv_store.tsx";

const app = new Hono();

// Initialize Supabase client with service role key for admin operations
const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
);

// Create storage bucket on startup
const bucketName = 'make-afd6797b-quilts';
(async () => {
  const { data: buckets } = await supabase.storage.listBuckets();
  const bucketExists = buckets?.some(bucket => bucket.name === bucketName);
  if (!bucketExists) {
    const { error } = await supabase.storage.createBucket(bucketName, {
      public: false,
      fileSizeLimit: 10485760, // 10MB
    });
    if (error) {
      console.error('Error creating bucket:', error);
    } else {
      console.log('Storage bucket created successfully');
    }
  }
})();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-afd6797b/health", (c) => {
  return c.json({ status: "ok" });
});

// Get all users
app.get("/make-server-afd6797b/users", async (c) => {
  try {
    const users = await kv.get('users');
    return c.json({ users: users || [] });
  } catch (error) {
    console.error('Error fetching users:', error);
    return c.json({ error: 'Failed to fetch users' }, 500);
  }
});

// Get a specific user by ID
app.get("/make-server-afd6797b/users/:id", async (c) => {
  try {
    const userId = c.req.param('id');
    const users = await kv.get('users') || [];
    const user = users.find((u: any) => u.id === userId);
    
    if (!user) {
      return c.json({ error: 'User not found' }, 404);
    }
    
    return c.json({ user });
  } catch (error) {
    console.error('Error fetching user:', error);
    return c.json({ error: 'Failed to fetch user' }, 500);
  }
});

// Update user profile
app.put("/make-server-afd6797b/users/:id", async (c) => {
  try {
    const userId = c.req.param('id');
    const { name, avatar } = await c.req.json();
    
    const users = await kv.get('users') || [];
    const userIndex = users.findIndex((u: any) => u.id === userId);
    
    if (userIndex === -1) {
      return c.json({ error: 'User not found' }, 404);
    }
    
    users[userIndex] = {
      ...users[userIndex],
      name,
      avatar,
    };
    
    await kv.set('users', users);
    return c.json({ user: users[userIndex] });
  } catch (error) {
    console.error('Error updating user profile:', error);
    return c.json({ error: 'Failed to update user profile' }, 500);
  }
});

// Add photo to user's board
app.post("/make-server-afd6797b/users/:id/photos", async (c) => {
  try {
    const userId = c.req.param('id');
    const { imageUrl, caption, postedBy } = await c.req.json();
    
    const users = await kv.get('users') || [];
    const userIndex = users.findIndex((u: any) => u.id === userId);
    
    if (userIndex === -1) {
      return c.json({ error: 'User not found' }, 404);
    }
    
    const newPhoto = {
      id: Date.now().toString(),
      imageUrl,
      postedBy,
      timestamp: 'Just now',
      caption: caption || undefined,
    };
    
    // Initialize photos array if it doesn't exist
    if (!users[userIndex].photos) {
      users[userIndex].photos = [];
    }
    
    users[userIndex].photos = [newPhoto, ...users[userIndex].photos];
    await kv.set('users', users);
    
    console.log(`Photo added to user ${userId}'s board. Total photos: ${users[userIndex].photos.length}`);
    
    return c.json({ photo: newPhoto });
  } catch (error) {
    console.error('Error adding photo to user board:', error);
    return c.json({ error: 'Failed to add photo' }, 500);
  }
});

// Delete photo from user's board
app.delete("/make-server-afd6797b/users/:userId/photos/:photoId", async (c) => {
  try {
    const userId = c.req.param('userId');
    const photoId = c.req.param('photoId');
    
    const users = await kv.get('users') || [];
    const userIndex = users.findIndex((u: any) => u.id === userId);
    
    if (userIndex === -1) {
      return c.json({ error: 'User not found' }, 404);
    }
    
    // Find and remove the photo
    const photoIndex = users[userIndex].photos?.findIndex((p: any) => p.id === photoId);
    
    if (photoIndex === -1 || photoIndex === undefined) {
      return c.json({ error: 'Photo not found' }, 404);
    }
    
    users[userIndex].photos.splice(photoIndex, 1);
    await kv.set('users', users);
    
    console.log(`Photo ${photoId} deleted from user ${userId}'s board. Remaining photos: ${users[userIndex].photos.length}`);
    
    return c.json({ success: true });
  } catch (error) {
    console.error('Error deleting photo from user board:', error);
    return c.json({ error: 'Failed to delete photo' }, 500);
  }
});

// Upload image to Supabase Storage
app.post("/make-server-afd6797b/upload", async (c) => {
  try {
    const body = await c.req.parseBody();
    const file = body['file'] as File;
    
    if (!file) {
      return c.json({ error: 'No file provided' }, 400);
    }
    
    // Generate unique filename
    const filename = `${Date.now()}-${file.name}`;
    const arrayBuffer = await file.arrayBuffer();
    
    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(filename, arrayBuffer, {
        contentType: file.type,
      });
    
    if (error) {
      console.error('Error uploading to storage:', error);
      return c.json({ error: 'Failed to upload file' }, 500);
    }
    
    // Create signed URL (valid for 1 year)
    const { data: signedUrlData } = await supabase.storage
      .from(bucketName)
      .createSignedUrl(filename, 31536000);
    
    if (!signedUrlData) {
      return c.json({ error: 'Failed to create signed URL' }, 500);
    }
    
    return c.json({ url: signedUrlData.signedUrl });
  } catch (error) {
    console.error('Error in upload endpoint:', error);
    return c.json({ error: 'Failed to upload file' }, 500);
  }
});

// Get notification settings
app.get("/make-server-afd6797b/settings/notifications", async (c) => {
  try {
    const settings = await kv.get('notification_settings');
    return c.json({ 
      settings: settings || {
        newPhotos: true,
        friendRequests: true,
        weeklyDigest: false,
      }
    });
  } catch (error) {
    console.error('Error fetching notification settings:', error);
    return c.json({ error: 'Failed to fetch notification settings' }, 500);
  }
});

// Update notification settings
app.put("/make-server-afd6797b/settings/notifications", async (c) => {
  try {
    const settings = await c.req.json();
    await kv.set('notification_settings', settings);
    return c.json({ settings });
  } catch (error) {
    console.error('Error updating notification settings:', error);
    return c.json({ error: 'Failed to update notification settings' }, 500);
  }
});

// Get notifications
app.get("/make-server-afd6797b/notifications", async (c) => {
  try {
    const notifications = await kv.get('notifications');
    return c.json({ notifications: notifications || [] });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return c.json({ error: 'Failed to fetch notifications' }, 500);
  }
});

// Initialize default data if not exists
app.post("/make-server-afd6797b/init", async (c) => {
  try {
    const existingUsers = await kv.get('users');
    
    if (!existingUsers) {
      const initialUsers = [
        {
          id: '1',
          name: 'You',
          username: 'you',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=You',
          photos: [],
        },
        {
          id: '2',
          name: 'Sarah Chen',
          username: 'sarahchen',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
          photos: [
            {
              id: '1',
              imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500',
              postedBy: { name: 'You', username: 'you', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=You' },
              timestamp: '2 hours ago',
            },
          ],
        },
        {
          id: '3',
          name: 'Marcus Johnson',
          username: 'marcusj',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus',
          photos: [],
        },
        {
          id: '4',
          name: 'Emma Wilson',
          username: 'emmaw',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma',
          photos: [
            {
              id: '2',
              imageUrl: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=500',
              postedBy: { name: 'Sarah Chen', username: 'sarahchen', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah' },
              timestamp: '1 day ago',
            },
          ],
        },
      ];
      
      await kv.set('users', initialUsers);
      
      const initialNotifications = [
        {
          id: '1',
          type: 'photo',
          message: 'Sarah posted a photo to your quilt',
          timestamp: '2 hours ago',
          read: false,
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
        },
        {
          id: '2',
          type: 'friend',
          message: 'Marcus sent you a friend request',
          timestamp: '5 hours ago',
          read: false,
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus',
        },
      ];
      
      await kv.set('notifications', initialNotifications);
      
      return c.json({ message: 'Data initialized successfully' });
    }
    
    return c.json({ message: 'Data already exists' });
  } catch (error) {
    console.error('Error initializing data:', error);
    return c.json({ error: 'Failed to initialize data' }, 500);
  }
});

Deno.serve(app.fetch);