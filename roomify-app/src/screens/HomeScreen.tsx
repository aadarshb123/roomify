import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Explore</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.filterContainer}>
          <TouchableOpacity style={styles.filterButton}>
            <Text style={styles.filterText}>All</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.filterButton, styles.filterButtonOutline]}>
            <Text style={styles.filterTextOutline}>Kitchen</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.filterButton, styles.filterButtonOutline]}>
            <Text style={styles.filterTextOutline}>Bedroom</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.filterButton, styles.filterButtonOutline]}>
            <Text style={styles.filterTextOutline}>Living Room</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.gridPlaceholder}>
          <Text style={styles.placeholderText}>
            Design feed will appear here
          </Text>
          <Text style={styles.placeholderSubtext}>
            Pinterest-style grid layout
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 20,
    paddingTop: 60,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
  },
  filterContainer: {
    flexDirection: 'row',
    padding: 15,
    gap: 10,
  },
  filterButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#007AFF',
  },
  filterButtonOutline: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  filterText: {
    color: '#fff',
    fontWeight: '600',
  },
  filterTextOutline: {
    color: '#007AFF',
    fontWeight: '600',
  },
  gridPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
    marginTop: 60,
  },
  placeholderText: {
    fontSize: 18,
    color: '#666',
    marginBottom: 10,
  },
  placeholderSubtext: {
    fontSize: 14,
    color: '#999',
  },
});
