import React, { useState } from 'react';
import styled, { css } from 'styled-components/native';
import { Platform } from 'react-native';

import * as ImagePicker from 'expo-image-picker';
import { Alert, Image } from 'react-native';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { storage, db } from '../../config/firebase';
import { useAuth } from '../../context/AuthContext';

const ROOM_TYPES = ['Bedroom', 'Living Room', 'Kitchen', 'Office', 'Bathroom', 'Décor'];
const ROOM_STYLES = ['Modern', 'Minimalist', 'Coastal', 'Scandinavian', 'Art Deco'];

const COLOR = {
  bg: '#EDE8DC',             // same background as login
  text: '#111827',           // dark contrast text
  subtext: '#444',
  border: '#111827',         // subtle black border tone
  white: '#FFFFFF',
  accent: '#111827',         // black CTA
  overlay: 'rgba(230,218,201,0.9)',

  chipBg: '#D8D3C4',
  chipSelectedBg: '#111827',
  chipText: '#111827',
  chipTextSelected: '#EDE8DC',

  uploadBorder: '#111827',
  uploadIconBg: '#111827',
  uploadIcon: '#EDE8DC',

  descBorder: '#111827',
  btnPrimary: '#111827',
  btnSecondary: '#EDE8DC',
  btnPrimaryText: '#EDE8DC',
  btnSecondaryText: '#111827',

  title: '#111111',
};

const shadow = css`
  ${Platform.select({
    ios: css`
      shadow-color: #000;
      shadow-opacity: 0.08;
      shadow-radius: 10px;
      shadow-offset: 0px 6px;
    `,
    android: css`
      elevation: 2;
    `,
  })}
`;

export default function AddImageScreen() {
  const [selectedRoomTypes, setSelectedRoomTypes] = useState<string[]>([]);
  const [selectedStyles, setSelectedStyles] = useState<string[]>([]);
  const [description, setDescription] = useState('');

  const [localImageUri, setLocalImageUri] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const { user } = useAuth();

  const toggleRoomType = (type: string) => {
    setSelectedRoomTypes((prev) =>
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  const toggleStyle = (style: string) => {
    setSelectedStyles((prev) =>
      prev.includes(style) ? prev.filter(s => s !== style) : [...prev, style]
    );
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission denied', 'Please allow photo library access.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.9,
    });

    if (!result.canceled && result.assets?.length) {
      setLocalImageUri(result.assets[0].uri);
    }
  };

  const handleUpload = async () => {
    if (!user) {
      Alert.alert('Please log in', 'You must be logged in to upload.');
      return;
    }
    if (!localImageUri) {
      Alert.alert('No image selected', 'Tap the upload area to choose an image.');
      return;
    }

    try {
      setUploading(true);
      const resp = await fetch(localImageUri);
      const blob = await resp.blob();
      const fileRef = ref(storage, `uploads/${user.uid}_${Date.now()}.jpg`);
      await uploadBytes(fileRef, blob);
      const downloadURL = await getDownloadURL(fileRef);

      await addDoc(collection(db, 'uploads'), {
        userId: user.uid,
        imageUrl: downloadURL,
        roomTypes: selectedRoomTypes,
        styles: selectedStyles,
        description,
        status: 'pending',
        createdAt: serverTimestamp(),
      });

      Alert.alert('Success', 'Your room image has been uploaded!');
      setLocalImageUri(null);
      setSelectedRoomTypes([]);
      setSelectedStyles([]);
      setDescription('');
    } catch (e: any) {
      console.error(e);
      Alert.alert('Upload failed', e?.message || 'Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <Screen
      contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 60, paddingBottom: 48 }}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      <Title>Upload Your Room</Title>

      {/* Upload Area */}
      <UploadArea onPress={pickImage}>
        {localImageUri ? (
          <Image
            source={{ uri: localImageUri }}
            style={{ width: '100%', height: '100%', borderRadius: 20 }}
            resizeMode="cover"
          />
        ) : (
          <>
            <UploadIcon><UploadIconText>+</UploadIconText></UploadIcon>
            <UploadIconText>Upload Image</UploadIconText>
          </>
        )}
      </UploadArea>


      {/* Room Type */}
      <Section>
        <SectionTitle>Room Type</SectionTitle>
        <ChipRow>
          {ROOM_TYPES.map((type) => {
            const selected = !!selectedRoomTypes.includes(type);
            return (
              <Chip key={type} $selected={selected} onPress={() => toggleRoomType(type)}>
                <ChipText $selected={selected}>{type}</ChipText>
              </Chip>
            );
          })}
          <Chip $selected={false}>
            <ChipText $selected={false}>+</ChipText>
          </Chip>
        </ChipRow>
      </Section>

      {/* Room Style */}
      <Section>
        <SectionTitle>Room Style</SectionTitle>
        <ChipRow>
          {ROOM_STYLES.map((style) => {
            const selected = !!selectedStyles.includes(style);
            return (
              <Chip key={style} $selected={selected} onPress={() => toggleStyle(style)}>
                <ChipText $selected={selected}>{style}</ChipText>
              </Chip>
            );
          })}
        </ChipRow>
      </Section>

      {/* Description */}
      <Section>
        <SectionTitle>Description</SectionTitle>
        <DescriptionInput
          placeholder="Add a description..."
          placeholderTextColor="#999"
          multiline
          numberOfLines={4}
          value={description}
          onChangeText={setDescription}
        />
      </Section>

      {/* Actions */}
      <PrimaryButton onPress={handleUpload} disabled={uploading}>
        <PrimaryButtonText>{uploading ? 'Uploading…' : 'Save to My Pins'}</PrimaryButtonText>
      </PrimaryButton>

      <SecondaryButton activeOpacity={0.9} onPress={() => Alert.alert('Coming Soon', 'Share to Explore Feed feature coming soon!')} disabled={uploading}>
        <SecondaryButtonText>Share to Explore Feed</SecondaryButtonText>
      </SecondaryButton>
    </Screen>
  );
}

