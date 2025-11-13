import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Image, ActivityIndicator, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { storage, db } from '../config/firebase';
import { useAuth } from '../context/AuthContext';


const ROOM_TYPES = ['Bedroom', 'Living Room', 'Kitchen', 'Office', 'Bathroom', 'Décor'];
const ROOM_STYLES = ['Modern', 'Minimalist', 'Coastal', 'Scandinavian', 'Art Deco'];

export default function AddImageScreen() {
  const [selectedRoomTypes, setSelectedRoomTypes] = useState<string[]>([]);
  const [selectedStyles, setSelectedStyles] = useState<string[]>([]);
  const [description, setDescription] = useState('');
  const [localImageUri, setLocalImageUri] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const { user } = useAuth();
  const [image, setImage] = useState<string | null>(null);

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

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Please grant permission to access your photos.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.9,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setLocalImageUri(result.assets[0].uri);
    }
  };

  const handleUpload = async () => {
    if (!user) {
      Alert.alert('Please log in', 'You need to be logged in to upload.');
      return;
    }
    if (!localImageUri) {
      Alert.alert('No image selected', 'Please pick an image before uploading.');
      return;
    }

    setUploading(true);
    try {
      // Upload image to Firebase Storage
      const response = await fetch(localImageUri);
      const blob = await response.blob();
      const fileName = `uploads/${user.uid}_${Date.now()}.jpg`;
      const storageRef = ref(storage, fileName);

      await uploadBytes(storageRef, blob);
      const imageUrl = await getDownloadURL(storageRef);

      // Create Firestore document
      await addDoc(collection(db, 'uploads'), {
        userId: user.uid,
        imageUrl,
        roomTypes: selectedRoomTypes,
        styles: selectedStyles,
        description,
        status: 'pending',
        createdAt: serverTimestamp(),
      });

      Alert.alert('Success', 'Your room image has been uploaded!');
      // Reset form
      setLocalImageUri(null);
      setSelectedRoomTypes([]);
      setSelectedStyles([]);
      setDescription('');
    } catch (error) {
      console.error('Upload failed:', error);
      Alert.alert('Upload Failed', 'Something went wrong. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Upload Your Room</Text>

      {/* Upload Area */}
      <TouchableOpacity style={styles.uploadArea} onPress={pickImage}>
        {localImageUri ? (
          <Image
            source={{ uri: localImageUri }}
            style={{ width: '100%', height: '100%', borderRadius: 20 }}
          />
        ) : (
          <>
            <View style={styles.uploadIcon}>
              <Text style={styles.uploadIconText}>+</Text>
            </View>
            <Text style={styles.uploadText}>Upload Image</Text>
          </>
        )}
      </TouchableOpacity>

      {/* Room Type Section */}
      <Text style={styles.sectionTitle}>Room Type</Text>
      <View style={styles.chipContainer}>
        {ROOM_TYPES.map((type) => (
          <TouchableOpacity
            key={type}
            style={[styles.chip, selectedRoomTypes.includes(type) && styles.chipSelected]}
            onPress={() => toggleRoomType(type)}
          >
            <Text style={[styles.chipText, selectedRoomTypes.includes(type) && styles.chipTextSelected]}>
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
            style={[styles.chip, selectedStyles.includes(style) && styles.chipSelected]}
            onPress={() => toggleStyle(style)}
          >
            <Text style={[styles.chipText, selectedStyles.includes(style) && styles.chipTextSelected]}>
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

      {/* Save Button */}
      <TouchableOpacity
        style={[styles.saveButton, uploading && { opacity: 0.6 }]}
        onPress={handleUpload}
        disabled={uploading}
      >
        {uploading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.saveButtonText}>Save to My Pins</Text>
        )}
      </TouchableOpacity>

      {/* Share Button */}
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
    overflow: 'hidden',
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