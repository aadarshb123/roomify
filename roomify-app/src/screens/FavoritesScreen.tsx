import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';

const COLLECTIONS = [
  { id: 1, name: 'Modern Cozy Bedroom', count: 5, image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=400' },
  { id: 2, name: 'Cozy home', count: 10, image: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=400' },
  { id: 3, name: 'Scandi Living Room', count: 5, image: 'https://images.unsplash.com/photo-1615873968403-89e068629265?w=400' },
  { id: 4, name: 'My home decor', count: 10, image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=400' },
  { id: 5, name: 'Minimalist Spaces', count: 8, image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400' },
  { id: 6, name: 'Warm & Inviting', count: 12, image: 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=400' },
];

export default function FavoritesScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Collections</Text>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.grid}>
          {COLLECTIONS.map((collection) => (
            <TouchableOpacity key={collection.id} style={styles.collectionCard}>
              <Image source={{ uri: collection.image }} style={styles.collectionImage} />
              <TouchableOpacity style={styles.heartIcon}>
                <Text style={styles.heartText}>❤️</Text>
              </TouchableOpacity>
              <View style={styles.collectionInfo}>
                <Text style={styles.collectionName}>{collection.name}</Text>
                <Text style={styles.collectionCount}>{collection.count}</Text>
              </View>
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
    paddingTop: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#1a1a1a',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 15,
    gap: 15,
  },
  collectionCard: {
    width: '47%',
    backgroundColor: '#fff',
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 5,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  collectionImage: {
    width: '100%',
    height: 220,
  },
  heartIcon: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  heartText: {
    fontSize: 18,
  },
  collectionInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    paddingTop: 10,
  },
  collectionName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a1a',
    flex: 1,
  },
  collectionCount: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
});
