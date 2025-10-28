import React, { useState } from 'react';
import styled, { css } from 'styled-components/native';
import { Platform } from 'react-native';

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

  return (
    <Screen
      contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 60, paddingBottom: 48 }}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      <Title>Upload Your Room</Title>

      {/* Upload Area */}
      <UploadArea activeOpacity={0.85} onPress={() => {}}>
        <UploadIcon>
          <UploadIconText>+</UploadIconText>
        </UploadIcon>
        <UploadText>Upload Image</UploadText>
        <UploadHint>JPG / PNG up to 10MB</UploadHint>
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
      <PrimaryButton activeOpacity={0.9}>
        <PrimaryButtonText>Save to My Pins</PrimaryButtonText>
      </PrimaryButton>

      <SecondaryButton activeOpacity={0.9}>
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

const SecondaryButton = styled(BaseButton)`
  background-color: ${COLOR.btnSecondary};
  border: 1.5px solid ${COLOR.border};
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
  background-color: ${({ $selected }) => ($selected ? COLOR.chipSelectedBg : COLOR.chipBg)};
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
  color: ${({ $selected }) => ($selected ? COLOR.chipTextSelected : COLOR.chipText)};
  font-weight: ${({ $selected }) => ($selected ? 700 : 600)};
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