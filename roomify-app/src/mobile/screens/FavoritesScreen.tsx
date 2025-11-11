// src/screens/FavoritesScreen.tsx
import React from 'react';
import styled from 'styled-components/native';
import { Dimensions } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

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

/* ---------- sample data ---------- */
const COLLECTIONS = [
  { id: 1, name: 'Modern Cozy Bedroom', count: 5, image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&dpr=2' },
  { id: 2, name: 'Cozy home', count: 10, image: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800&dpr=2' },
  { id: 3, name: 'Scandi Living Room', count: 5, image: 'https://images.unsplash.com/photo-1615873968403-89e068629265?w=800&dpr=2' },
  { id: 4, name: 'My home decor', count: 10, image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800&dpr=2' },
  { id: 5, name: 'Minimalist Spaces', count: 8, image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&dpr=2' },
  { id: 6, name: 'Warm & Inviting', count: 12, image: 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800&dpr=2' },
];

const FAVORITES = [
  { id: 'f1', uri: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&dpr=2', h: 240 },
  { id: 'f2', uri: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800&dpr=2', h: 200 },
  { id: 'f3', uri: 'https://images.unsplash.com/photo-1615873968403-89e068629265?w=800&dpr=2', h: 300 },
  { id: 'f4', uri: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&dpr=2', h: 180 },
];

/* ---------- screen ---------- */
export default function FavoritesScreen() {
  const insets = useSafeAreaInsets();

  const leftFavs = FAVORITES.filter((_, i) => i % 2 === 0);
  const rightFavs = FAVORITES.filter((_, i) => i % 2 === 1);
  const isEmpty = FAVORITES.length === 0;

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
              <CountText>{COLLECTIONS.length}</CountText>
            </TitleRow>

            <CollectionsWrap>
              {COLLECTIONS.map((c) => (
                <CollectionCell key={c.id}>
                  <CardShadow>
                    <CardClip activeOpacity={0.85}>
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
          </Section>
        </Centered>

        {/* favorites grid */}
        {isEmpty ? (
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
                  {leftFavs.map(item => (
                    <CardShadow key={item.id}>
                      <CardClip activeOpacity={0.85}>
                        <Img source={{ uri: item.uri }} style={{ height: item.h, width: COL_W }} />
                        <HeartFab activeOpacity={0.8} onPress={() => { /* TODO: unfavorite */ }}>
                          <HeartIcon source={require('../../../assets/icons/filledheart-white.png')} />
                        </HeartFab>
                      </CardClip>
                    </CardShadow>
                  ))}
                </Column>

                <Column>
                  {rightFavs.map(item => (
                    <CardShadow key={item.id}>
                      <CardClip activeOpacity={0.85}>
                        <Img source={{ uri: item.uri }} style={{ height: item.h, width: COL_W }} />
                        <HeartFab activeOpacity={0.8} onPress={() => { /* TODO: unfavorite */ }}>
                          <HeartIcon source={require('../../../assets/icons/filledheart-white.png')} />
                        </HeartFab>
                      </CardClip>
                    </CardShadow>
                  ))}
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

const Img = styled.Image`
  width: ${COL_W}px;
  background-color: #f2f2f2;
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