import React, { useMemo, useState, useEffect } from 'react';
import styled from 'styled-components/native';
import { Dimensions, ScrollView, ActivityIndicator, TouchableOpacity, Text, Alert } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Image as ExpoImage } from 'expo-image';
import { getRooms, Room, toggleSave, getSavedRooms } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useNavigation } from '@react-navigation/native';

const COLOR = {
  bg: '#EDE8DC',
  text: '#111827',
  chipBg: '#778DBE',
  chipText: '#111827',
  chipSelectedBg: '#111827',
  chipSelectedText: '#EDE8DC',
  headerBg: '#EDE8DC',
  cardBg: '#FFFFFF',
  shadow: '#000000',
};

const CATEGORIES = [
  'All',
  'Bedroom',
  'Kitchen',
  'Living Room',
  'Bathroom',
  'Dining Room',
  'Home Office',
  'Home Decor',
  'Outdoor',
  'Kids Room',
] as const;

const { width } = Dimensions.get('window');
const H_PADDING = 16;
const GUTTER = 14;
const MAX_CONTENT = 860; // keeps grid centered & lovely on tablets
const COL_W = (Math.min(width, MAX_CONTENT) - H_PADDING * 2 - GUTTER) / 2;
const CHIP_MAX_W = 130;

export default function HomeScreen() {
  const [selected, setSelected] = useState<(typeof CATEGORIES)[number]>('All');
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [savedRoomIds, setSavedRoomIds] = useState<Set<string>>(new Set());
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const navigation = useNavigation<any>();

  // Load saved rooms to track which ones are favorited
  useEffect(() => {
    const loadSavedRooms = async () => {
      if (!user) {
        setSavedRoomIds(new Set());
        return;
      }

      try {
        const savedRooms = await getSavedRooms();
        const savedIds = new Set(savedRooms.map(room => room.id));
        setSavedRoomIds(savedIds);
      } catch (err) {
        console.error('Error loading saved rooms:', err);
      }
    };

    loadSavedRooms();
  }, [user]);

  // Refresh saved rooms when screen comes into focus
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      if (!user) {
        setSavedRoomIds(new Set());
        return;
      }

      try {
        const savedRooms = await getSavedRooms();
        const savedIds = new Set(savedRooms.map(room => room.id));
        setSavedRoomIds(savedIds);
      } catch (err) {
        console.error('Error loading saved rooms:', err);
      }
    });

    return unsubscribe;
  }, [navigation, user]);

  // Fetch rooms from backend
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const roomType = selected === 'All' ? undefined : selected;
        const response = await getRooms({ roomType, limit: 50 });
        
        // Transform rooms to include height for layout
        const roomsWithHeight = response.rooms.map((room) => ({
          ...room,
          h: Math.floor(Math.random() * 120) + 180, // Random height between 180-300
        })) as (Room & { h: number })[];
        
        setRooms(roomsWithHeight as any);
      } catch (err: any) {
        console.error('Error fetching rooms:', err);
        setError(err.message);
        setRooms([]); // No fallback - show empty state
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, [selected]);

  // Handle heart toggle
  const handleToggleFavorite = async (roomId: string, e: any) => {
    e.stopPropagation();
    
    if (!user) {
      Alert.alert('Login Required', 'Please log in to save your favorite rooms', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Log In', onPress: () => navigation.navigate('Login' as never) }
      ]);
      return;
    }

    try {
      // Optimistic update
      const isCurrentlySaved = savedRoomIds.has(roomId);
      const newSavedIds = new Set(savedRoomIds);
      
      if (isCurrentlySaved) {
        newSavedIds.delete(roomId);
      } else {
        newSavedIds.add(roomId);
      }
      setSavedRoomIds(newSavedIds);

      // Sync with Firebase
      await toggleSave(roomId);
    } catch (err) {
      console.error('Error toggling favorite:', err);
      // Revert optimistic update on error
      const isCurrentlySaved = savedRoomIds.has(roomId);
      const newSavedIds = new Set(savedRoomIds);
      if (isCurrentlySaved) {
        newSavedIds.add(roomId);
      } else {
        newSavedIds.delete(roomId);
      }
      setSavedRoomIds(newSavedIds);
    }
  };

  const filtered = useMemo(() => {
    if (loading) return [];
    return rooms;
  }, [rooms, loading]) as (Room & { h?: number })[];

  const left = filtered.filter((_, i) => i % 2 === 0);
  const right = filtered.filter((_, i) => i % 2 === 1);

  return (
    <Screen edges={['top']}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        stickyHeaderIndices={[1]}
        contentContainerStyle={{ paddingBottom: insets.bottom + 16 }}
      >
        <Header>
          <Logo source={require('../../../assets/logo-withbg.png')} resizeMode="contain" />
          <Tagline>Find your next room vibe</Tagline>
        </Header>

        {/* Sticky chips with a downward-only shadow */}
        <PillsShadow>
          <Pills
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: H_PADDING, gap: 10 }}
          >
            {CATEGORIES.map((c) => {
              const active = c === selected;
              return (
                <Chip key={c} $active={active} onPress={() => setSelected(c)} activeOpacity={0.85}>
                  <ChipText $active={active} numberOfLines={1}>{c}</ChipText>
                </Chip>
              );
            })}
          </Pills>
        </PillsShadow>

        {/* Centered grid wrapper to remove the right bias */}
        <Content>
          {loading ? (
            <LoadingContainer>
              <ActivityIndicator size="large" color={COLOR.text} />
            </LoadingContainer>
          ) : error ? (
            <EmptyContainer>
              <EmptyText>Error loading rooms</EmptyText>
              <EmptySubtext>{error}</EmptySubtext>
            </EmptyContainer>
          ) : filtered.length === 0 ? (
            <EmptyContainer>
              <EmptyText>No rooms found</EmptyText>
              <EmptySubtext>Create some rooms in Firestore to see them here</EmptySubtext>
            </EmptyContainer>
          ) : (
            <Grid>
              <Column>
                {left.map((item) => {
                  const isSaved = savedRoomIds.has(item.id);
                  return (
                    <CardShadow key={item.id}>
                      <Card 
                        activeOpacity={0.85}
                        onPress={() => navigation.navigate('RoomDetail', { room: item })}
                      >
                        <CardImg
                          source={{ uri: item.uri }}
                          style={{ width: COL_W, height: item.h || 240, borderRadius: 14 }}
                          contentFit="cover"
                          transition={120}
                        />
                        <HeartButton
                          activeOpacity={0.8}
                          onPress={(e) => handleToggleFavorite(item.id, e)}
                        >
                          <HeartIcon 
                            source={isSaved 
                              ? require('../../../assets/icons/filledheart-white.png')
                              : require('../../../assets/icons/heart.png')
                            } 
                          />
                        </HeartButton>
                      </Card>
                    </CardShadow>
                  );
                })}
              </Column>
              <Column>
                {right.map((item) => {
                  const isSaved = savedRoomIds.has(item.id);
                  return (
                    <CardShadow key={item.id}>
                      <Card 
                        activeOpacity={0.85}
                        onPress={() => navigation.navigate('RoomDetail', { room: item })}
                      >
                        <CardImg
                          source={{ uri: item.uri }}
                          style={{ width: COL_W, height: item.h || 240, borderRadius: 14 }}
                          contentFit="cover"
                          transition={120}
                        />
                        <HeartButton
                          activeOpacity={0.8}
                          onPress={(e) => handleToggleFavorite(item.id, e)}
                        >
                          <HeartIcon 
                            source={isSaved 
                              ? require('../../../assets/icons/filledheart-white.png')
                              : require('../../../assets/icons/heart.png')
                            } 
                          />
                        </HeartButton>
                      </Card>
                    </CardShadow>
                  );
                })}
              </Column>
            </Grid>
          )}
        </Content>
      </ScrollView>
    </Screen>
  );
}

