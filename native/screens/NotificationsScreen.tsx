import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Image,
  Alert,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { ArrowLeft } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { RootStackParamList } from '../../App';
import * as api from '../utils/api';
import { Notification } from '../types';

type NotificationsScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Notifications'>;

interface NotificationsScreenProps {
  navigation: NotificationsScreenNavigationProp;
}

export default function NotificationsScreen({ navigation }: NotificationsScreenProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      const loadedNotifications = await api.getNotifications();
      setNotifications(loadedNotifications);
    } catch (error) {
      console.error('Error loading notifications:', error);
    }
  };

  const handleAcceptFriendRequest = async (requestId: string) => {
    Alert.alert(
      'Accept Friend Request',
      'Choose permission level for this friend:',
      [
        {
          text: 'Viewer',
          onPress: async () => {
            try {
              await api.acceptFriendRequest(requestId, 'viewer');
              await loadNotifications();
            } catch (error) {
              console.error('Error accepting friend request:', error);
            }
          },
        },
        {
          text: 'Editor',
          onPress: async () => {
            try {
              await api.acceptFriendRequest(requestId, 'editor');
              await loadNotifications();
            } catch (error) {
              console.error('Error accepting friend request:', error);
            }
          },
        },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const handleDeclineFriendRequest = async (requestId: string) => {
    try {
      await api.declineFriendRequest(requestId);
      await loadNotifications();
    } catch (error) {
      console.error('Error declining friend request:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <ArrowLeft size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Notifications List */}
      <ScrollView style={styles.scrollView}>
        {notifications.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No notifications</Text>
            <Text style={styles.emptySubtext}>You're all caught up!</Text>
          </View>
        ) : (
          notifications.map((notification) => (
            <View
              key={notification.id}
              style={[
                styles.notificationCard,
                !notification.read && styles.unreadCard,
              ]}
            >
              <Image
                source={{ uri: notification.avatar }}
                style={styles.avatar}
              />
              
              <View style={styles.content}>
                <Text style={styles.message}>{notification.message}</Text>
                <Text style={styles.timestamp}>{notification.timestamp}</Text>

                {notification.type === 'friend' && notification.friendRequestId && (
                  <View style={styles.actions}>
                    <TouchableOpacity
                      style={styles.acceptButton}
                      onPress={() => handleAcceptFriendRequest(notification.friendRequestId!)}
                    >
                      <LinearGradient
                        colors={['#10b981', '#059669']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.actionGradient}
                      >
                        <Text style={styles.actionText}>Accept</Text>
                      </LinearGradient>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.declineButton}
                      onPress={() => handleDeclineFriendRequest(notification.friendRequestId!)}
                    >
                      <Text style={styles.declineText}>Decline</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </View>
          ))
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
  scrollView: {
    flex: 1,
  },
  emptyContainer: {
    padding: 60,
    alignItems: 'center',
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
  },
  notificationCard: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  unreadCard: {
    backgroundColor: '#eff6ff',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  content: {
    flex: 1,
  },
  message: {
    fontSize: 16,
    color: '#111827',
    marginBottom: 4,
  },
  timestamp: {
    fontSize: 14,
    color: '#9ca3af',
  },
  actions: {
    flexDirection: 'row',
    marginTop: 12,
    gap: 8,
  },
  acceptButton: {
    flex: 1,
    overflow: 'hidden',
    borderRadius: 8,
  },
  actionGradient: {
    padding: 10,
    alignItems: 'center',
  },
  actionText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  declineButton: {
    flex: 1,
    padding: 10,
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  declineText: {
    color: '#6b7280',
    fontSize: 14,
    fontWeight: '600',
  },
});
