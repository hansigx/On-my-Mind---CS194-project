import React, { useState } from 'react';
import { View, Image, Text, TouchableOpacity, StyleSheet, Dimensions, Modal, ScrollView } from 'react-native';
import { X, Trash2 } from 'lucide-react-native';
import { Photo } from '../types';

interface PhotoCardProps {
  photo: Photo;
  size: 'small' | 'medium' | 'large';
  canDelete?: boolean;
  onDelete?: (photoId: string) => void;
}

const { width } = Dimensions.get('window');
const GRID_PADDING = 16;
const GAP = 8;
const COLUMN_COUNT = 2;
const AVAILABLE_WIDTH = width - GRID_PADDING * 2 - GAP * (COLUMN_COUNT - 1);
const BASE_SIZE = AVAILABLE_WIDTH / COLUMN_COUNT;

const SIZE_MAP = {
  small: { width: BASE_SIZE, height: BASE_SIZE * 0.8 },
  medium: { width: BASE_SIZE, height: BASE_SIZE * 1.2 },
  large: { width: BASE_SIZE, height: BASE_SIZE * 1.5 },
};

export function PhotoCard({ photo, size, canDelete, onDelete }: PhotoCardProps) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const dimensions = SIZE_MAP[size];

  return (
    <>
      <TouchableOpacity
        style={[styles.card, dimensions]}
        onPress={() => setIsModalVisible(true)}
        activeOpacity={0.9}
      >
        <Image source={{ uri: photo.imageUrl }} style={styles.image} resizeMode="cover" />
        
        {/* Posted by overlay */}
        <View style={styles.overlay}>
          <View style={styles.postedByContainer}>
            <Image source={{ uri: photo.postedBy.avatar }} style={styles.postedByAvatar} />
            <Text style={styles.postedByName} numberOfLines={1}>
              {photo.postedBy.name}
            </Text>
          </View>
        </View>
      </TouchableOpacity>

      {/* Full screen modal */}
      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <TouchableOpacity
            style={styles.modalBackdrop}
            activeOpacity={1}
            onPress={() => setIsModalVisible(false)}
          />
          
          <View style={styles.modalContent}>
            {/* Header */}
            <View style={styles.modalHeader}>
              <View style={styles.modalPostedBy}>
                <Image source={{ uri: photo.postedBy.avatar }} style={styles.modalAvatar} />
                <View>
                  <Text style={styles.modalName}>{photo.postedBy.name}</Text>
                  <Text style={styles.modalTimestamp}>{photo.timestamp}</Text>
                </View>
              </View>
              
              <View style={styles.modalActions}>
                {canDelete && onDelete && (
                  <TouchableOpacity
                    onPress={() => {
                      onDelete(photo.id);
                      setIsModalVisible(false);
                    }}
                    style={styles.deleteButton}
                  >
                    <Trash2 size={20} color="#ef4444" />
                  </TouchableOpacity>
                )}
                <TouchableOpacity onPress={() => setIsModalVisible(false)} style={styles.closeButton}>
                  <X size={24} color="#fff" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Image */}
            <ScrollView
              contentContainerStyle={styles.modalImageContainer}
              maximumZoomScale={3}
              minimumZoomScale={1}
            >
              <Image
                source={{ uri: photo.imageUrl }}
                style={styles.modalImage}
                resizeMode="contain"
              />
            </ScrollView>

            {/* Caption */}
            {photo.caption && (
              <View style={styles.modalCaptionContainer}>
                <Text style={styles.modalCaption}>{photo.caption}</Text>
              </View>
            )}
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#f3f4f6',
    marginBottom: GAP,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  postedByContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  postedByAvatar: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginRight: 6,
  },
  postedByName: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    flex: 1,
  },
  
  // Modal styles
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.95)',
  },
  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  modalContent: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingTop: 48,
  },
  modalPostedBy: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  modalAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  modalName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  modalTimestamp: {
    color: '#9ca3af',
    fontSize: 14,
    marginTop: 2,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
  },
  deleteButton: {
    padding: 8,
  },
  closeButton: {
    padding: 8,
  },
  modalImageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalImage: {
    width: width,
    height: width,
  },
  modalCaptionContainer: {
    padding: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  modalCaption: {
    color: '#fff',
    fontSize: 16,
    lineHeight: 24,
  },
});
