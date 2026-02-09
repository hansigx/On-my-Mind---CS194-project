import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Camera, Image as ImageIcon, X } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';

interface UploadModalProps {
  visible: boolean;
  onClose: () => void;
  onImageSelected: (uri: string) => void;
}

export function UploadModal({ visible, onClose, onImageSelected }: UploadModalProps) {
  const [isLoading, setIsLoading] = useState(false);

  const requestCameraPermission = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permission Required',
        'Camera permission is needed to take photos.',
        [{ text: 'OK' }]
      );
      return false;
    }
    return true;
  };

  const requestLibraryPermission = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permission Required',
        'Photo library permission is needed to select photos.',
        [{ text: 'OK' }]
      );
      return false;
    }
    return true;
  };

  const handleTakePhoto = async () => {
    const hasPermission = await requestCameraPermission();
    if (!hasPermission) return;

    try {
      setIsLoading(true);
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        onImageSelected(result.assets[0].uri);
        onClose();
      }
    } catch (error) {
      console.error('Error taking photo:', error);
      Alert.alert('Error', 'Failed to take photo. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChooseFromLibrary = async () => {
    const hasPermission = await requestLibraryPermission();
    if (!hasPermission) return;

    try {
      setIsLoading(true);
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        onImageSelected(result.assets[0].uri);
        onClose();
      }
    } catch (error) {
      console.error('Error choosing photo:', error);
      Alert.alert('Error', 'Failed to select photo. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={onClose}
        />

        <View style={styles.modalContent}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Upload Photo</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={24} color="#6b7280" />
            </TouchableOpacity>
          </View>

          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#3b82f6" />
            </View>
          ) : (
            <View style={styles.options}>
              {/* Take Photo */}
              <TouchableOpacity
                style={styles.option}
                onPress={handleTakePhoto}
                activeOpacity={0.7}
              >
                <LinearGradient
                  colors={['#3b82f6', '#8b5cf6']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.optionGradient}
                >
                  <Camera size={32} color="#fff" />
                  <Text style={styles.optionText}>Take Photo</Text>
                </LinearGradient>
              </TouchableOpacity>

              {/* Choose from Library */}
              <TouchableOpacity
                style={styles.option}
                onPress={handleChooseFromLibrary}
                activeOpacity={0.7}
              >
                <LinearGradient
                  colors={['#8b5cf6', '#ec4899']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.optionGradient}
                >
                  <ImageIcon size={32} color="#fff" />
                  <Text style={styles.optionText}>Choose from Library</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
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
    paddingBottom: 40,
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
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
  },
  closeButton: {
    padding: 4,
  },
  loadingContainer: {
    padding: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  options: {
    padding: 20,
    gap: 16,
  },
  option: {
    overflow: 'hidden',
    borderRadius: 16,
  },
  optionGradient: {
    padding: 24,
    alignItems: 'center',
    gap: 12,
  },
  optionText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});
