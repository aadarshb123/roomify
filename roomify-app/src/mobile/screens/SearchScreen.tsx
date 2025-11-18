import React, { useMemo, useState } from 'react';
import styled from 'styled-components/native';
import { TextInput, Dimensions } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

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
const ROOM_TYPES = ['Bedroom', 'Living Room', 'Kitchen', 'Home Office'] as const;
const COLORS = ['Neutral', 'Dark', 'Colorful'] as const;
const STYLES = ['Modern', 'Cozy', 'Minimalist', 'Scandinavian'] as const;

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

  const [query, setQuery] = useState('');
  const [roomFilter, setRoomFilter] = useState<RoomType | null>(null);
  const [colorFilter, setColorFilter] = useState<ColorType | null>(null);
  const [styleFilter, setStyleFilter] = useState<StyleType | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  const [history, setHistory] = useState<string[]>([
    'cozy bedroom',
    'minimalist living room',
    'neutral kitchen',
  ]);

  const hasActiveFilters =
    !!query.trim() || roomFilter !== null || colorFilter !== null || styleFilter !== null;

  /* ---------- frontend search logic ---------- */
  const filteredItems = useMemo(() => {
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
  }, [query, roomFilter, colorFilter, styleFilter]);

  /* ---------- backend-ready params ---------- */
  const searchParams = {
    query: query.trim() || undefined,
    roomType: roomFilter || undefined,
    color: colorFilter || undefined,
    style: styleFilter || undefined,
  };
  // TODO: later: use searchParams to call backend API (e.g. /search)

  const handleSubmit = () => {
    const q = query.trim();
    if (!q) return;
    setHistory((prev) => {
      const next = [q, ...prev.filter((h) => h !== q)];
      return next.slice(0, 6);
    });
    setShowHistory(false);
    // in the future: trigger backend request here
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
            <IconImg source={require('../../../assets/icons/search.png')} />
            <StyledInput
              placeholder="Search"
              placeholderTextColor={COLOR.hint}
              value={query}
              onChangeText={setQuery}
              onFocus={() => setShowHistory(true)}
              onSubmitEditing={handleSubmit}
              returnKeyType="search"
            />
            <IconImg source={require('../../../assets/icons/Microphone.png')} />
          </SearchInner>

          {/* search history dropdown (inline) */}
          {showHistory && history.length > 0 && !hasActiveFilters && (
            <HistoryCard>
              {history.map((term) => (
                <HistoryRow
                  key={term}
                  onPress={() => handleSelectHistory(term)}
                  activeOpacity={0.7}
                >
                  <HistoryText numberOfLines={1}>{term}</HistoryText>
                  <HistoryDeleteButton
                    onPress={(e) => {
                      e.stopPropagation(); // don’t trigger select
                      setHistory((prev) => prev.filter((h) => h !== term));
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
                {filteredItems.length} result{filteredItems.length !== 1 ? 's' : ''}
              </ResultsMeta>
            </ResultsHeader>

            {filteredItems.length === 0 ? (
              <EmptyHint>Try changing filters or search terms.</EmptyHint>
            ) : (
              <ResultsGrid>
                <ResultsColumn>
                  {filteredItems
                    .filter((_, i) => i % 2 === 0)
                    .map((item) => (
                      <CardShadow key={item.id}>
                        <CardClip activeOpacity={0.85}>
                          <ResultImg
                            source={{ uri: item.image }}
                            style={{ height: item.height, width: RESULTS_COL_W }}
                          />
                        </CardClip>
                      </CardShadow>
                    ))}
                </ResultsColumn>
                <ResultsColumn>
                  {filteredItems
                    .filter((_, i) => i % 2 === 1)
                    .map((item) => (
                      <CardShadow key={item.id}>
                        <CardClip activeOpacity={0.85}>
                          <ResultImg
                            source={{ uri: item.image }}
                            style={{ height: item.height, width: RESULTS_COL_W }}
                          />
                        </CardClip>
                      </CardShadow>
                    ))}
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
                <Row gap={12}>
                  {TRENDING_IMAGES.map((item) => (
                    <Flex1 key={item.id}>
                      <CardShadow>
                        <CardClip>
                          <Img style={{ height: 220 }} source={{ uri: item.image }} />
                        </CardClip>
                      </CardShadow>
                    </Flex1>
                  ))}
                </Row>
              </Section>

              <Section>
                <SectionTitle>Trending themes</SectionTitle>
                <SectionSub>Curated moodboards you'll love</SectionSub>
                <Row gap={12}>
                  {TRENDING_THEMES.map((item) => (
                    <Flex1 key={item.id}>
                      <CardShadow>
                        <CardClip>
                          <Img style={{ height: 100 }} source={{ uri: item.image }} />
                        </CardClip>
                      </CardShadow>
                    </Flex1>
                  ))}
                </Row>
              </Section>

              <Section>
                <SectionTitle>Editor&apos;s pick: This month</SectionTitle>
                <SectionSub>A fresh design story every month</SectionSub>
                <Row gap={12}>
                  {TRENDING_THEMES.map((item) => (
                    <Flex1 key={item.id}>
                      <CardShadow>
                        <CardClip>
                          <Img style={{ height: 100 }} source={{ uri: item.image }} />
                        </CardClip>
                      </CardShadow>
                    </Flex1>
                  ))}
                </Row>
              </Section>
            </LeftCol>

            {/* Right column */}
            <RightCol>
              <Section>
                <SectionTitle>Creator spotlight</SectionTitle>
                <SectionSub>Top creators and their inspiring ideas</SectionSub>
                <Wrap gap={10}>
                  {CREATOR_SPOTLIGHT.map((item) => (
                    <Half key={item.id}>
                      <CardShadow>
                        <CardClip>
                          <Img style={{ height: 80 }} source={{ uri: item.image }} />
                        </CardClip>
                      </CardShadow>
                    </Half>
                  ))}
                </Wrap>
              </Section>

              <Section>
                <SectionTitle>Ideas you might like</SectionTitle>
                <Col gap={12}>
                  {IDEAS_YOU_MIGHT_LIKE.map((item) => (
                    <CardShadow key={item.id}>
                      <CardClip>
                        <Img style={{ height: item.height }} source={{ uri: item.image }} />
                      </CardClip>
                    </CardShadow>
                  ))}
                </Col>
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
  gap: ${({ gap }: { gap?: number }) => gap ?? 10}px;
`;

const Col = styled.View<{ gap?: number }>`
  flex-direction: column;
  gap: ${({ gap }: { gap?: number }) => gap ?? 10}px;
`;

const Wrap = styled.View<{ gap?: number }>`
  flex-direction: row;
  flex-wrap: wrap;
  gap: ${({ gap }: { gap?: number }) => gap ?? 8}px;
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

const CardClip = styled.TouchableOpacity.attrs({ activeOpacity: 0.85 })`
  overflow: hidden;
  border-radius: 14px;
  background-color: ${COLOR.cardBg};
`;

const Img = styled.Image`
  width: 100%;
  background-color: #f2f2f2;
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
