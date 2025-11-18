// src/screens/FavoritesScreen.tsx
import React, { useState, useEffect } from 'react';
import styled from 'styled-components/native';
import { Dimensions, ActivityIndicator } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Image as ExpoImage } from 'expo-image';
import { Room, getSavedRooms, toggleSave, Collection, getCollections, getCollectionRooms } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const COLOR = {
  bg: '#EDE8DC',
  text: '#111827',
  subtext: '#666',
  cardBg: '#FFFFFF',
  shadow: '#000000',
  chipBg: '#778DBE',
  border: '#111827', // ink border to echo LoginScreen/Home/Search
};

const { width } = Dimensions.get('window');
const H_PADDING = 16;
const GUTTER = 14;
const MAX_CONTENT = 860; // keeps grid nicely centered on large screens
const COL_W = (Math.min(width, MAX_CONTENT) - H_PADDING * 2 - GUTTER) / 2;

/* ---------- screen ---------- */
export default function FavoritesScreen() {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const navigation = useNavigation();
  
  const [savedRooms, setSavedRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [collections, setCollections] = useState<Array<{ id: string; name: string; count: number; image: string; collection: Collection }>>([]);
  const [loadingCollections, setLoadingCollections] = useState(true);

  // Load saved rooms and collections from Firestore
  useEffect(() => {
    const loadData = async () => {
      if (!user) {
        setSavedRooms([]);
        setCollections([]);
        setLoading(false);
        setLoadingCollections(false);
        return;
      }

      try {
        setLoading(true);
        setLoadingCollections(true);
        
        const [rooms, collectionsData] = await Promise.all([
          getSavedRooms(),
          getCollections(),
        ]);
        
        setSavedRooms(rooms);
        
        // Transform collections to include count and sample image, and keep full collection data
        const collectionsWithData = await Promise.all(
          collectionsData.map(async (collection) => {
            const collectionRooms = await getCollectionRooms(collection.id);
            const sampleRoom = collectionRooms[0];
            return {
              id: collection.id,
              name: collection.name,
              count: collection.roomIds.length,
              image: sampleRoom?.uri || 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&dpr=2',
              collection: collection, // Store full collection object for navigation
            };
          })
        );
        
        setCollections(collectionsWithData);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
        setLoadingCollections(false);
      }
    };

    loadData();
  }, [user]);

  // Refresh when screen comes into focus
  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      const loadData = async () => {
        if (!user) {
          setSavedRooms([]);
          setCollections([]);
          return;
        }

        try {
          const [rooms, collectionsData] = await Promise.all([
            getSavedRooms(),
            getCollections(),
          ]);
          
          setSavedRooms(rooms);
          
          // Transform collections to include count and sample image, and keep full collection data
          const collectionsWithData = await Promise.all(
            collectionsData.map(async (collection) => {
              const collectionRooms = await getCollectionRooms(collection.id);
              const sampleRoom = collectionRooms[0];
              return {
                id: collection.id,
                name: collection.name,
                count: collection.roomIds.length,
                image: sampleRoom?.uri || 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&dpr=2',
                collection: collection, // Store full collection object for navigation
              };
            })
          );
          
          setCollections(collectionsWithData);
        } catch (error) {
          console.error('Error loading data:', error);
        }
      };
      loadData();
    });

    return unsubscribe;
  }, [navigation, user]);

  const handleUnfavorite = async (roomId: string, e: any) => {
    e.stopPropagation();
    try {
      await toggleSave(roomId);
      // Remove from local state
      setSavedRooms(prev => prev.filter(room => room.id !== roomId));
    } catch (error) {
      console.error('Error unfavoriting room:', error);
    }
  };

  const leftFavs = savedRooms.filter((_, i) => i % 2 === 0);
  const rightFavs = savedRooms.filter((_, i) => i % 2 === 1);
  const isEmpty = savedRooms.length === 0;

  return (
    <Screen edges={['top']}>
      <Container
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}
      >
        {/* header */}
        <Header>
          <HeaderInner>
            <Title>Favorites</Title>
            <Subtitle>Rooms and ideas you’ve saved</Subtitle>
          </HeaderInner>
        </Header>

        {/* collections */}
        <Centered>
          <Section>
            <TitleRow>
              <SectionTitle>Collections</SectionTitle>
              <CountText>{collections.length}</CountText>
            </TitleRow>

            {loadingCollections ? (
              <LoadingContainer>
                <ActivityIndicator size="small" color={COLOR.text} />
              </LoadingContainer>
            ) : collections.length > 0 ? (
              <CollectionsWrap>
                {collections.map((c) => (
                  <CollectionCell key={c.id}>
                    <CardShadow>
                      <CardClip 
                        activeOpacity={0.85}
                        onPress={() => navigation.navigate('CollectionDetail' as never, { collection: c.collection } as never)}
                      >
                        <CollectionImg source={{ uri: c.image }} />
                        <CollectionInfo>
                          <CollectionName numberOfLines={1} ellipsizeMode="tail">
                            {c.name}
                          </CollectionName>
                          <Badge><BadgeText>{c.count}</BadgeText></Badge>
                        </CollectionInfo>
                      </CardClip>
                    </CardShadow>
                  </CollectionCell>
                ))}
              </CollectionsWrap>
            ) : (
              <EmptyCollectionsText>No collections yet</EmptyCollectionsText>
            )}
          </Section>
        </Centered>

        {/* favorites grid */}
        {loading ? (
          <LoadingContainer>
            <ActivityIndicator size="large" color={COLOR.text} />
          </LoadingContainer>
        ) : isEmpty ? (
          <EmptyWrap>
            <HeartBig source={require('../../../assets/icons/filledheart-white.png')} />
            <EmptyTitle>No favorites yet</EmptyTitle>
            <EmptySub>Tap the heart on any idea to save it here.</EmptySub>
          </EmptyWrap>
        ) : (
          <>
            <Centered>
              <Section style={{ paddingBottom: 8 }}>
                <SectionTitle>Saved ideas</SectionTitle>
              </Section>
            </Centered>

            <Centered>
              <Grid>
                <Column>
                  {leftFavs.map((room, index) => {
                    // Calculate height based on index for staggered layout
                    const height = index % 3 === 0 ? 240 : index % 3 === 1 ? 200 : 300;
                    return (
                      <CardShadow key={room.id}>
                        <CardClip
                          activeOpacity={0.85}
                          onPress={() => navigation.navigate('RoomDetail' as never, { room } as never)}
                        >
                          <Img source={{ uri: room.uri }} style={{ height, width: COL_W }} />
                          <HeartFab
                            activeOpacity={0.8}
                            onPress={(e) => handleUnfavorite(room.id, e)}
                          >
                            <HeartIcon source={require('../../../assets/icons/filledheart-white.png')} />
                          </HeartFab>
                        </CardClip>
                      </CardShadow>
                    );
                  })}
                </Column>

                <Column>
                  {rightFavs.map((room, index) => {
                    // Calculate height based on index for staggered layout
                    const height = index % 3 === 0 ? 200 : index % 3 === 1 ? 300 : 240;
                    return (
                      <CardShadow key={room.id}>
                        <CardClip
                          activeOpacity={0.85}
                          onPress={() => navigation.navigate('RoomDetail' as never, { room } as never)}
                        >
                          <Img source={{ uri: room.uri }} style={{ height, width: COL_W }} />
                          <HeartFab
                            activeOpacity={0.8}
                            onPress={(e) => handleUnfavorite(room.id, e)}
                          >
                            <HeartIcon source={require('../../../assets/icons/filledheart-white.png')} />
                          </HeartFab>
                        </CardClip>
                      </CardShadow>
                    );
                  })}
                </Column>
              </Grid>
            </Centered>
          </>
        )}
      </Container>
    </Screen>
  );
}

