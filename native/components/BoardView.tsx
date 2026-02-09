import React from 'react';
import { View, ScrollView, Text, StyleSheet } from 'react-native';
import { PhotoCard } from './PhotoCard';
import { User } from '../types';

interface BoardViewProps {
  user: User;
  currentUserId: string;
  onDeletePhoto?: (photoId: string) => void;
}

const SIZE_PATTERN = ['medium', 'small', 'large', 'small', 'medium', 'large'] as const;

export function BoardView({ user, currentUserId, onDeletePhoto }: BoardViewProps) {
  const photos = user.photos || [];
  const canDelete = user.id === currentUserId;

  if (photos.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No photos yet</Text>
        <Text style={styles.emptySubtext}>
          {canDelete
            ? 'Your friends haven\'t posted any photos to your board yet'
            : 'Be the first to post a photo to this board!'}
        </Text>
      </View>
    );
  }

  // Create two columns for masonry layout
  const leftColumn: Array<{ photo: typeof photos[0]; size: typeof SIZE_PATTERN[0] }> = [];
  const rightColumn: Array<{ photo: typeof photos[0]; size: typeof SIZE_PATTERN[0] }> = [];

  photos.forEach((photo, index) => {
    const size = SIZE_PATTERN[index % SIZE_PATTERN.length];
    if (index % 2 === 0) {
      leftColumn.push({ photo, size });
    } else {
      rightColumn.push({ photo, size });
    }
  });

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <View style={styles.grid}>
        <View style={styles.column}>
          {leftColumn.map(({ photo, size }) => (
            <PhotoCard
              key={photo.id}
              photo={photo}
              size={size}
              canDelete={canDelete}
              onDelete={onDeletePhoto}
            />
          ))}
        </View>
        <View style={styles.column}>
          {rightColumn.map(({ photo, size }) => (
            <PhotoCard
              key={photo.id}
              photo={photo}
              size={size}
              canDelete={canDelete}
              onDelete={onDeletePhoto}
            />
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    paddingBottom: 100,
  },
  grid: {
    flexDirection: 'row',
    padding: 16,
    gap: 8,
  },
  column: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#9ca3af',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#d1d5db',
    textAlign: 'center',
  },
});