/* Layout */
const Screen = styled(SafeAreaView)`
  flex: 1;
  background-color: ${COLOR.bg};
`;

const Content = styled.View`
  width: 100%;
  align-items: center;            /* centers the grid container */
`;

const Grid = styled.View`
  width: 100%;
  max-width: ${MAX_CONTENT}px;    /* keeps grid centered on larger screens */
  padding: 0 ${H_PADDING}px;
  flex-direction: row;
  gap: ${GUTTER}px;
`;

const Column = styled.View`
  flex: 1;
  gap: ${GUTTER}px;
`;

/* Header */
const Header = styled.View`
  align-items: center;
  justify-content: center;
  padding: 24px 20px 10px;
  background-color: ${COLOR.headerBg};
`;

const Logo = styled.Image`
  width: 160px;
  height: 56px;
  margin-bottom: 8px;
`;

const Tagline = styled.Text`
  color: ${COLOR.text};
  opacity: 0.85;
  font-size: 13px;
`;

const PillsShadow = styled.View`
  background-color: ${COLOR.bg};
  margin-bottom: 15px; /* increased spacing between chips and grid */

  /* Downward-only shadow */
  shadow-color: ${COLOR.shadow};
  shadow-opacity: 0.1;
  shadow-radius: 3px;
  shadow-offset: 0px 8px;

  elevation: 5;

  border-bottom-width: 0.5px;
  border-bottom-color: rgba(17, 24, 39, 0.08);
`;

