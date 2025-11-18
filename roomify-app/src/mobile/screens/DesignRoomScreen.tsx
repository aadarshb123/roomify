import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function DesignRoomScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Design My Room</Text>
      <Text style={styles.subtitle}>Upload a room photo and let AI redesign it</Text>

      <View style={styles.uploadArea}>
        <Text style={styles.uploadText}>Tap to upload room photo</Text>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Style Preference</Text>
        <View style={styles.input}>
          <Text style={styles.inputPlaceholder}>e.g., Modern, Minimalist</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Generate Design</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 30,
  },
  uploadArea: {
    height: 200,
    borderWidth: 2,
    borderColor: '#ddd',
    borderStyle: 'dashed',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  uploadText: {
    color: '#999',
    fontSize: 16,
  },
  inputContainer: {
    marginBottom: 30,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    justifyContent: 'center',
  },
  inputPlaceholder: {
    color: '#999',
  },
  button: {
    height: 50,
    backgroundColor: '#007AFF',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
