import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, Image } from 'react-native';
import { useAuth } from '../context/AuthContext';

const STYLE_PREFERENCES = ['Modern', 'Minimalist', 'Scandinavian', 'Coastal'];

const HISTORY_IMAGES = [
  { id: 1, image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=300', liked: true },
  { id: 2, image: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=300', liked: false },
  { id: 3, image: 'https://images.unsplash.com/photo-1615873968403-89e068629265?w=300', liked: true },
  { id: 4, image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=300', liked: false },
];

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const [selectedTab, setSelectedTab] = useState('All History');

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              await logout();
            } catch (error: any) {
              Alert.alert('Error', error.message);
            }
          },
        },
      ]
    );
  };

  const getInitials = () => {
    if (user?.displayName) {
      return user.displayName
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase();
    }
    return user?.email?.[0].toUpperCase() || 'U';
  };

  return (
    <View style={styles.container}>
      {/* Top Icons */}
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.topIcon}>
          <Text style={styles.iconText}>🔍</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.topIcon}>
          <Text style={styles.iconText}>🔔</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.topIcon}>
          <Text style={styles.iconText}>➕</Text>
        </TouchableOpacity>
        <View style={{ flex: 1 }} />
        <TouchableOpacity style={styles.topIcon}>
          <Text style={styles.iconText}>⚙️</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.topIcon} onPress={handleLogout}>
          <Text style={styles.iconText}>🚪</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <View style={styles.header}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{getInitials()}</Text>
          </View>
          <Text style={styles.name}>{user?.displayName || 'User'}</Text>
          <Text style={styles.bio}>Crafting beautiful spaces with modern minimalism</Text>
        </View>

        {/* Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.stat}>
            <Text style={styles.statNumber}>3</Text>
            <Text style={styles.statLabel}>History</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statNumber}>9</Text>
            <Text style={styles.statLabel}>Likes</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statNumber}>6</Text>
            <Text style={styles.statLabel}>Saved</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statNumber}>42</Text>
            <Text style={styles.statLabel}>Following</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statNumber}>15</Text>
            <Text style={styles.statLabel}>Posts</Text>
          </View>
        </View>

        {/* Style Preferences */}
        <View style={styles.preferencesSection}>
          <Text style={styles.preferencesTitle}>My Style Preferences</Text>
          <View style={styles.preferencesContainer}>
            {STYLE_PREFERENCES.map((style, index) => (
              <View
                key={style}
                style={[
                  styles.preferenceTag,
                  index === 0 && styles.preferenceTagCoral,
                  index === 1 && styles.preferenceTagPink,
                  index === 2 && styles.preferenceTagBeige,
                  index === 3 && styles.preferenceTagBrown,
                ]}
              >
                <Text style={styles.preferenceText}>{style}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Tabs */}
        <View style={styles.tabsContainer}>
          <TouchableOpacity
            style={[styles.tab, selectedTab === 'All History' && styles.tabActive]}
            onPress={() => setSelectedTab('All History')}
          >
            <Text style={[styles.tabText, selectedTab === 'All History' && styles.tabTextActive]}>
              All History
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, selectedTab === 'Saved History' && styles.tabActive]}
            onPress={() => setSelectedTab('Saved History')}
          >
            <Text style={[styles.tabText, selectedTab === 'Saved History' && styles.tabTextActive]}>
              Saved History
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, selectedTab === 'Liked History' && styles.tabActive]}
            onPress={() => setSelectedTab('Liked History')}
          >
            <Text style={[styles.tabText, selectedTab === 'Liked History' && styles.tabTextActive]}>
              Liked History
            </Text>
          </TouchableOpacity>
        </View>

        {/* Image Grid */}
        <View style={styles.grid}>
          {HISTORY_IMAGES.map((item) => (
            <TouchableOpacity key={item.id} style={styles.gridItem}>
              <Image source={{ uri: item.image }} style={styles.gridImage} />
              {item.liked && (
                <View style={styles.likeIcon}>
                  <Text style={styles.likeIconText}>❤️</Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EDE8DC',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingTop: 50,
    paddingBottom: 15,
    gap: 10,
  },
  topIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#D4C5B0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconText: {
    fontSize: 18,
  },
  header: {
    alignItems: 'center',
    paddingTop: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#4A90E2',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  avatarText: {
    color: '#fff',
    fontSize: 36,
    fontWeight: 'bold',
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#1a1a1a',
  },
  bio: {
    fontSize: 13,
    color: '#666',
    textAlign: 'center',
    paddingHorizontal: 40,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  stat: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  statLabel: {
    fontSize: 11,
    color: '#666',
    marginTop: 2,
  },
  preferencesSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  preferencesTitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  preferencesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  preferenceTag: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 15,
  },
  preferenceTagCoral: {
    backgroundColor: '#F4A8A0',
  },
  preferenceTagPink: {
    backgroundColor: '#F5D5D5',
  },
  preferenceTagBeige: {
    backgroundColor: '#E8DCC8',
  },
  preferenceTagBrown: {
    backgroundColor: '#D4B59E',
  },
  preferenceText: {
    fontSize: 13,
    color: '#1a1a1a',
    fontWeight: '500',
  },
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 8,
    marginBottom: 15,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: 'rgba(212, 197, 176, 0.5)',
    alignItems: 'center',
  },
  tabActive: {
    backgroundColor: '#D4C5B0',
  },
  tabText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  tabTextActive: {
    color: '#1a1a1a',
    fontWeight: '600',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 15,
    gap: 10,
  },
  gridItem: {
    width: '48%',
    aspectRatio: 1,
    borderRadius: 15,
    overflow: 'hidden',
    backgroundColor: '#fff',
  },
  gridImage: {
    width: '100%',
    height: '100%',
  },
  likeIcon: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  likeIconText: {
    fontSize: 16,
  },
});
