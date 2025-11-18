import React, { useState } from 'react';
import { Alert, ActivityIndicator } from 'react-native';
import styled from 'styled-components/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';

const COLOR = {
  bg: '#EDE8DC',
  text: '#111827',
  cta: '#111827',
  white: '#FFFFFF',
  border: '#111827',
  selected: '#111827',
  unselected: '#D8D3C4',
};

const STYLES = [
  'Modern', 'Minimalist', 'Scandinavian', 'Industrial',
  'Bohemian', 'Contemporary', 'Rustic', 'Coastal',
  'Traditional', 'Mid-Century', 'Farmhouse', 'Eclectic'
];

const ROOM_TYPES = [
  'Living Room', 'Bedroom', 'Kitchen', 'Bathroom',
  'Dining Room', 'Home Office', 'Kids Room', 'Outdoor'
];

interface PreferencesScreenProps {
  navigation: any;
}

export default function PreferencesScreen({ navigation }: PreferencesScreenProps) {
  const [selectedStyles, setSelectedStyles] = useState<string[]>([]);
  const [selectedRooms, setSelectedRooms] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const toggleStyle = (style: string) => {
    setSelectedStyles(prev =>
      prev.includes(style)
        ? prev.filter(s => s !== style)
        : [...prev, style]
    );
  };

  const toggleRoom = (room: string) => {
    setSelectedRooms(prev =>
      prev.includes(room)
        ? prev.filter(r => r !== room)
        : [...prev, room]
    );
  };

  const handleContinue = async () => {
    if (selectedStyles.length === 0) {
      Alert.alert('Please select at least one style preference');
      return;
    }
    if (selectedRooms.length === 0) {
      Alert.alert('Please select at least one room type');
      return;
    }

    setLoading(true);
    try {
      // Save preferences to AsyncStorage
      await AsyncStorage.setItem('userPreferences', JSON.stringify({
        styles: selectedStyles,
        rooms: selectedRooms,
        completed: true,
      }));
      
      // Navigate to main app - this will be handled by RootNavigator
      navigation.replace('Main');
    } catch (error: any) {
      Alert.alert('Error', error.message);
      setLoading(false);
    }
  };

  const handleSkip = async () => {
    try {
      await AsyncStorage.setItem('userPreferences', JSON.stringify({
        styles: [],
        rooms: [],
        completed: true,
      }));
      navigation.replace('Main');
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <Screen edges={['top']}>
      <ScrollArea showsVerticalScrollIndicator={false}>
        <Header>
          <Title>Personalize Your Experience</Title>
          <Subtitle>Tell us about your design preferences</Subtitle>
        </Header>

        <Section>
          <SectionTitle>What styles do you like?</SectionTitle>
          <ChipsWrap>
            {STYLES.map(style => (
              <Chip
                key={style}
                $selected={selectedStyles.includes(style)}
                onPress={() => toggleStyle(style)}
              >
                <ChipText $selected={selectedStyles.includes(style)}>
                  {style}
                </ChipText>
              </Chip>
            ))}
          </ChipsWrap>
        </Section>

        <Section>
          <SectionTitle>Which rooms are you interested in?</SectionTitle>
          <ChipsWrap>
            {ROOM_TYPES.map(room => (
              <Chip
                key={room}
                $selected={selectedRooms.includes(room)}
                onPress={() => toggleRoom(room)}
              >
                <ChipText $selected={selectedRooms.includes(room)}>
                  {room}
                </ChipText>
              </Chip>
            ))}
          </ChipsWrap>
        </Section>

        <ButtonGroup>
          <CTA onPress={handleContinue} disabled={loading}>
            {loading ? (
              <ActivityIndicator color={COLOR.bg} />
            ) : (
              <CTAText>Continue</CTAText>
            )}
          </CTA>

          <SkipButton onPress={handleSkip} disabled={loading}>
            <SkipText>Skip for now</SkipText>
          </SkipButton>
        </ButtonGroup>
      </ScrollArea>
    </Screen>
  );
}

const Screen = styled(SafeAreaView)`
  flex: 1;
  background-color: ${COLOR.bg};
`;

const ScrollArea = styled.ScrollView`
  flex: 1;
`;

const Header = styled.View`
  padding: 40px 24px 20px;
  align-items: center;
`;

const Title = styled.Text`
  font-size: 28px;
  font-weight: bold;
  color: ${COLOR.text};
  margin-bottom: 8px;
  text-align: center;
`;

const Subtitle = styled.Text`
  font-size: 16px;
  color: ${COLOR.text};
  opacity: 0.7;
  text-align: center;
`;

const Section = styled.View`
  padding: 24px;
`;

const SectionTitle = styled.Text`
  font-size: 18px;
  font-weight: 600;
  color: ${COLOR.text};
  margin-bottom: 16px;
`;

const ChipsWrap = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  gap: 10px;
`;

const Chip = styled.TouchableOpacity<{ $selected: boolean }>`
  padding: 12px 20px;
  border-radius: 20px;
  background-color: ${props => props.$selected ? COLOR.selected : COLOR.unselected};
  border: 2px solid ${props => props.$selected ? COLOR.selected : 'transparent'};
`;

const ChipText = styled.Text<{ $selected: boolean }>`
  font-size: 14px;
  font-weight: 500;
  color: ${props => props.$selected ? COLOR.bg : COLOR.text};
`;

const ButtonGroup = styled.View`
  padding: 24px;
  gap: 12px;
  padding-bottom: 40px;
`;

const CTA = styled.TouchableOpacity`
  width: 100%;
  height: 56px;
  background-color: ${COLOR.cta};
  border-radius: 28px;
  justify-content: center;
  align-items: center;
  border: 1.5px solid ${COLOR.border};
`;

const CTAText = styled.Text`
  color: ${COLOR.bg};
  font-size: 18px;
  font-weight: 500;
`;

const SkipButton = styled.TouchableOpacity`
  width: 100%;
  height: 56px;
  justify-content: center;
  align-items: center;
`;

const SkipText = styled.Text`
  color: ${COLOR.text};
  font-size: 16px;
  opacity: 0.7;
`;