/* ---------- styles ---------- */
const Screen = styled(SafeAreaView)`
  flex: 1;
  background-color: ${COLOR.bg};
`;

const Container = styled.ScrollView`
  flex: 1;
  background-color: ${COLOR.bg};
`;

/* header */
const Header = styled.View`
  background-color: ${COLOR.bg};
  padding: 22px 16px 8px 16px;
`;

const HeaderInner = styled.View`
  width: 100%;
  max-width: ${MAX_CONTENT}px;
  align-self: center;
`;

const Title = styled.Text`
  font-size: 24px;
  font-weight: 800;
  color: ${COLOR.text};
`;

const Subtitle = styled.Text`
  margin-top: 6px;
  font-size: 13px;
  color: ${COLOR.subtext};
`;

/* center helper */
const Centered = styled.View`
  width: 100%;
  align-items: center;
`;

/* sections */
const Section = styled.View`
  width: 100%;
  max-width: ${MAX_CONTENT}px;
  padding: 26px ${H_PADDING}px 12px ${H_PADDING}px;
`;

const TitleRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
`;

const SectionTitle = styled.Text`
  font-size: 18px;
  font-weight: 700;
  color: ${COLOR.text};
`;

const CountText = styled.Text`
  color: ${COLOR.subtext};
  font-size: 12px;
