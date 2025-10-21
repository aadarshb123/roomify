import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Dimensions } from 'react-native';

const CATEGORIES = ['All', 'Bedroom', 'Kitchen', 'Home Decor'];

// Sample room images
const SAMPLE_ROOMS = [
  { id: 1, image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=400', height: 300 },
  { id: 2, image: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=400', height: 280 },
  { id: 3, image: 'https://images.unsplash.com/photo-1615873968403-89e068629265?w=400', height: 380 },
  { id: 4, image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400', height: 240 },
  { id: 5, image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=400', height: 320 },
  { id: 6, image: 'https://images.unsplash.com/photo-1615874694520-474822394e73?w=400', height: 260 },
  { id: 7, image: 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=400', height: 300 },
  { id: 8, image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400', height: 340 },
];

const { width } = Dimensions.get('window');
const COLUMN_WIDTH = (width - 45) / 2; // 2 columns with padding

export default function HomeScreen() {
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Split items into two columns for masonry layout
  const leftColumn = SAMPLE_ROOMS.filter((_, index) => index % 2 === 0);
  const rightColumn = SAMPLE_ROOMS.filter((_, index) => index % 2 === 1);

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Filter Pills */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filterScrollView}
          contentContainerStyle={styles.filterContainer}
        >
          {CATEGORIES.map((category) => (
            <TouchableOpacity
              key={category}
              style={[
                styles.filterPill,
                selectedCategory === category && styles.filterPillSelected
              ]}
              onPress={() => setSelectedCategory(category)}
            >
              <Text style={[
                styles.filterText,
                selectedCategory === category && styles.filterTextSelected
              ]}>
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Masonry Grid */}
        <View style={styles.masonryContainer}>
          <View style={styles.column}>
            {leftColumn.map((item) => (
              <TouchableOpacity key={item.id} style={styles.imageCard}>
                <Image
                  source={{ uri: item.image }}
                  style={[styles.image, { height: item.height }]}
                  resizeMode="cover"
                />
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.column}>
            {rightColumn.map((item) => (
              <TouchableOpacity key={item.id} style={styles.imageCard}>
                <Image
                  source={{ uri: item.image }}
                  style={[styles.image, { height: item.height }]}
                  resizeMode="cover"
                />
              </TouchableOpacity>
            ))}
          </View>
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
  filterScrollView: {
    maxHeight: 60,
  },
  filterContainer: {
    paddingHorizontal: 15,
    paddingVertical: 15,
    gap: 10,
  },
  filterPill: {
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#9BA9C4',
    marginRight: 10,
  },
  filterPillSelected: {
    backgroundColor: '#2C3E50',
  },
  filterText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  filterTextSelected: {
    fontWeight: '600',
  },
  masonryContainer: {
    flexDirection: 'row',
    paddingHorizontal: 15,
    gap: 15,
  },
  column: {
    flex: 1,
    gap: 15,
  },
  imageCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  image: {
    width: '100%',
    backgroundColor: '#f0f0f0',
  },
});
