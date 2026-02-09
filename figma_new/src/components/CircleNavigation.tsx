import { User } from './UserGrid';
import { Settings } from 'lucide-react';

interface CircleNavigationProps {
  users: User[];
  currentUserId: string;
  onSelectUser: (userId: string) => void;
  onOpenSettings: () => void;
  onOpenAddFriends?: () => void;
}

export function CircleNavigation({ users, currentUserId, onSelectUser, onOpenSettings, onOpenAddFriends }: CircleNavigationProps) {
  const currentUser = users.find(u => u.id === currentUserId);
  const otherUsers = users.filter(u => u.id !== currentUserId);

  // Calculate positions in a circle
  const radius = 180; // Distance from center for friends
  const angleStep = (2 * Math.PI) / otherUsers.length;
  
  // Generate web-like formation for empty placeholders
  // Place them at varying distances and angles, ensuring no overlaps
  const emptySlots = 8;
  const minDistance = 120; // Minimum distance between any two circles (accounting for circle sizes)
  
  const generateNonOverlappingPositions = () => {
    const positions: { x: number; y: number; angle: number; radius: number }[] = [];
    const allPositions: { x: number; y: number }[] = [];
    
    // Add friend positions to check against (use actual rendered positions)
    otherUsers.forEach((_, index) => {
      const angle = angleStep * index - Math.PI / 2;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      allPositions.push({ x, y });
    });
    
    // Also add center position (current user)
    allPositions.push({ x: 0, y: 0 });
    
    // Generate placeholder positions with better overlap detection
    let attempts = 0;
    const maxAttempts = 200;
    
    while (positions.length < emptySlots && attempts < maxAttempts) {
      // Use a more controlled randomization
      const baseAngle = (positions.length * Math.PI * 2 / emptySlots) + (Math.random() - 0.5) * 0.8;
      const radiusVariation = 240 + (Math.random() * 80); // Between 240-320px
      
      const x = Math.cos(baseAngle) * radiusVariation;
      const y = Math.sin(baseAngle) * radiusVariation;
      
      // Check if this position overlaps with any existing position
      const hasOverlap = allPositions.some(pos => {
        const distance = Math.sqrt(Math.pow(pos.x - x, 2) + Math.pow(pos.y - y, 2));
        return distance < minDistance;
      });
      
      if (!hasOverlap) {
        positions.push({ x, y, angle: baseAngle, radius: radiusVariation });
        allPositions.push({ x, y });
      }
      
      attempts++;
    }
    
    return positions;
  };
  
  const emptyPositions = generateNonOverlappingPositions();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center p-4 overflow-hidden">
      {/* Settings Button */}
      <button
        onClick={onOpenSettings}
        className="fixed top-6 right-6 p-3 bg-white rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105 z-20"
      >
        <Settings size={24} className="text-gray-700" />
      </button>

      <div className="relative w-full max-w-4xl aspect-square">
        {/* Center Profile (Current User) */}
        {currentUser && (
          <button
            onClick={() => onSelectUser(currentUser.id)}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 group"
          >
            <div className="relative">
              {/* Outer glow ring */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur-xl opacity-50 group-hover:opacity-75 transition-opacity scale-110"></div>
              
              {/* Profile picture */}
              <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-white shadow-2xl overflow-hidden group-hover:scale-110 transition-transform">
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-full h-full object-cover"
                />
                {/* Photo count badge */}
                {currentUser.photos.length > 0 && (
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent py-2 text-white text-xs text-center font-semibold">
                    {currentUser.photos.length} {currentUser.photos.length === 1 ? 'photo' : 'photos'}
                  </div>
                )}
              </div>
              
              {/* Name label */}
              <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 whitespace-nowrap">
                <p className="font-bold text-gray-800 text-lg pb-2">{currentUser.name}</p>
              </div>
            </div>
          </button>
        )}

        {/* Other Users in Circle */}
        {otherUsers.map((user, index) => {
          const angle = angleStep * index - Math.PI / 2; // Start from top
          
          // Calculate position with responsive radius
          const isMobile = window.innerWidth < 640;
          const responsiveRadius = isMobile ? radius * 0.7 : radius;
          
          const x = Math.cos(angle) * responsiveRadius;
          const y = Math.sin(angle) * responsiveRadius;

          return (
            <button
              key={user.id}
              onClick={() => onSelectUser(user.id)}
              className="absolute top-1/2 left-1/2 group"
              style={{
                transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
              }}
            >
              <div className="relative">
                {/* Connection line to center */}
                <svg
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-20 group-hover:opacity-40 transition-opacity"
                  style={{
                    width: Math.abs(x) * 2 + 100,
                    height: Math.abs(y) * 2 + 100,
                  }}
                >
                  <line
                    x1={Math.abs(x) > Math.abs(y) ? (x < 0 ? '100%' : '0%') : '50%'}
                    y1={Math.abs(y) > Math.abs(x) ? (y < 0 ? '100%' : '0%') : '50%'}
                    x2="50%"
                    y2="50%"
                    stroke="url(#gradient)"
                    strokeWidth="2"
                    strokeDasharray="5,5"
                  />
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#3b82f6" />
                      <stop offset="100%" stopColor="#a855f7" />
                    </linearGradient>
                  </defs>
                </svg>

                {/* Profile picture */}
                <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-full border-4 border-white shadow-lg overflow-hidden group-hover:scale-110 group-hover:border-blue-400 transition-all">
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-full h-full object-cover"
                  />
                  {/* Photo count badge */}
                  {user.photos.length > 0 && (
                    <div className="absolute top-0 right-0 w-7 h-7 bg-blue-600 rounded-full border-2 border-white flex items-center justify-center shadow-md">
                      <span className="text-xs text-white font-bold">{user.photos.length}</span>
                    </div>
                  )}
                </div>

                {/* Name label */}
                <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                  <p className="text-sm font-semibold text-gray-800 bg-white px-3 py-1.5 rounded-full shadow-lg">
                    {user.name}
                  </p>
                </div>
              </div>
            </button>
          );
        })}

        {/* Empty placeholder circles - web-like formation */}
        {emptyPositions.map((pos, index) => {
          const isMobile = window.innerWidth < 640;
          const responsiveX = isMobile ? pos.x * 0.7 : pos.x;
          const responsiveY = isMobile ? pos.y * 0.7 : pos.y;

          return (
            <button
              key={`empty-${index}`}
              onClick={onOpenAddFriends || onOpenSettings}
              className="absolute top-1/2 left-1/2 group cursor-pointer"
              style={{
                transform: `translate(calc(-50% + ${responsiveX}px), calc(-50% + ${responsiveY}px))`,
              }}
            >
              <div className="relative">
                <div className="relative w-16 h-16 md:w-20 md:h-20 rounded-full border-4 border-white/40 border-dashed shadow-sm bg-white/30 group-hover:bg-white/60 group-hover:border-blue-300/60 transition-all group-hover:scale-110">
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="w-2.5 h-2.5 rounded-full bg-gray-300/50 group-hover:bg-blue-400/60 transition-colors"></div>
                  </div>
                </div>
                
                {/* Hover tooltip */}
                <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  <p className="text-xs font-semibold text-gray-800 bg-white px-3 py-1.5 rounded-full shadow-lg">
                    Add more friends
                  </p>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}