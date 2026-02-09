import React from 'react';
import { View, TouchableOpacity, Image, Text, Dimensions, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { User } from '../types';

interface CircleNavigationProps {
  users: User[];
  currentUser: User;
  onSelectUser: (userId: string) => void;
}

const { width, height } = Dimensions.get('window');
const CIRCLE_RADIUS = Math.min(width, height) * 0.35;
const AVATAR_SIZE = 64;
const CENTER_AVATAR_SIZE = 80;

export function CircleNavigation({ users, currentUser, onSelectUser }: CircleNavigationProps) {
  const friends = users.filter(u => u.id !== currentUser.id);

  const getPositionForIndex = (index: number, total: number) => {
    const angle = (index * 2 * Math.PI) / total - Math.PI / 2;
    const x = Math.cos(angle) * CIRCLE_RADIUS;
    const y = Math.sin(angle) * CIRCLE_RADIUS;
    return { x, y };
  };

  return (
    <View style={styles.container} testID="circle-navigation">
      {/* Friend avatars in circle */}
      {friends.map((user, index) => {
        const { x, y } = getPositionForIndex(index, friends.length);
        const hasPhotos = user.photos && user.photos.length > 0;

        return (
          <TouchableOpacity
            key={user.id}
            style={[
              styles.friendAvatar,
              {
                transform: [
                  { translateX: x - AVATAR_SIZE / 2 },
                  { translateY: y - AVATAR_SIZE / 2 },
                ],
              },
            ]}
            onPress={() => onSelectUser(user.id)}
            activeOpacity={0.7}
          >
            <View style={styles.avatarContainer}>
              {hasPhotos && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{user.photos.length}</Text>
                </View>
              )}
              <Image source={{ uri: user.avatar }} style={styles.avatarImage} />
              <Text style={styles.avatarName} numberOfLines={1}>
                {user.name}
              </Text>
            </View>
          </TouchableOpacity>
        );
      })}

      {/* Center avatar (current user) */}
      <TouchableOpacity
        style={styles.centerAvatar}
        onPress={() => onSelectUser(currentUser.id)}
        activeOpacity={0.7}
        testID="center-profile"
      >
        <LinearGradient
          colors={['#3b82f6', '#8b5cf6']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.centerGradient}
        >
          <View style={styles.centerAvatarInner}>
            <Image source={{ uri: currentUser.avatar }} style={styles.centerAvatarImage} />
          </View>
        </LinearGradient>
        <Text style={styles.centerAvatarName}>{currentUser.name}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  friendAvatar: {
    position: 'absolute',
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
  },
  avatarContainer: {
    alignItems: 'center',
  },
  avatarImage: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    borderWidth: 3,
    borderColor: '#fff',
    backgroundColor: '#f3f4f6',
  },
  avatarName: {
    marginTop: 6,
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
    textAlign: 'center',
    maxWidth: AVATAR_SIZE + 20,
  },
  badge: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: '#3b82f6',
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
    zIndex: 10,
    borderWidth: 2,
    borderColor: '#fff',
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  centerAvatar: {
    alignItems: 'center',
  },
  centerGradient: {
    width: CENTER_AVATAR_SIZE + 8,
    height: CENTER_AVATAR_SIZE + 8,
    borderRadius: (CENTER_AVATAR_SIZE + 8) / 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerAvatarInner: {
    width: CENTER_AVATAR_SIZE,
    height: CENTER_AVATAR_SIZE,
    borderRadius: CENTER_AVATAR_SIZE / 2,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerAvatarImage: {
    width: CENTER_AVATAR_SIZE - 4,
    height: CENTER_AVATAR_SIZE - 4,
    borderRadius: (CENTER_AVATAR_SIZE - 4) / 2,
  },
  centerAvatarName: {
    marginTop: 12,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
  },
});
