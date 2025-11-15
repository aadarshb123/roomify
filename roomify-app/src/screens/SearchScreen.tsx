import React, { useMemo, useState, useEffect } from 'react';
import styled from 'styled-components/native';
import { TextInput, Dimensions, ActivityIndicator } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Image as ExpoImage } from 'expo-image';
import { 
  getRooms, 
  Room, 
  getSearchHistory, 
  saveSearchHistory,
  getTrendingRooms,
  getTopCreators,
  getPersonalizedRecommendations,
  getTrendingThemes,
  getEditorsPicks,
  User
} from '../services/api';
import { useAuth } from '../context/AuthContext';

const COLOR = {
  bg: '#EDE8DC',
  text: '#111827',
  subtext: '#666',
  cardBg: '#FFFFFF',
  shadow: '#000000',
  inputBg: '#FFFFFF',
  hint: '#9CA3AF',
  border: '#111827',
  chipBg: '#778DBE',
  chipSelectedBg: '#111827',
  chipSelectedText: '#EDE8DC',
};

const W = Dimensions.get('window').width;
const RESULTS_H_PADDING = 18;
const RESULTS_GUTTER = 14;
const RESULTS_COL_W = (W - RESULTS_H_PADDING * 2 - RESULTS_GUTTER) / 2;

/* ---------- filter options ---------- */
const ROOM_TYPES = ['Bedroom', 'Kitchen', 'Living Room', 'Bathroom', 'Dining Room', 'Home Office', 'Home Decor', 'Outdoor', 'Kids Room'] as const;
const COLORS = ['Neutral', 'Dark', 'Colorful', 'Light', 'Warm', 'Cool'] as const;
const STYLES = ['Modern', 'Cozy', 'Minimalist', 'Scandinavian', 'Industrial', 'Rustic', 'Bohemian', 'Traditional'] as const;

type RoomType = (typeof ROOM_TYPES)[number];
type ColorType = (typeof COLORS)[number];
type StyleType = (typeof STYLES)[number];

