import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AuthNavigator from './AuthNavigator';
import TabNavigator from './TabNavigator';
import PreferencesScreen from '../screens/PreferencesScreen';
import { useAuth } from '../../context/AuthContext';

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  const { user, loading } = useAuth();
  const [checkingPrefs, setCheckingPrefs] = useState(true);
  const [hasCompletedPrefs, setHasCompletedPrefs] = useState(false);

  useEffect(() => {
    checkPreferences();
  }, [user]);

  const checkPreferences = async () => {
    if (!user) {
      setCheckingPrefs(false);
      return;
    }

    try {
      const prefs = await AsyncStorage.getItem('userPreferences');
      if (prefs) {
        const parsed = JSON.parse(prefs);
        setHasCompletedPrefs(parsed.completed === true);
      } else {
        setHasCompletedPrefs(false);
      }
    } catch (error) {
      console.error('Error checking preferences:', error);
      setHasCompletedPrefs(false);
    } finally {
      setCheckingPrefs(false);
    }
  };

  if (loading || checkingPrefs) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1a1a1a" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {!user ? (
        <AuthNavigator />
      ) : !hasCompletedPrefs ? (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Preferences" component={PreferencesScreen} />
          <Stack.Screen name="Main" component={TabNavigator} />
        </Stack.Navigator>
      ) : (
        <TabNavigator />
      )}
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
});
