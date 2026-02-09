import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  Image,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { X } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { User } from '../types';
import * as api from '../utils/api';

interface PostPhotoModalProps {
  visible: boolean;
  onClose: () => void;
  targetUser: User | null;
  currentUser: User;
  imageUri: string;
  onSuccess: () => void;
}

export function PostPhotoModal({
  visible,
  onClose,
  targetUser,
  currentUser,
  imageUri,
  onSuccess,
}: PostPhotoModalProps) {
  const [caption, setCaption] = useState('');
  const [isPosting, setIsPosting] = useState(false);

  const handlePost = async () => {
    if (!targetUser || !imageUri) return;

    try {
      setIsPosting(true);

      // Upload the image
      const imageUrl = await api.uploadFile(
        imageUri,
        `photo-${Date.now()}.jpg`,
        'image/jpeg'
      );

      // Post to board
      await api.addPhotoToBoard(targetUser.id, {
        imageUrl,
        caption: caption.trim() || undefined,
        postedBy: {
          name: currentUser.name,
          username: currentUser.username,
          avatar: currentUser.avatar,
        },
      });

      setCaption('');
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error posting photo:', error);
      Alert.alert('Error', 'Failed to post photo. Please try again.');
    } finally {
      setIsPosting(false);
    }
  };

  const handleClose = () => {
    if (!isPosting) {
      setCaption('');
      onClose();
    }
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={handleClose}
        />

        <View style={styles.modalContent}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>
              Post to {targetUser?.name}'s Board
            </Text>
            <TouchableOpacity
              onPress={handleClose}
              style={styles.closeButton}
              disabled={isPosting}
            >
              <X size={24} color="#6b7280" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.scrollView}>
            {/* Image Preview */}
            {imageUri && (
              <Image source={{ uri: imageUri }} style={styles.imagePreview} />
            )}

            {/* Caption Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Caption (optional)</Text>
              <TextInput
                style={styles.input}
                placeholder="Add a caption..."
                placeholderTextColor="#9ca3af"
                value={caption}
                onChangeText={setCaption}
                multiline
                maxLength={200}
                editable={!isPosting}
              />
              <Text style={styles.charCount}>{caption.length}/200</Text>
            </View>
          </ScrollView>

          {/* Post Button */}
          <View style={styles.footer}>
            <TouchableOpacity
              style={[styles.postButton, isPosting && styles.postButtonDisabled]}
              onPress={handlePost}
              disabled={isPosting}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={isPosting ? ['#9ca3af', '#6b7280'] : ['#3b82f6', '#8b5cf6']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.postGradient}
              >
                {isPosting ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.postButtonText}>Post Photo</Text>
                )}
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    flex: 1,
  },
  closeButton: {
    padding: 4,
  },
  scrollView: {
    maxHeight: 500,
  },
  imagePreview: {
    width: '100%',
    height: 300,
    backgroundColor: '#f3f4f6',
  },
  inputContainer: {
    padding: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    color: '#111827',
    minHeight: 100,
    textAlignVertical: 'top',
  },
  charCount: {
    fontSize: 12,
    color: '#9ca3af',
    textAlign: 'right',
    marginTop: 4,
  },
  footer: {
    padding: 20,
    paddingBottom: 40,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
  },
  postButton: {
    overflow: 'hidden',
    borderRadius: 12,
  },
  postButtonDisabled: {
    opacity: 0.6,
  },
  postGradient: {
    padding: 16,
    alignItems: 'center',
  },
  postButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
