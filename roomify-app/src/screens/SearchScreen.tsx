import React from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, Image, TouchableOpacity } from 'react-native';

const TRENDING_IMAGES = [
  { id: 1, image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=400', width: 1, height: 1.5 },
  { id: 2, image: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=400', width: 1, height: 1.5 },
];

const CREATOR_SPOTLIGHT = [
  { id: 1, image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400' },
  { id: 2, image: 'https://images.unsplash.com/photo-1615873968403-89e068629265?w=400' },
  { id: 3, image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=400' },
  { id: 4, image: 'https://images.unsplash.com/photo-1615874694520-474822394e73?w=400' },
];

const TRENDING_THEMES = [
  { id: 1, image: 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=400' },
  { id: 2, image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400' },
  { id: 3, image: 'https://images.unsplash.com/photo-1600607687644-aac4c3eac7f4?w=400' },
];

const IDEAS_YOU_MIGHT_LIKE = [
  { id: 1, image: 'https://images.unsplash.com/photo-1600210491892-03d54c0aaf87?w=400', height: 200 },
  { id: 2, image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400', height: 150 },
  { id: 3, image: 'https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=400', height: 150 },
];

const EDITORS_PICK = [
  { id: 1, image: 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=400' },
  { id: 2, image: 'https://images.unsplash.com/photo-1600047509358-9dc75507daeb?w=400' },
  { id: 3, image: 'https://images.unsplash.com/photo-1600047509782-20d39509f26d?w=400' },
];

export default function SearchScreen() {
  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search"
            placeholderTextColor="#999"
          />
          <TouchableOpacity>
            <Text style={styles.micIcon}>🎤</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Two Column Layout */}
        <View style={styles.contentWrapper}>
          {/* Left Column */}
          <View style={styles.leftColumn}>
            {/* Trending Now */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Trending now</Text>
              <Text style={styles.sectionSubtitle}>What everyone's searching for right now</Text>
              <View style={styles.trendingGrid}>
                {TRENDING_IMAGES.map((item) => (
                  <TouchableOpacity key={item.id} style={styles.trendingCard}>
                    <Image source={{ uri: item.image }} style={styles.trendingImage} />
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Trending Themes */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Trending themes</Text>
              <Text style={styles.sectionSubtitle}>Curated moodboards you'll love</Text>
              <View style={styles.themeGrid}>
                {TRENDING_THEMES.map((item) => (
                  <TouchableOpacity key={item.id} style={styles.themeCard}>
                    <Image source={{ uri: item.image }} style={styles.themeImage} />
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Editor's Pick */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Editor's pick: This month</Text>
              <Text style={styles.sectionSubtitle}>A fresh design story every month</Text>
              <View style={styles.themeGrid}>
                {EDITORS_PICK.map((item) => (
                  <TouchableOpacity key={item.id} style={styles.themeCard}>
                    <Image source={{ uri: item.image }} style={styles.themeImage} />
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>

          {/* Right Column */}
          <View style={styles.rightColumn}>
            {/* Creator Spotlight */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Creator spotlight</Text>
              <Text style={styles.sectionSubtitle}>Top creators and their inspiring ideas</Text>
              <View style={styles.creatorGrid}>
                {CREATOR_SPOTLIGHT.map((item) => (
                  <TouchableOpacity key={item.id} style={styles.creatorCard}>
                    <Image source={{ uri: item.image }} style={styles.creatorImage} />
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Ideas You Might Like */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Ideas you might like</Text>
              <View style={styles.ideasColumn}>
                {IDEAS_YOU_MIGHT_LIKE.map((item) => (
                  <TouchableOpacity key={item.id} style={styles.ideaCard}>
                    <Image
                      source={{ uri: item.image }}
                      style={[styles.ideaImage, { height: item.height }]}
                    />
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        </View>

        <View style={{ height: 40 }} />
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
  searchContainer: {
    paddingHorizontal: 15,
    paddingBottom: 15,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 25,
    paddingHorizontal: 15,
    height: 50,
  },
  searchIcon: {
    fontSize: 20,
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#1a1a1a',
  },
  micIcon: {
    fontSize: 20,
  },
  contentWrapper: {
    flexDirection: 'row',
    paddingHorizontal: 15,
    gap: 15,
  },
  leftColumn: {
    flex: 1,
  },
  rightColumn: {
    width: 140,
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#1a1a1a',
  },
  sectionSubtitle: {
    fontSize: 12,
    color: '#666',
    marginBottom: 12,
  },
  trendingGrid: {
    flexDirection: 'row',
    gap: 10,
  },
  trendingCard: {
    flex: 1,
    borderRadius: 15,
    overflow: 'hidden',
    backgroundColor: '#fff',
  },
  trendingImage: {
    width: '100%',
    height: 220,
  },
  themeGrid: {
    flexDirection: 'row',
    gap: 10,
  },
  themeCard: {
    flex: 1,
    borderRadius: 15,
    overflow: 'hidden',
    backgroundColor: '#fff',
  },
  themeImage: {
    width: '100%',
    height: 100,
  },
  creatorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  creatorCard: {
    width: '48%',
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#fff',
  },
  creatorImage: {
    width: '100%',
    height: 80,
  },
  ideasColumn: {
    gap: 10,
  },
  ideaCard: {
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#fff',
  },
  ideaImage: {
    width: '100%',
  },
});
