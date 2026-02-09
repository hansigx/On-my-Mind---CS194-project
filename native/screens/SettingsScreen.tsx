import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Image,
  Switch,
  Alert,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { ArrowLeft, Camera } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { RootStackParamList } from '../../App';
import * as api from '../utils/api';
import { User, NotificationSettings } from '../types';

type SettingsScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Settings'>;
type SettingsScreenRouteProp = RouteProp<RootStackParamList, 'Settings'>;

interface SettingsScreenProps {
  navigation: SettingsScreenNavigationProp;
  route: SettingsScreenRouteProp;
}

const CURRENT_USER_ID = '1';

export default function SettingsScreen({ navigation, route }: SettingsScreenProps) {
  const [activeTab, setActiveTab] = useState<'profile' | 'notifications'>(
    route.params?.initialTab || 'profile'
  );
  const [user, setUser] = useState<User | null>(null);
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    newPhotos: true,
    friendRequests: true,
    weeklyDigest: false,
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const loadedUser = await api.getUser(CURRENT_USER_ID);
      setUser(loadedUser);

      const settings = await api.getNotificationSettings();
      setNotificationSettings(settings);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const handleChangeAvatar = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Photo library permission is needed.');
      return;
    }

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0] && user) {
        const imageUrl = await api.uploadFile(
          result.assets[0].uri,
          `avatar-${Date.now()}.jpg`,
          'image/jpeg'
        );

        await api.updateUserProfile(CURRENT_USER_ID, {
          name: user.name,
          avatar: imageUrl,
        });

        await loadData();
      }
    } catch (error) {
      console.error('Error updating avatar:', error);
      Alert.alert('Error', 'Failed to update avatar. Please try again.');
    }
  };

  const handleNotificationToggle = async (key: keyof NotificationSettings) => {
    const newSettings = {
      ...notificationSettings,
      [key]: !notificationSettings[key],
    };

    setNotificationSettings(newSettings);

    try {
      await api.updateNotificationSettings(newSettings);
    } catch (error) {
      console.error('Error updating notification settings:', error);
      // Revert on error
      setNotificationSettings(notificationSettings);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <ArrowLeft size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'profile' && styles.activeTab]}
          onPress={() => setActiveTab('profile')}
        >
          <Text style={[styles.tabText, activeTab === 'profile' && styles.activeTabText]}>
            Profile
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'notifications' && styles.activeTab]}
          onPress={() => setActiveTab('notifications')}
        >
          <Text style={[styles.tabText, activeTab === 'notifications' && styles.activeTabText]}>
            Notifications
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {activeTab === 'profile' && (
          <View style={styles.section}>
            {/* Avatar */}
            <View style={styles.avatarSection}>
              <Image source={{ uri: user.avatar }} style={styles.avatar} />
              <TouchableOpacity
                style={styles.changeAvatarButton}
                onPress={handleChangeAvatar}
              >
                <Camera size={20} color="#3b82f6" />
              </TouchableOpacity>
            </View>

            {/* User Info */}
            <View style={styles.infoCard}>
              <Text style={styles.infoLabel}>Name</Text>
              <Text style={styles.infoValue}>{user.name}</Text>
            </View>

            <View style={styles.infoCard}>
              <Text style={styles.infoLabel}>Username</Text>
              <Text style={styles.infoValue}>@{user.username}</Text>
            </View>

            <View style={styles.infoCard}>
              <Text style={styles.infoLabel}>Photos on your board</Text>
              <Text style={styles.infoValue}>{user.photos?.length || 0}</Text>
            </View>
          </View>
        )}

        {activeTab === 'notifications' && (
          <View style={styles.section}>
            <View style={styles.settingCard}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingTitle}>New Photos</Text>
                <Text style={styles.settingDescription}>
                  Get notified when friends post photos to your board
                </Text>
              </View>
              <Switch
                value={notificationSettings.newPhotos}
                onValueChange={() => handleNotificationToggle('newPhotos')}
                trackColor={{ false: '#e5e7eb', true: '#93c5fd' }}
                thumbColor={notificationSettings.newPhotos ? '#3b82f6' : '#f3f4f6'}
              />
            </View>

            <View style={styles.settingCard}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingTitle}>Friend Requests</Text>
                <Text style={styles.settingDescription}>
                  Get notified when someone sends you a friend request
                </Text>
              </View>
              <Switch
                value={notificationSettings.friendRequests}
                onValueChange={() => handleNotificationToggle('friendRequests')}
                trackColor={{ false: '#e5e7eb', true: '#93c5fd' }}
                thumbColor={notificationSettings.friendRequests ? '#3b82f6' : '#f3f4f6'}
              />
            </View>

            <View style={styles.settingCard}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingTitle}>Weekly Digest</Text>
                <Text style={styles.settingDescription}>
                  Receive a weekly summary of activity on your board
                </Text>
              </View>
              <Switch
                value={notificationSettings.weeklyDigest}
                onValueChange={() => handleNotificationToggle('weeklyDigest')}
                trackColor={{ false: '#e5e7eb', true: '#93c5fd' }}
                thumbColor={notificationSettings.weeklyDigest ? '#3b82f6' : '#f3f4f6'}
              />
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
  },
  tabs: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#3b82f6',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#9ca3af',
  },
  activeTabText: {
    color: '#3b82f6',
  },
  content: {
    flex: 1,
  },
  section: {
    padding: 20,
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#f3f4f6',
  },
  changeAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: '35%',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  infoCard: {
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    color: '#111827',
    fontWeight: '600',
  },
  settingCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  settingInfo: {
    flex: 1,
    marginRight: 16,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    color: '#6b7280',
  },
});
