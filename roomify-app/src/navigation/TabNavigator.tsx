import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';
import DesignRoomScreen from '../screens/DesignRoomScreen';
import AddImageScreen from '../screens/AddImageScreen';

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: '#999',
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Explore',
        }}
      />
      <Tab.Screen
        name="AddImage"
        component={AddImageScreen}
        options={{
          tabBarLabel: 'Add',
        }}
      />
      <Tab.Screen
        name="DesignRoom"
        component={DesignRoomScreen}
        options={{
          tabBarLabel: 'Design',
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profile',
        }}
      />
    </Tab.Navigator>
  );
}
