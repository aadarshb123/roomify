import React, { useMemo, useState } from 'react';
import styled from 'styled-components/native';
import { Dimensions, ScrollView } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Image as ExpoImage } from 'expo-image';

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

const CATEGORIES = ['All', 'Bedroom', 'Kitchen', 'Living Room', 'Home Decor'] as const;

const DATA = [
  { id: '1', uri: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1200', h: 240 },
  { id: '2', uri: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=1200', h: 200 },
  { id: '3', uri: 'https://images.unsplash.com/photo-1615873968403-89e068629265?w=1200', h: 300 },
  { id: '4', uri: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1200', h: 180 },
  { id: '5', uri: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1200', h: 260 },
  { id: '6', uri: 'https://images.unsplash.com/photo-1615874694520-474822394e73?w=1200', h: 210 },
  { id: '7', uri: 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=1200', h: 240 },
  { id: '8', uri: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200', h: 280 },
];

const { width } = Dimensions.get('window');
const H_PADDING = 16;
const GUTTER = 14;
const MAX_CONTENT = 860; // keeps grid centered & lovely on tablets
const COL_W = (Math.min(width, MAX_CONTENT) - H_PADDING * 2 - GUTTER) / 2;
const CHIP_MAX_W = 120;

export default function HomeScreen() {
  const [selected, setSelected] = useState<(typeof CATEGORIES)[number]>('All');
  const insets = useSafeAreaInsets();

  const filtered = useMemo(() => {
    if (selected === 'All') return DATA;
    // hook up real filtering later; keep UX stable now
    return DATA;
  }, [selected]);

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
            contentContainerStyle={{ paddingHorizontal: H_PADDING, gap: 6 }}
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
          <Grid>
            <Column>
              {left.map((item) => (
                <CardShadow key={item.id}>
                  <Card activeOpacity={0.85}>
                    <CardImg
                      source={{ uri: item.uri }}
                      style={{ width: COL_W, height: item.h, borderRadius: 14 }}
                      contentFit="cover"
                      transition={120}
                    />
                  </Card>
                </CardShadow>
              ))}
            </Column>
            <Column>
              {right.map((item) => (
                <CardShadow key={item.id}>
                  <Card activeOpacity={0.85}>
                    <CardImg
                      source={{ uri: item.uri }}
                      style={{ width: COL_W, height: item.h, borderRadius: 14 }}
                      contentFit="cover"
                      transition={120}
                    />
                  </Card>
                </CardShadow>
              ))}
            </Column>
          </Grid>
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
  padding: 8px 14px;
  border-radius: 20px;
  background-color: ${(props: { $active: boolean }) => (props.$active ? COLOR.chipSelectedBg : COLOR.chipBg)};
  border: 1px solid ${COLOR.text};       /* mirrors LoginScreen field/CTA border */
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
