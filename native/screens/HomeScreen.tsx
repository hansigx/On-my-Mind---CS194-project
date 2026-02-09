import React, { useState, useEffect } from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../App';
import { CircleNavigation } from '../components/CircleNavigation';
import { BottomNavigation } from '../components/BottomNavigation';
import * as api from '../utils/api';
import { User, Notification } from '../types';

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

interface HomeScreenProps {
  navigation: HomeScreenNavigationProp;
}

const CURRENT_USER_ID = '1';

export default function HomeScreen({ navigation }: HomeScreenProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [activeTab, setActiveTab] = useState<'home' | 'upload' | 'notifications' | 'settings'>('home');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const loadedUsers = await api.getUsers();
      setUsers(loadedUsers);
      
      const loadedNotifications = await api.getNotifications();
      setNotifications(loadedNotifications);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const currentUser = users.find(u => u.id === CURRENT_USER_ID);
  const unreadCount = notifications.filter(n => !n.read).length;

  const handleSelectUser = (userId: string) => {
    navigation.navigate('Board', { userId });
  };

  const handleTabPress = (tab: 'home' | 'upload' | 'notifications' | 'settings') => {
    setActiveTab(tab);
    
    if (tab === 'notifications') {
      navigation.navigate('Notifications');
    } else if (tab === 'settings') {
      navigation.navigate('Settings', {});
    } else if (tab === 'upload') {
      // Will be handled in the upload modal implementation
      console.log('Upload pressed');
    }
  };

  if (!currentUser) {
    return null;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content} testID="circle-navigation">
        <CircleNavigation
          users={users}
          currentUser={currentUser}
          onSelectUser={handleSelectUser}
        />
      </View>
      
      <BottomNavigation
        activeTab={activeTab}
        onTabPress={handleTabPress}
        notificationCount={unreadCount}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
  },
});