const Pills = styled.ScrollView`
  padding-vertical: 12px;
  background-color: ${COLOR.bg};
`;

const Chip = styled.TouchableOpacity<{ $active: boolean }>`
  max-width: ${CHIP_MAX_W}px;
  padding: 9px 16px;
  border-radius: 20px;
  background-color: ${(props: { $active: boolean }) => (props.$active ? COLOR.chipSelectedBg : COLOR.chipBg)};
  border: 1px solid ${COLOR.text};       /* mirrors LoginScreen field/CTA border */
  justify-content: center;
  align-items: center;
`;

const ChipText = styled.Text<{ $active: boolean }>`
  color: ${(props: { $active: boolean }) => (props.$active ? COLOR.chipSelectedText : COLOR.chipText)};
  font-size: 15px;
  font-weight: 500;
`;

/* Cards */
const CardShadow = styled.View`
  border-radius: 14px;
  background-color: ${COLOR.cardBg};

  shadow-color: ${COLOR.shadow};
  shadow-opacity: 0.18;
  shadow-radius: 10px;
  shadow-offset: 0px 6px;

  elevation: 6;
`;

const Card = styled.TouchableOpacity`
  border-radius: 14px;
  overflow: hidden;
  background-color: ${COLOR.cardBg};
`;

const CardImg = styled(ExpoImage)`
  background-color: #f2f2f2;
`;

const HeartButton = styled.TouchableOpacity`
  position: absolute;
  top: 10px;
  right: 10px;
  padding: 6px;
  z-index: 10;
`;

const HeartIcon = styled.Image`
  width: 22px;
  height: 22px;
  resize-mode: contain;
  opacity: 0.9;
`;

const LoadingContainer = styled.View`
  padding: 60px 20px;
  align-items: center;
  justify-content: center;
`;

const EmptyContainer = styled.View`
  padding: 80px 20px;
  align-items: center;
  justify-content: center;
`;

const EmptyText = styled.Text`
  font-size: 18px;
  font-weight: 600;
  color: ${COLOR.text};
  margin-bottom: 8px;
`;

const EmptySubtext = styled.Text`
  font-size: 14px;
  color: ${COLOR.text};
  opacity: 0.6;
  text-align: center;
`;
