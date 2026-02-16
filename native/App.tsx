/*
import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { StatusBar } from "expo-status-bar";
import { View, ActivityIndicator, Text } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import HomeScreen from "./screens/HomeScreen";
import BoardScreen from "./screens/BoardScreen";
import SettingsScreen from "./screens/SettingsScreen";
import NotificationsScreen from "./screens/NotificationsScreen";
import OnboardingScreen from "./screens/OnboardingScreen";

import * as api from "./utils/api";
import { User } from "./types";

export type RootStackParamList = {
  Onboarding: undefined;
  Home: undefined;
  Board: { userId: string };
  Settings: { initialTab?: "profile" | "notifications" };
  Notifications: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();
const TOUR_COMPLETED_KEY = "quilts_tour_completed";

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    async function loadData() {
      try {
        // Check if user has completed onboarding
        const tourCompleted = await AsyncStorage.getItem(TOUR_COMPLETED_KEY);
        setShowOnboarding(!tourCompleted);

        // Load data
        await api.resetData();
        const loadedUsers = await api.getUsers();
        setUsers(loadedUsers);
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, []);

  const handleOnboardingComplete = async () => {
    await AsyncStorage.setItem(TOUR_COMPLETED_KEY, "true");
    setShowOnboarding(false);
  };

  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#fff",
        }}
      >
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    );
  }

  return (
    <>
      <StatusBar style="dark" />
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName={showOnboarding ? "Onboarding" : "Home"}
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="Onboarding">
            {(props) => (
              <OnboardingScreen
                {...props}
                onComplete={handleOnboardingComplete}
              />
            )}
          </Stack.Screen>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Board" component={BoardScreen} />
          <Stack.Screen name="Settings" component={SettingsScreen} />
          <Stack.Screen name="Notifications" component={NotificationsScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
}
*/

import TestApp from "./components/TestApp";

export default function App() {
  return <TestApp />;
}
