import React from 'react';
import { Image} from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import SearchScreen from '../screens/SearchScreen';
import AddImageScreen from '../screens/AddImageScreen';
import FavoritesScreen from '../screens/FavoritesScreen';
import ProfileScreen from '../screens/ProfileScreen';
import RoomDetailScreen from '../screens/RoomDetailScreen';
import UserProfileScreen from '../screens/UserProfileScreen';
import CommentsScreen from '../screens/CommentsScreen';
import CollectionDetailScreen from '../screens/CollectionDetailScreen';
import SettingsScreen from '../screens/SettingsScreen';
import FollowingFollowersScreen from '../screens/FollowingFollowersScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

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
        name="HomeStack"
        options={{
          tabBarIcon: ({ color }) => (
            <TabBarIcon source={require('../../../assets/icons/home.png')} color={color} />
          ),
        }}
      >
        {() => (
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="RoomDetail" component={RoomDetailScreen} />
            <Stack.Screen name="UserProfile" component={UserProfileScreen} />
            <Stack.Screen name="Comments" component={CommentsScreen} />
          </Stack.Navigator>
        )}
      </Tab.Screen>
      <Tab.Screen
        name="SearchStack"
        options={{
          tabBarIcon: ({ color }) => (
            <TabBarIcon source={require('../../../assets/icons/search.png')} color={color} />
          ),
        }}
      >
        {() => (
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Search" component={SearchScreen} />
            <Stack.Screen name="RoomDetail" component={RoomDetailScreen} />
            <Stack.Screen name="UserProfile" component={UserProfileScreen} />
            <Stack.Screen name="Comments" component={CommentsScreen} />
          </Stack.Navigator>
        )}
      </Tab.Screen>
      <Tab.Screen
        name="AddImage"
        component={AddImageScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <TabBarIcon source={require('../../../assets/icons/add.png')} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="FavoritesStack"
        options={{
          tabBarIcon: ({ color }) => (
            <TabBarIcon source={require('../../../assets/icons/heart.png')} color={color} />
          ),
        }}
      >
        {() => (
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Favorites" component={FavoritesScreen} />
            <Stack.Screen name="CollectionDetail" component={CollectionDetailScreen} />
            <Stack.Screen name="RoomDetail" component={RoomDetailScreen} />
            <Stack.Screen name="UserProfile" component={UserProfileScreen} />
            <Stack.Screen name="Comments" component={CommentsScreen} />
          </Stack.Navigator>
        )}
      </Tab.Screen>
      <Tab.Screen
        name="ProfileStack"
        options={{
          tabBarIcon: ({ color }) => (
            <TabBarIcon source={require('../../../assets/icons/profile.png')} color={color} />
          ),
        }}
      >
        {() => (
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Profile" component={ProfileScreen} />
            <Stack.Screen name="Settings" component={SettingsScreen} />
            <Stack.Screen name="FollowingFollowers" component={FollowingFollowersScreen} />
            <Stack.Screen name="RoomDetail" component={RoomDetailScreen} />
            <Stack.Screen name="UserProfile" component={UserProfileScreen} />
            <Stack.Screen name="Comments" component={CommentsScreen} />
          </Stack.Navigator>
        )}
      </Tab.Screen>
    </Tab.Navigator>
  );
}
