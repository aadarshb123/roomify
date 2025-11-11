import React from 'react';
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
};

const W = Dimensions.get('window').width;

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

export default function SearchScreen() {
  const insets = useSafeAreaInsets();

  return (
    <Screen edges={['top']}>
      <Container
        contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Search Bar */}
        <SearchWrap>
          <SearchInner>
            <IconImg source={require('../../../assets/icons/search.png')} />
            <StyledInput placeholder="Search" placeholderTextColor={COLOR.hint} />
            <IconImg source={require('../../../assets/icons/Microphone.png')} />
          </SearchInner>
        </SearchWrap>

        {/* Content */}
        <ContentRow>
          {/* Left column */}
          <LeftCol>
            <Section>
              <SectionTitle>Trending now</SectionTitle>
              <SectionSub>What everyone's searching for right now</SectionSub>
              <Row gap={12}>
                {TRENDING_IMAGES.map(item => (
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
                {TRENDING_THEMES.map(item => (
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
                {TRENDING_THEMES.map(item => (
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
                {CREATOR_SPOTLIGHT.map(item => (
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
                {IDEAS_YOU_MIGHT_LIKE.map(item => (
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
  padding: 22px 18px 20px;
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

  /* Downward soft shadow */
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

/* Content layout */
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
  margin-bottom: 32px; /* more vertical spacing between sections */
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

/* Card styles */
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