/* ---------- styled-components ---------- */
/* Buttons */
const BaseButton = styled.TouchableOpacity`
  height: 56px;
  border-radius: 15px;
  align-items: center;
  justify-content: center;
  margin-top: 8px;
  ${shadow}
`;

const Screen = styled.ScrollView`
  flex: 1;
  background-color: ${COLOR.bg};
`;

const Title = styled.Text`
  font-size: 28px;
  line-height: 34px;
  font-weight: 800;
  color: ${COLOR.text};
  margin-bottom: 24px;
  text-align: center;
  letter-spacing: 0.3px;
`;

const UploadArea = styled.TouchableOpacity`
  height: 220px;
  border-width: 1.5px;
  border-color: ${COLOR.uploadBorder};
  border-style: dashed;
  border-radius: 20px;
  align-items: center;
  justify-content: center;
  margin-bottom: 28px;
  background-color: rgba(255,255,255,0.5);
  ${shadow}
`;

const UploadIcon = styled.View`
  width: 64px;
  height: 64px;
  border-radius: 18px;
  background-color: ${COLOR.uploadIconBg};
  align-items: center;
  justify-content: center;
  margin-bottom: 14px;
`;

const UploadIconText = styled.Text`
  font-size: 36px;
  color: ${COLOR.uploadIcon};
  font-weight: 300;
`;

const PrimaryButton = styled(BaseButton)`
  background-color: ${COLOR.btnPrimary};
  border: 1.5px solid ${COLOR.border};
`;

const SecondaryButton = styled(BaseButton)<{ disabled?: boolean }>`
  background-color: ${COLOR.btnSecondary};
  border: 1.5px solid ${COLOR.border};
  opacity: ${({ disabled }) => (disabled ? 0.5 : 1)};
`;

const DescriptionInput = styled.TextInput`
  border-width: 1.5px;
  border-color: ${COLOR.descBorder};
  border-radius: 18px;
  padding: 14px 16px;
  font-size: 16px;
  color: ${COLOR.text};
  background-color: rgba(255,255,255,0.85);
  text-align-vertical: top;
  ${shadow}
`;

const UploadText = styled.Text`
  color: '#111827';
  font-size: 17px;
  font-weight: 600;
`;

const UploadHint = styled.Text`
  margin-top: 4px;
  color: #111827;
  font-size: 12px;
  opacity: 0.8;
`;

/* Sections */
const Section = styled.View`
  margin-bottom: 20px;
`;

const SectionTitle = styled.Text`
  font-size: 18px;
  font-weight: 700;
  color: ${COLOR.title};
  margin-bottom: 12px;
`;

/* Chips */
const ChipRow = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  gap: 10px;
`;

const Chip = styled.TouchableOpacity.attrs({
  hitSlop: { top: 6, bottom: 6, left: 6, right: 6 },
  activeOpacity: 0.9,
})<{ $selected: boolean }>`
  padding: 10px 18px;
  border-radius: 20px;
  background-color: ${({ $selected }: { $selected: boolean }) => ($selected ? COLOR.chipSelectedBg : COLOR.chipBg)};
  ${Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOpacity: 0.06,
      shadowRadius: 4,
      shadowOffset: { width: 0, height: 1 },
    },
    android: { elevation: 1 },
  } as any)}
`;

const ChipText = styled.Text<{ $selected: boolean }>`
  font-size: 15px;
  color: ${({ $selected }: { $selected: boolean }) => $selected ? COLOR.chipTextSelected : COLOR.chipText};
  font-weight: ${({ $selected }: { $selected: boolean }) => $selected ? 700 : 600};
  letter-spacing: 0.2px;
`;

const PrimaryButtonText = styled.Text`
  color: ${COLOR.btnPrimaryText};
  font-size: 17px;
  font-weight: 700;
  letter-spacing: 0.2px;
`;

const SecondaryButtonText = styled.Text`
  color: ${COLOR.btnSecondaryText};
  font-size: 17px;
  font-weight: 700;
  letter-spacing: 0.2px;
`;