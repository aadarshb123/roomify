import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput } from 'react-native';

const ROOM_TYPES = ['Bedroom', 'Living Room', 'Kitchen', 'Office', 'Bathroom', 'Décor'];
const ROOM_STYLES = ['Modern', 'Minimalist', 'Coastal', 'Scandinavian', 'Art Deco'];

export default function AddImageScreen() {
  const [selectedRoomTypes, setSelectedRoomTypes] = useState<string[]>([]);
  const [selectedStyles, setSelectedStyles] = useState<string[]>([]);
  const [description, setDescription] = useState('');

  const toggleRoomType = (type: string) => {
    if (selectedRoomTypes.includes(type)) {
      setSelectedRoomTypes(selectedRoomTypes.filter(t => t !== type));
    } else {
      setSelectedRoomTypes([...selectedRoomTypes, type]);
    }
  };

  const toggleStyle = (style: string) => {
    if (selectedStyles.includes(style)) {
      setSelectedStyles(selectedStyles.filter(s => s !== style));
    } else {
      setSelectedStyles([...selectedStyles, style]);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Upload Your Room</Text>

      {/* Upload Area */}
      <TouchableOpacity style={styles.uploadArea}>
        <View style={styles.uploadIcon}>
          <Text style={styles.uploadIconText}>+</Text>
        </View>
        <Text style={styles.uploadText}>Upload Image</Text>
      </TouchableOpacity>

      {/* Room Type Section */}
      <Text style={styles.sectionTitle}>Room Type</Text>
      <View style={styles.chipContainer}>
        {ROOM_TYPES.map((type) => (
          <TouchableOpacity
            key={type}
            style={[
              styles.chip,
              selectedRoomTypes.includes(type) && styles.chipSelected
            ]}
            onPress={() => toggleRoomType(type)}
          >
            <Text style={[
              styles.chipText,
              selectedRoomTypes.includes(type) && styles.chipTextSelected
            ]}>
              {type}
            </Text>
          </TouchableOpacity>
        ))}
        <TouchableOpacity style={styles.chip}>
          <Text style={styles.chipText}>+</Text>
        </TouchableOpacity>
      </View>

      {/* Room Style Section */}
      <Text style={styles.sectionTitle}>Room Style</Text>
      <View style={styles.chipContainer}>
        {ROOM_STYLES.map((style) => (
          <TouchableOpacity
            key={style}
            style={[
              styles.chip,
              selectedStyles.includes(style) && styles.chipSelected
            ]}
            onPress={() => toggleStyle(style)}
          >
            <Text style={[
              styles.chipText,
              selectedStyles.includes(style) && styles.chipTextSelected
            ]}>
              {style}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Description */}
      <TextInput
        style={styles.descriptionInput}
        placeholder="Add a description..."
        placeholderTextColor="#999"
        multiline
        numberOfLines={4}
        value={description}
        onChangeText={setDescription}
      />

      {/* Action Buttons */}
      <TouchableOpacity style={styles.saveButton}>
        <Text style={styles.saveButtonText}>Save to My Pins</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.shareButton}>
        <Text style={styles.shareButtonText}>Share to Explore Feed</Text>
      </TouchableOpacity>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#EDE8DC',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 25,
    color: '#000',
  },
  uploadArea: {
    height: 200,
    borderWidth: 2,
    borderColor: '#A67C52',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
    backgroundColor: 'transparent',
  },
  uploadIcon: {
    width: 60,
    height: 60,
    borderRadius: 15,
    backgroundColor: '#D4B59E',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  uploadIconText: {
    fontSize: 36,
    color: '#A67C52',
    fontWeight: '300',
  },
  uploadText: {
    color: '#A67C52',
    fontSize: 18,
    fontWeight: '500',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    marginTop: 10,
    color: '#000',
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 25,
  },
  chip: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#C4D4C0',
    borderWidth: 0,
  },
  chipSelected: {
    backgroundColor: '#8BA888',
  },
  chipText: {
    fontSize: 16,
    color: '#2C3E2A',
    fontWeight: '500',
  },
  chipTextSelected: {
    color: '#1a1a1a',
    fontWeight: '600',
  },
  descriptionInput: {
    height: 100,
    borderWidth: 2,
    borderColor: '#A67C52',
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 15,
    fontSize: 16,
    color: '#1a1a1a',
    textAlignVertical: 'top',
    marginBottom: 20,
    backgroundColor: 'transparent',
  },
  saveButton: {
    height: 55,
    backgroundColor: '#A67C52',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  shareButton: {
    height: 55,
    backgroundColor: '#D4C08E',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  shareButtonText: {
    color: '#1a1a1a',
    fontSize: 18,
    fontWeight: '600',
  },
});