`;

/* collections grid */
const CollectionsWrap = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  gap: ${GUTTER}px;
`;

const CollectionCell = styled.View`
  width: ${COL_W}px;
`;

const CollectionImg = styled.Image`
  width: ${COL_W}px;
  height: 160px;
  background-color: #f2f2f2;
`;

const CollectionInfo = styled.View`
  position: absolute;
  left: 8px;
  right: 8px;
  bottom: 8px;
  padding: 8px 10px;
  border-radius: 10px;
  background-color: rgba(255, 255, 255, 0.88);

  flex-direction: row;
  align-items: center;
  justify-content: space-between;

  shadow-color: ${COLOR.shadow};
  shadow-opacity: 0.18;
  shadow-radius: 8px;
  shadow-offset: 0px 4px;
  elevation: 4;
`;

const CollectionName = styled.Text`
  flex: 1;
  margin-right: 8px;
  color: ${COLOR.text};
  font-size: 14px;
  font-weight: 600;
`;

const Badge = styled.View`
  min-width: 26px;
  padding: 2px 8px;
  border-radius: 999px;
  align-items: center;
  justify-content: center;
  background-color: ${COLOR.chipBg};
`;

const BadgeText = styled.Text`
  color: #fff;
  font-size: 12px;
  font-weight: 700;
`;

/* favorites grid */
const Grid = styled.View`
  width: 100%;
  max-width: ${MAX_CONTENT}px;
  padding: 0 ${H_PADDING}px 8px ${H_PADDING}px;
  flex-direction: row;
  gap: ${GUTTER}px;
`;

const Column = styled.View`
  flex: 1;
  gap: ${GUTTER}px;
`;

/* shadow + clip pattern */
const CardShadow = styled.View`
  border-radius: 14px;
  background-color: ${COLOR.cardBg};

  shadow-color: ${COLOR.shadow};
  shadow-opacity: 0.18;
  shadow-radius: 10px;
  shadow-offset: 0px 6px;
  elevation: 6;
`;

const CardClip = styled.TouchableOpacity`
  overflow: hidden;
  border-radius: 14px;
  background-color: ${COLOR.cardBg};
  position: relative;
`;

const Img = styled(ExpoImage)`
  width: ${COL_W}px;
  background-color: #f2f2f2;
`;

const LoadingContainer = styled.View`
  padding: 60px 20px;
  align-items: center;
  justify-content: center;
`;

const EmptyCollectionsText = styled.Text`
  font-size: 14px;
  color: ${COLOR.subtext};
  text-align: center;
  padding: 20px;
  font-style: italic;
`;

const HeartFab = styled.TouchableOpacity`
  position: absolute;
  top: 10px;
  right: 10px;

  /* bigger tap target without visible bg */
  padding: 6px;
`;

const HeartIcon = styled.Image`
  width: 22px;
  height: 22px;
  resize-mode: contain;
  opacity: 0.9;
`;

/* empty state */
const EmptyWrap = styled.View`
  padding: 48px 20px 72px 20px;
  align-items: center;
  justify-content: center;
`;

const HeartBig = styled.Image`
  width: 56px;
  height: 56px;
  margin-bottom: 14px;
  resize-mode: contain;
`;

const EmptyTitle = styled.Text`
  font-size: 18px;
  font-weight: 700;
  color: ${COLOR.text};
  margin-bottom: 6px;
`;

const EmptySub = styled.Text`
  font-size: 13px;
  color: ${COLOR.subtext};
  text-align: center;
`;