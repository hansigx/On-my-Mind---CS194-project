import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { ArrowLeft, Plus } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { RootStackParamList } from '../../App';
import { BoardView } from '../components/BoardView';
import * as api from '../utils/api';
import { User } from '../types';

type BoardScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Board'>;
type BoardScreenRouteProp = RouteProp<RootStackParamList, 'Board'>;

interface BoardScreenProps {
  navigation: BoardScreenNavigationProp;
  route: BoardScreenRouteProp;
}

const CURRENT_USER_ID = '1';

export default function BoardScreen({ navigation, route }: BoardScreenProps) {
  const { userId } = route.params;
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    loadUser();
  }, [userId]);

  const loadUser = async () => {
    try {
      const loadedUser = await api.getUser(userId);
      setUser(loadedUser);
    } catch (error) {
      console.error('Error loading user:', error);
    }
  };

  const handleDeletePhoto = async (photoId: string) => {
    if (!user) return;
    
    try {
      await api.deletePhotoFromBoard(user.id, photoId);
      await loadUser();
    } catch (error) {
      console.error('Error deleting photo:', error);
    }
  };

  const handlePostToBoard = () => {
    // TODO: Open upload modal
    console.log('Post to board');
  };

  if (!user) {
    return null;
  }

  const isOwnBoard = user.id === CURRENT_USER_ID;

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <ArrowLeft size={24} color="#111827" />
        </TouchableOpacity>
        
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>{user.name}'s Board</Text>
          <Text style={styles.headerSubtitle}>
            {user.photos?.length || 0} {user.photos?.length === 1 ? 'photo' : 'photos'}
          </Text>
        </View>

        {!isOwnBoard && (
          <TouchableOpacity onPress={handlePostToBoard} style={styles.postButton}>
            <LinearGradient
              colors={['#3b82f6', '#8b5cf6']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.postGradient}
            >
              <Plus size={20} color="#fff" />
            </LinearGradient>
          </TouchableOpacity>
        )}
      </View>

      {/* Board */}
      <BoardView
        user={user}
        currentUserId={CURRENT_USER_ID}
        onDeletePhoto={handleDeletePhoto}
      />
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
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 2,
  },
  postButton: {
    width: 40,
    height: 40,
  },
  postGradient: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
