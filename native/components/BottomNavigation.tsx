import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Home, Upload, Bell, Settings } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface BottomNavigationProps {
  activeTab: 'home' | 'upload' | 'notifications' | 'settings';
  onTabPress: (tab: 'home' | 'upload' | 'notifications' | 'settings') => void;
  notificationCount?: number;
}

export function BottomNavigation({ activeTab, onTabPress, notificationCount = 0 }: BottomNavigationProps) {
  const getIconColor = (tab: string) => (activeTab === tab ? '#3b82f6' : '#9ca3af');

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['rgba(255,255,255,0.95)', 'rgba(255,255,255,1)']}
        style={styles.gradient}
      >
        <View style={styles.nav}>
          <TouchableOpacity
            style={styles.tab}
            onPress={() => onTabPress('home')}
            testID="home-button"
          >
            <Home size={28} color={getIconColor('home')} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.tab}
            onPress={() => onTabPress('upload')}
            testID="upload-button"
          >
            <View style={styles.uploadButton}>
              <LinearGradient
                colors={['#3b82f6', '#8b5cf6']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.uploadGradient}
              >
                <Upload size={24} color="#fff" />
              </LinearGradient>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.tab}
            onPress={() => onTabPress('notifications')}
            testID="notifications-button"
          >
            <View>
              <Bell size={28} color={getIconColor('notifications')} />
              {notificationCount > 0 && (
                <View style={styles.badge}>
                  <LinearGradient
                    colors={['#ef4444', '#dc2626']}
                    style={styles.badgeGradient}
                  />
                </View>
              )}
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.tab}
            onPress={() => onTabPress('settings')}
            testID="settings-button"
          >
            <Settings size={28} color={getIconColor('settings')} />
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  gradient: {
    paddingBottom: 20,
  },
  nav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  tab: {
    padding: 8,
  },
  uploadButton: {
    width: 56,
    height: 56,
    marginTop: -28,
  },
  uploadGradient: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 12,
    height: 12,
    borderRadius: 6,
    overflow: 'hidden',
  },
  badgeGradient: {
    width: 12,
    height: 12,
  },
});