/* ---------- existing static content ---------- */
const TRENDING_IMAGES = [
  { id: 1, image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&dpr=2' },
  { id: 2, image: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800&dpr=2' },
];
const CREATOR_SPOTLIGHT = [
  { id: 1, image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&dpr=2' },
  { id: 2, image: 'https://images.unsplash.com/photo-1615873968403-89e068629265?w=800&dpr=2' },
  { id: 3, image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800&dpr=2' },
  { id: 4, image: 'https://images.unsplash.com/photo-1615874694520-474822394e73?w=800&dpr=2' },
];
const TRENDING_THEMES = [
  { id: 1, image: 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800&dpr=2' },
  { id: 2, image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&dpr=2' },
  { id: 3, image: 'https://images.unsplash.com/photo-1600607687644-aac4c3eac7f4?w=800&dpr=2' },
];
const IDEAS_YOU_MIGHT_LIKE = [
  { id: 1, image: 'https://images.unsplash.com/photo-1600210491892-03d54c0aaf87?w=800&dpr=2', height: 200 },
  { id: 2, image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&dpr=2', height: 150 },
  { id: 3, image: 'https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=800&dpr=2', height: 150 },
];

/* ---------- searchable items (full-page results) ---------- */
const SEARCH_ITEMS = [
  {
    id: 's1',
    title: 'Warm neutral bedroom',
    image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&dpr=2',
    height: 220,
    roomType: 'Bedroom' as RoomType,
    color: 'Neutral' as ColorType,
    style: 'Cozy' as StyleType,
  },
  {
    id: 's2',
    title: 'Modern living room corner',
    image: 'https://images.unsplash.com/photo-1615873968403-89e068629265?w=800&dpr=2',
    height: 260,
    roomType: 'Living Room' as RoomType,
    color: 'Dark' as ColorType,
    style: 'Modern' as StyleType,
  },
  {
    id: 's3',
    title: 'Minimal kitchen nook',
    image: 'https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=800&dpr=2',
    height: 210,
    roomType: 'Kitchen' as RoomType,
    color: 'Neutral' as ColorType,
    style: 'Minimalist' as StyleType,
  },
  {
    id: 's4',
    title: 'Colorful cozy living room',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&dpr=2',
    height: 240,
    roomType: 'Living Room' as RoomType,
    color: 'Colorful' as ColorType,
    style: 'Cozy' as StyleType,
  },
];

export default function SearchScreen() {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const navigation = useNavigation();

  const [query, setQuery] = useState('');
  const [roomFilter, setRoomFilter] = useState<RoomType | null>(null);
  const [colorFilter, setColorFilter] = useState<ColorType | null>(null);
  const [styleFilter, setStyleFilter] = useState<StyleType | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  const [history, setHistory] = useState<string[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(false);
  const [useBackend, setUseBackend] = useState(false);
  
  // Featured sections data
  const [trendingRooms, setTrendingRooms] = useState<Room[]>([]);
  const [topCreators, setTopCreators] = useState<Array<{ user: User; roomCount: number; sampleRoom?: Room }>>([]);
  const [personalizedRooms, setPersonalizedRooms] = useState<Room[]>([]);
  const [trendingThemes, setTrendingThemes] = useState<Array<{ theme: string; roomCount: number; sampleRoom?: Room }>>([]);
  const [editorsPicks, setEditorsPicks] = useState<Room[]>([]);
  const [loadingFeatured, setLoadingFeatured] = useState(false);

  const hasActiveFilters =
    !!query.trim() || roomFilter !== null || colorFilter !== null || styleFilter !== null;

  // Load search history from Firebase
  useEffect(() => {
    const loadHistory = async () => {
      if (!user) {
        setHistory([]);
        return;
      }

      try {
        const savedHistory = await getSearchHistory();
        setHistory(savedHistory);
      } catch (error) {
        console.error('Error loading search history:', error);
      }
    };

    loadHistory();
  }, [user]);

  // Load featured sections data
  useEffect(() => {
    const loadFeaturedSections = async () => {
      if (!user) {
        return;
      }

      try {
        setLoadingFeatured(true);
        const [trending, creators, personalized, themes, picks] = await Promise.all([
          getTrendingRooms(2),
          getTopCreators(4),
          getPersonalizedRecommendations(3),
          getTrendingThemes(3),
          getEditorsPicks(3),
        ]);

        setTrendingRooms(trending);
        setTopCreators(creators);
        setPersonalizedRooms(personalized);
        setTrendingThemes(themes);
        setEditorsPicks(picks);
      } catch (error) {
        console.error('Error loading featured sections:', error);
      } finally {
        setLoadingFeatured(false);
      }
    };

    loadFeaturedSections();
  }, [user]);

  // Fetch rooms from backend when filters are applied
  useEffect(() => {
    const fetchRooms = async () => {
      if (!user || !hasActiveFilters) {
        setUseBackend(false);
        setRooms([]);
        return;
      }

      try {
        setLoading(true);
        setUseBackend(true);
        
        const response = await getRooms({
          roomType: roomFilter || undefined,
          color: colorFilter || undefined,
          style: styleFilter || undefined,
          limit: 50,
        });
        
        // Filter by query if provided (backend doesn't support text search yet)
        let filtered = response.rooms;
        if (query.trim()) {
          const q = query.trim().toLowerCase();
          filtered = filtered.filter((room) =>
            room.title?.toLowerCase().includes(q) ||
            room.description?.toLowerCase().includes(q)
          );
        }
        
        setRooms(filtered);
      } catch (err: any) {
        console.error('Error fetching rooms from Firestore:', err);
        // If it's an index error, the getRooms function should handle it gracefully
        // But if it still fails, fall back to frontend search
        if (err.message?.includes('index') || err.code === 'failed-precondition') {
          console.warn('⚠️ Firestore index missing, falling back to frontend search');
        }
        setUseBackend(false);
        setRooms([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, [user, roomFilter, colorFilter, styleFilter, query, hasActiveFilters]);

  /* ---------- frontend search logic (fallback) ---------- */
  const filteredItems = useMemo(() => {
    if (useBackend) {
      // Transform backend rooms to match frontend format
      return rooms.map((room) => ({
        id: room.id,
        title: room.title,
        image: room.uri,
        height: 220,
        roomType: room.roomType as RoomType | undefined,
        color: room.color as ColorType | undefined,
        style: room.style as StyleType | undefined,
      }));
    }
    
    // Fallback to static data
    return SEARCH_ITEMS.filter((item) => {
      if (query.trim()) {
        const q = query.trim().toLowerCase();
        if (!item.title.toLowerCase().includes(q)) return false;
      }
      if (roomFilter && item.roomType !== roomFilter) return false;
      if (colorFilter && item.color !== colorFilter) return false;
      if (styleFilter && item.style !== styleFilter) return false;
      return true;
    });
  }, [rooms, useBackend, query, roomFilter, colorFilter, styleFilter]);

  const handleSubmit = async () => {
    const q = query.trim();
    if (!q) return;
    
    const updatedHistory = [q, ...history.filter((h) => h !== q)].slice(0, 10);
    setHistory(updatedHistory);
    setShowHistory(false);
    
    // Save to Firebase
    if (user) {
      try {
        await saveSearchHistory(updatedHistory);
      } catch (error) {
        console.error('Error saving search history:', error);
      }
    }
  };

  const handleSelectHistory = (term: string) => {
    setQuery(term);
    setShowHistory(false);
  };

  const handleClearFilters = () => {
    setQuery('');
    setRoomFilter(null);
    setColorFilter(null);
    setStyleFilter(null);
  };

  return (
    <Screen edges={['top']}>
      <Container
        contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Search Bar + filters + history */}
        <SearchWrap>
          <SearchInner>
            <IconImg source={require('../../assets/icons/search.png')} />
            <StyledInput
              placeholder="Search"
              placeholderTextColor={COLOR.hint}
              value={query}
              onChangeText={setQuery}
              onFocus={() => setShowHistory(true)}
              onBlur={() => setTimeout(() => setShowHistory(false), 200)}
              onSubmitEditing={handleSubmit}
              returnKeyType="search"
            />
            <IconImg source={require('../../assets/icons/Microphone.png')} />
          </SearchInner>

          {/* search history dropdown (inline) */}
          {showHistory && history.length > 0 && (
            <HistoryCard>
              {history.map((term) => (
                <HistoryRow
                  key={term}
                  onPress={() => handleSelectHistory(term)}
                  activeOpacity={0.7}
                >
                  <HistoryText numberOfLines={1}>{term}</HistoryText>
                  <HistoryDeleteButton
                    onPress={async (e) => {
                      e.stopPropagation(); // don't trigger select
                      const updatedHistory = history.filter((h) => h !== term);
                      setHistory(updatedHistory);
                      
                      // Save to Firebase
                      if (user) {
                        try {
                          await saveSearchHistory(updatedHistory);
                        } catch (error) {
                          console.error('Error saving search history:', error);
                        }
                      }
                    }}
                    activeOpacity={0.7}
                  >
                    <HistoryDeleteText>✕</HistoryDeleteText>
                  </HistoryDeleteButton>
                </HistoryRow>
              ))}
            </HistoryCard>
          )}

          {/* Filters */}
          <FiltersWrap>
            <FilterGroup>
              <FilterLabel>Room</FilterLabel>
              <FilterChipRow>
                {ROOM_TYPES.map((r) => {
                  const active = roomFilter === r;
                  return (
                    <FilterChip
                      key={r}
                      $active={active}
                      onPress={() => setRoomFilter(active ? null : r)}
                      activeOpacity={0.85}
                    >
                      <FilterChipText $active={active}>{r}</FilterChipText>
                    </FilterChip>
                  );
                })}
              </FilterChipRow>
            </FilterGroup>

            <FilterGroup>
              <FilterLabel>Color</FilterLabel>
              <FilterChipRow>
                {COLORS.map((c) => {
                  const active = colorFilter === c;
                  return (
                    <FilterChip
                      key={c}
                      $active={active}
                      onPress={() => setColorFilter(active ? null : c)}
                      activeOpacity={0.85}
                    >
                      <FilterChipText $active={active}>{c}</FilterChipText>
                    </FilterChip>
                  );
                })}
              </FilterChipRow>
            </FilterGroup>

            <FilterGroup>
              <FilterLabel>Style</FilterLabel>
              <FilterChipRow>
                {STYLES.map((s) => {
                  const active = styleFilter === s;
                  return (
                    <FilterChip
                      key={s}
                      $active={active}
                      onPress={() => setStyleFilter(active ? null : s)}
                      activeOpacity={0.85}
                    >
                      <FilterChipText $active={active}>{s}</FilterChipText>
                    </FilterChip>
                  );
                })}
              </FilterChipRow>
            </FilterGroup>

            {hasActiveFilters && (
              <ClearRow>
                <ClearText onPress={handleClearFilters}>Clear filters</ClearText>
              </ClearRow>
            )}
          </FiltersWrap>
        </SearchWrap>

        {/* If filters/search active → full-page results view */}
        {hasActiveFilters ? (
          <ResultsWrap>
            <ResultsHeader>
              <ResultsTitle>Search results</ResultsTitle>
              <ResultsMeta>
                {loading ? 'Loading...' : `${filteredItems.length} result${filteredItems.length !== 1 ? 's' : ''}`}
              </ResultsMeta>
            </ResultsHeader>

            {loading ? (
              <LoadingContainer>
                <ActivityIndicator size="large" color={COLOR.text} />
              </LoadingContainer>
            ) : filteredItems.length === 0 ? (
              <EmptyHint>Try changing filters or search terms.</EmptyHint>
            ) : (
              <ResultsGrid>
                <ResultsColumn>
                  {filteredItems
                    .filter((_, i) => i % 2 === 0)
                    .map((item) => {
                      // Find the full room object if available
                      const fullRoom = useBackend ? rooms.find(r => r.id === item.id) : null;
                      return (
                        <CardShadow key={item.id}>
                          <CardClip 
                            activeOpacity={0.85}
                            onPress={() => {
                              if (fullRoom) {
                                navigation.navigate('RoomDetail' as never, { room: fullRoom } as never);
                              } else {
                                // Fallback: create a minimal room object from item
                                const room: Room = {
                                  id: item.id,
                                  title: item.title || '',
                                  uri: item.image,
                                  roomType: item.roomType,
                                  color: item.color,
                                  style: item.style,
                                  userId: '',
                                  createdAt: new Date(),
                                };
                                navigation.navigate('RoomDetail' as never, { room } as never);
                              }
                            }}
                          >
                            <ResultImg
                              source={{ uri: item.image }}
                              style={{ height: item.height, width: RESULTS_COL_W }}
                            />
                          </CardClip>
                        </CardShadow>
                      );
                    })}
                </ResultsColumn>
                <ResultsColumn>
                  {filteredItems
                    .filter((_, i) => i % 2 === 1)
                    .map((item) => {
                      // Find the full room object if available
                      const fullRoom = useBackend ? rooms.find(r => r.id === item.id) : null;
                      return (
                        <CardShadow key={item.id}>
                          <CardClip 
                            activeOpacity={0.85}
                            onPress={() => {
                              if (fullRoom) {
                                navigation.navigate('RoomDetail' as never, { room: fullRoom } as never);
                              } else {
                                // Fallback: create a minimal room object from item
                                const room: Room = {
                                  id: item.id,
                                  title: item.title || '',
                                  uri: item.image,
                                  roomType: item.roomType,
                                  color: item.color,
                                  style: item.style,
                                  userId: '',
                                  createdAt: new Date(),
                                };
                                navigation.navigate('RoomDetail' as never, { room } as never);
                              }
                            }}
                          >
                            <ResultImg
                              source={{ uri: item.image }}
                              style={{ height: item.height, width: RESULTS_COL_W }}
                            />
                          </CardClip>
                        </CardShadow>
                      );
                    })}
                </ResultsColumn>
              </ResultsGrid>
            )}
          </ResultsWrap>
        ) : (
          /* Default explore view (your original layout) */
          <ContentRow>
            {/* Left column */}
            <LeftCol>
              <Section>
                <SectionTitle>Trending now</SectionTitle>
                <SectionSub>What everyone's searching for right now</SectionSub>
                {loadingFeatured ? (
                  <LoadingContainer>
                    <ActivityIndicator size="small" color={COLOR.text} />
                  </LoadingContainer>
                ) : trendingRooms.length > 0 ? (
                  <Row gap={12}>
                    {trendingRooms.map((room) => (
                      <Flex1 key={room.id}>
                        <CardShadow>
                          <CardClip 
                            activeOpacity={0.85}
                            onPress={() => navigation.navigate('RoomDetail' as never, { room } as never)}
                          >
                            <Img style={{ height: 220 }} source={{ uri: room.uri }} />
                          </CardClip>
                        </CardShadow>
                      </Flex1>
                    ))}
                  </Row>
                ) : (
                  <EmptySectionText>No trending rooms yet</EmptySectionText>
                )}
              </Section>

              <Section>
                <SectionTitle>Trending themes</SectionTitle>
                <SectionSub>Curated moodboards you'll love</SectionSub>
                {loadingFeatured ? (
                  <LoadingContainer>
                    <ActivityIndicator size="small" color={COLOR.text} />
                  </LoadingContainer>
                ) : trendingThemes.length > 0 ? (
                  <Row gap={12}>
                    {trendingThemes.map((theme) => (
                      <Flex1 key={theme.theme}>
                        <CardShadow>
                          <CardClip 
                            activeOpacity={0.85}
                            onPress={() => theme.sampleRoom && navigation.navigate('RoomDetail' as never, { room: theme.sampleRoom } as never)}
                          >
                            <Img style={{ height: 100 }} source={{ uri: theme.sampleRoom?.uri || '' }} />
                          </CardClip>
                        </CardShadow>
                      </Flex1>
                    ))}
                  </Row>
                ) : (
                  <EmptySectionText>No themes yet</EmptySectionText>
                )}
              </Section>

              <Section>
                <SectionTitle>Editor&apos;s pick: This month</SectionTitle>
                <SectionSub>A fresh design story every month</SectionSub>
                {loadingFeatured ? (
                  <LoadingContainer>
                    <ActivityIndicator size="small" color={COLOR.text} />
                  </LoadingContainer>
                ) : editorsPicks.length > 0 ? (
                  <Row gap={12}>
                    {editorsPicks.map((room) => (
                      <Flex1 key={room.id}>
                        <CardShadow>
                          <CardClip 
                            activeOpacity={0.85}
                            onPress={() => navigation.navigate('RoomDetail' as never, { room } as never)}
                          >
                            <Img style={{ height: 100 }} source={{ uri: room.uri }} />
                          </CardClip>
                        </CardShadow>
                      </Flex1>
                    ))}
                  </Row>
                ) : (
                  <EmptySectionText>No editor picks this month</EmptySectionText>
                )}
              </Section>
            </LeftCol>

            {/* Right column */}
            <RightCol>
              <Section>
                <SectionTitle>Creator spotlight</SectionTitle>
                <SectionSub>Top creators and their inspiring ideas</SectionSub>
                {loadingFeatured ? (
                  <LoadingContainer>
                    <ActivityIndicator size="small" color={COLOR.text} />
                  </LoadingContainer>
                ) : topCreators.length > 0 ? (
                  <Wrap gap={10}>
                    {topCreators.map((creator, index) => (
                      <Half key={creator.user.id || index}>
                        <CardShadow>
                          <CardClip 
                            activeOpacity={0.85}
                            onPress={() => creator.user.id && navigation.navigate('UserProfile' as never, { userId: creator.user.id } as never)}
                          >
                            {creator.sampleRoom ? (
                              <Img style={{ height: 80 }} source={{ uri: creator.sampleRoom.uri }} />
                            ) : (
                              <PlaceholderImg style={{ height: 80 }} />
                            )}
                          </CardClip>
                        </CardShadow>
                      </Half>
                    ))}
                  </Wrap>
                ) : (
                  <EmptySectionText>No creators yet</EmptySectionText>
                )}
              </Section>

              <Section>
                <SectionTitle>Ideas you might like</SectionTitle>
                {loadingFeatured ? (
                  <LoadingContainer>
                    <ActivityIndicator size="small" color={COLOR.text} />
                  </LoadingContainer>
                ) : personalizedRooms.length > 0 ? (
                  <Col gap={12}>
                    {personalizedRooms.map((room, index) => (
                      <CardShadow key={room.id}>
                        <CardClip 
                          activeOpacity={0.85}
                          onPress={() => navigation.navigate('RoomDetail' as never, { room } as never)}
                        >
                          <Img 
                            style={{ height: index === 0 ? 200 : 150 }} 
                            source={{ uri: room.uri }} 
                          />
                        </CardClip>
                      </CardShadow>
                    ))}
                  </Col>
                ) : (
                  <EmptySectionText>Like some rooms to get personalized recommendations</EmptySectionText>
                )}
              </Section>
            </RightCol>
          </ContentRow>
        )}
      </Container>
    </Screen>
  );
}

/* ========== Styles ========== */
const Screen = styled(SafeAreaView)`
  flex: 1;
  background-color: ${COLOR.bg};
`;

const Container = styled.ScrollView`
  flex: 1;
  background-color: ${COLOR.bg};
`;

/* Search bar */
const SearchWrap = styled.View`
  padding: 22px 18px 16px;
  background-color: ${COLOR.bg};
`;

const SearchInner = styled.View`
  flex-direction: row;
  align-items: center;
  background-color: ${COLOR.inputBg};
  border-radius: 26px;
  padding: 0 14px;
  height: 52px;
  border: 1px solid ${COLOR.border};

  shadow-color: ${COLOR.shadow};
  shadow-opacity: 0.15;
  shadow-radius: 8px;
  shadow-offset: 0px 4px;
  elevation: 5;
`;

const IconImg = styled.Image`
  width: 20px;
  height: 20px;
  margin-horizontal: 8px;
  resize-mode: contain;
  tint-color: ${COLOR.text};
`;

const StyledInput = styled(TextInput)`
  flex: 1;
  font-size: 16px;
  color: ${COLOR.text};
`;

/* Search history */
const HistoryCard = styled.View`
  margin-top: 8px;
  border-radius: 14px;
  padding: 8px 10px;
  background-color: ${COLOR.cardBg};

  shadow-color: ${COLOR.shadow};
  shadow-opacity: 0.12;
  shadow-radius: 8px;
  shadow-offset: 0px 3px;
  elevation: 4;
`;

const HistoryRow = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding-vertical: 6px;
`;

const HistoryText = styled.Text`
  flex: 1;
  font-size: 14px;
  color: ${COLOR.text};
`;

const HistoryDeleteButton = styled.TouchableOpacity`
  padding: 4px 6px;
  margin-left: 6px;
`;

const HistoryDeleteText = styled.Text`
  font-size: 12px;
  color: ${COLOR.subtext};
`;

/* Filters */
const FiltersWrap = styled.View`
  margin-top: 14px;
  gap: 10px;
`;

const FilterGroup = styled.View`
  gap: 6px;
`;

const FilterLabel = styled.Text`
  font-size: 12px;
  color: ${COLOR.subtext};
`;

const FilterChipRow = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  gap: 6px;
`;

const FilterChip = styled.TouchableOpacity<{ $active: boolean }>`
  padding: 6px 12px;
  border-radius: 16px;
  background-color: ${({ $active }) =>
    $active ? COLOR.chipSelectedBg : COLOR.chipBg};
  border: 1px solid ${COLOR.border};
`;

const FilterChipText = styled.Text<{ $active: boolean }>`
  color: ${({ $active }) =>
    $active ? COLOR.chipSelectedText : COLOR.cardBg};
  font-size: 13px;
`;

const ClearRow = styled.View`
  margin-top: 4px;
`;

const ClearText = styled.Text`
  font-size: 12px;
  color: ${COLOR.subtext};
  text-decoration: underline;
`;

/* Default content layout */
const ContentRow = styled.View`
  flex-direction: row;
  padding: 0 18px;
  gap: 18px;
`;

const LeftCol = styled.View`
  flex: 1;
`;

const RightCol = styled.View`
  width: ${Math.max(150, W * 0.36)}px;
`;

const Section = styled.View`
  margin-bottom: 32px;
`;

const SectionTitle = styled.Text`
  font-size: 20px;
  font-weight: 700;
  color: ${COLOR.text};
  margin-bottom: 6px;
`;

const SectionSub = styled.Text`
  font-size: 13px;
  color: ${COLOR.subtext};
  margin-bottom: 14px;
`;

/* Grid helpers */
const Row = styled.View<{ gap?: number }>`
  flex-direction: row;
  gap: ${({ gap }) => gap ?? 10}px;
`;

const Col = styled.View<{ gap?: number }>`
  flex-direction: column;
  gap: ${({ gap }) => gap ?? 10}px;
`;

const Wrap = styled.View<{ gap?: number }>`
  flex-direction: row;
  flex-wrap: wrap;
  gap: ${({ gap }) => gap ?? 8}px;
`;

const Flex1 = styled.View`
  flex: 1;
`;

const Half = styled.View`
  width: 48%;
`;

/* Card styles (shared) */
const CardShadow = styled.View`
  border-radius: 14px;
  background-color: ${COLOR.cardBg};

  shadow-color: ${COLOR.shadow};
  shadow-opacity: 0.16;
  shadow-radius: 10px;
  shadow-offset: 0px 6px;
  elevation: 5;
`;

const CardClip = styled.TouchableOpacity`
  overflow: hidden;
  border-radius: 14px;
  background-color: ${COLOR.cardBg};
`;

const Img = styled(ExpoImage)`
  width: 100%;
  height: 100%;
  background-color: #f2f2f2;
`;

const PlaceholderImg = styled.View`
  width: 100%;
  height: 100%;
  background-color: ${COLOR.cardBg};
  justify-content: center;
  align-items: center;
`;

const EmptySectionText = styled.Text`
  font-size: 14px;
  color: ${COLOR.subtext};
  text-align: center;
  padding: 20px;
  font-style: italic;
`;

/* Results view */
const ResultsWrap = styled.View`
  padding: 12px ${RESULTS_H_PADDING}px 0;
`;

const ResultsHeader = styled.View`
  flex-direction: row;
  align-items: baseline;
  justify-content: space-between;
  margin-bottom: 12px;
`;

const ResultsTitle = styled.Text`
  font-size: 20px;
  font-weight: 700;
  color: ${COLOR.text};
`;

const ResultsMeta = styled.Text`
  font-size: 12px;
  color: ${COLOR.subtext};
`;

const ResultsGrid = styled.View`
  flex-direction: row;
  gap: ${RESULTS_GUTTER}px;
`;

const ResultsColumn = styled.View`
  flex: 1;
  gap: ${RESULTS_GUTTER}px;
`;

const ResultImg = styled.Image`
  width: ${RESULTS_COL_W}px;
  background-color: #f2f2f2;
`;

const EmptyHint = styled.Text`
  font-size: 12px;
  color: ${COLOR.subtext};
  margin-top: 8px;
`;

const LoadingContainer = styled.View`
  padding: 60px 20px;
  align-items: center;
  justify-content: center;
`;
