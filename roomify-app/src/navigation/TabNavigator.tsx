import React from 'react';
import { Image} from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import SearchScreen from '../screens/SearchScreen';
import AddImageScreen from '../screens/AddImageScreen';
import FavoritesScreen from '../screens/FavoritesScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator();

const TabBarIcon = ({ source, color }: { source: any; color: string }) => (
  <Image
    source={source}
    style={{ width: 24, height: 24, tintColor: color }}
    resizeMode="contain"
  />
);

export default function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#7B6C63',
        tabBarInactiveTintColor: '#111827',
        tabBarStyle: {
          backgroundColor: '#EDE8DC',
          borderTopWidth: 0,
          elevation: 0,
          height: 80,
          paddingBottom: 16,
          paddingTop: 4,
          shadowColor: '#000',
          shadowOpacity: 0.15,
          shadowRadius: 6,
          shadowOffset: { width: 0, height: -3 },
        },
        tabBarShowLabel: false,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <TabBarIcon source={require('../../assets/icons/home.png')} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Search"
        component={SearchScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <TabBarIcon source={require('../../assets/icons/search.png')} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="AddImage"
        component={AddImageScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <TabBarIcon source={require('../../assets/icons/add.png')} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Favorites"
        component={FavoritesScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <TabBarIcon source={require('../../assets/icons/heart.png')} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <TabBarIcon source={require('../../assets/icons/profile.png')} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
