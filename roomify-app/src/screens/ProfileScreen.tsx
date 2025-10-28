import React, { useState } from 'react';
import styled from 'styled-components/native';
import { Alert, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../context/AuthContext';

const COLOR = {
  bg: '#EDE8DC',        // same creamy background
  text: '#111827',      // deep black text
  subtext: '#444',      // softer neutral gray for secondary text
  accent: '#111827',    // black accent for buttons/icons
  cardBg: '#FFFFFF',
  chipBg: '#D8D3C4',    // muted beige tone
  chipSelectedBg: '#111827', 
  chipText: '#111827',
  chipTextSelected: '#EDE8DC',
  shadow: '#000000',
  border: '#111827',
};

const { width } = Dimensions.get('window');
const GUTTER = 12;
const COL_W = (width - 40 - GUTTER) / 2; // 2 columns, padding sides

const STYLE_PREFERENCES = ['Modern', 'Minimalist', 'Scandinavian', 'Coastal'];
const PREF_COLORS: string[] = [
  '#C8C3B4', // warm beige-gray
  '#D9CAB3', // light sand
  '#B6B8B1', // sage-gray neutral
  '#A59D91', // taupe brown-gray
];

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const [selectedTab, setSelectedTab] = useState('All History');

  const handleLogout = async () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          try {
            await logout();
          } catch (error: any) {
            Alert.alert('Error', error.message);
          }
        },
      },
    ]);
  };

  const getInitials = () => {
    if (user?.displayName) {
      return user.displayName
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase();
    }
    return user?.email?.[0].toUpperCase() || 'U';
  };

  return (
    <Screen edges={['top']}>
      <TopBar>
        <IconButton><IconImg source={require('../../assets/icons/search.png')} /></IconButton>
        <IconButton><IconImg source={require('../../assets/icons/Bell.png')} /></IconButton>
        <IconButton><IconImg source={require('../../assets/icons/add.png')} /></IconButton>
        <Spacer />
        <IconButton><IconImg source={require('../../assets/icons/Gear.png')} /></IconButton>
        <IconButton onPress={handleLogout}><IconImg source={require('../../assets/icons/SignOut.png')} /></IconButton>
      </TopBar>

      <ScrollArea showsVerticalScrollIndicator={false}>
        <Header>
          <Avatar><AvatarText>{getInitials()}</AvatarText></Avatar>
          <Name>{user?.displayName || 'User'}</Name>
          <Bio>Crafting beautiful spaces with modern minimalism</Bio>
        </Header>

        <StatsRow>
          {[
            { label: 'History', value: 3 },
            { label: 'Likes', value: 9 },
            { label: 'Saved', value: 6 },
            { label: 'Following', value: 42 },
            { label: 'Posts', value: 15 },
          ].map((item) => (
            <Stat key={item.label}>
              <StatNum>{item.value}</StatNum>
              <StatLabel>{item.label}</StatLabel>
            </Stat>
          ))}
        </StatsRow>

        {/* Style Preferences with original colors */}
        <PrefSection>
          <PrefTitle>My Style Preferences</PrefTitle>
          <PrefWrap>
            {STYLE_PREFERENCES.map((style, idx) => (
              <PrefChip key={style} $bg={PREF_COLORS[idx % PREF_COLORS.length]}>
                <PrefText>{style}</PrefText>
              </PrefChip>
            ))}
          </PrefWrap>
        </PrefSection>

        <TabsWrap>
          {['All History', 'Saved History', 'Liked History'].map(tab => (
            <Tab key={tab} $active={selectedTab === tab} onPress={() => setSelectedTab(tab)}>
              <TabText $active={selectedTab === tab}>{tab}</TabText>
            </Tab>
          ))}
        </TabsWrap>

        <Grid>
          {[
            { id: 1, image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=300', liked: true },
            { id: 2, image: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=300', liked: false },
            { id: 3, image: 'https://images.unsplash.com/photo-1615873968403-89e068629265?w=300', liked: true },
            { id: 4, image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=300', liked: false },
          ].map((item) => (
            <CardShadow key={item.id}>
              <Card>
                <CardImg source={{ uri: item.image }} />
                {item.liked && (
                  <HeartFab activeOpacity={0.8} onPress={() => { /* TODO: toggle like */ }}>
                    <HeartIcon source={require('../../assets/icons/filledheart-white.png')} />
                  </HeartFab>
                )}
              </Card>
            </CardShadow>
          ))}
        </Grid>

        <BottomSpace />
      </ScrollArea>
    </Screen>
  );
}

/* styled components */
const Screen = styled(SafeAreaView)`
  flex: 1;
  background-color: ${COLOR.bg};
`;

const ScrollArea = styled.ScrollView`
  flex: 1;
`;

const TopBar = styled.View`
  flex-direction: row;
  align-items: center;
  padding: 10px 15px 15px 15px;
  gap: 10px;
`;

const IconButton = styled.TouchableOpacity`
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background-color: #ffffffcc;  /* light translucent white */
  justify-content: center;
  align-items: center;

  shadow-color: #000;
  shadow-opacity: 0.1;
  shadow-radius: 4px;
  shadow-offset: 0px 1px;
  elevation: 2;
`;

const IconImg = styled.Image`
  width: 20px;
  height: 20px;
  resize-mode: contain;
`;

const Spacer = styled.View`
  flex: 1;
`;

const Header = styled.View`
  align-items: center;
  padding-top: 20px;
`;

const Avatar = styled.View`
  width: 100px;
  height: 100px;
  border-radius: 50px;
  background-color: #111827;
  justify-content: center;
  align-items: center;
  margin-bottom: 15px;
`;

const AvatarText = styled.Text`
  color: #EDE8DC;
  font-size: 36px;
  font-weight: 700;
`;

const Name = styled.Text`
  font-size: 22px;
  font-weight: bold;
  margin-bottom: 8px;
  color: ${COLOR.text};
`;

const Bio = styled.Text`
  font-size: 13px;
  color: ${COLOR.subtext};
  text-align: center;
  padding: 0 40px;
`;

const StatsRow = styled.View`
  flex-direction: row;
  justify-content: space-around;
  padding: 20px;
`;

const Stat = styled.View`
  align-items: center;
`;

const StatNum = styled.Text`
  font-size: 20px;
  font-weight: bold;
  color: ${COLOR.text};
`;

const StatLabel = styled.Text`
  font-size: 11px;
  color: ${COLOR.subtext};
  margin-top: 2px;
`;

const PrefSection = styled.View`
  padding: 0 20px 20px 20px;
`;

const PrefTitle = styled.Text`
  font-size: 14px;
  color: ${COLOR.subtext};
  margin-bottom: 12px;
`;

const PrefWrap = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  gap: 8px;
`;

const PrefChip = styled.View<{ $bg: string }>`
  padding: 8px 16px;
  border-radius: 15px;
  background-color: ${({ $bg }) => $bg};
`;

const PrefText = styled.Text`
  font-size: 13px;
  color: #1a1a1a;
  font-weight: 500;
`;

const TabsWrap = styled.View`
  flex-direction: row;
  padding: 0 20px;
  gap: 8px;
  margin-bottom: 15px;
`;

const Tab = styled.TouchableOpacity<{ $active: boolean }>`
  flex: 1;
  padding-vertical: 10px;
  border-radius: 10px;
  background-color: ${({ $active }) =>
    $active ? '#111827' : 'rgba(17,24,39,0.1)'};
  align-items: center;
  border: 1px solid #111827;
`;

const TabText = styled.Text<{ $active: boolean }>`
  font-size: 13px;
  font-weight: 600;
  color: ${({ $active }) => ($active ? '#EDE8DC' : '#111827')};
`;

const Grid = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;     
  column-gap: 10px;            
  row-gap: 10px;
  padding-horizontal: 10px;    
`;

const CardShadow = styled.View`
  border-radius: 15px;
  background-color: ${COLOR.cardBg};

  shadow-color: ${COLOR.shadow};
  shadow-opacity: 0.15;
  shadow-radius: 8px;
  shadow-offset: 0px 3px;
  elevation: 4;
`;

const Card = styled.TouchableOpacity`
  border-radius: 15px;
  overflow: hidden;
  background-color: ${COLOR.cardBg};
  position: relative;
  width: ${COL_W}px;
  aspect-ratio: 1;
`;

const CardImg = styled.Image`
  width: 100%;
  height: 100%;
  background-color: #f2f2f2;
`;

const LikeBadge = styled.View`
  position: absolute;
  top: 10px;
  right: 10px;
  width: 32px;
  height: 32px;
  border-radius: 16px;
  background-color: rgba(255, 255, 255, 0.8);
  justify-content: center;
  align-items: center;

  shadow-color: #000;
  shadow-opacity: 0.2;
  shadow-radius: 3px;
  shadow-offset: 0px 1px;
  elevation: 3;
`;

const HeartFab = styled.TouchableOpacity`
  position: absolute;
  top: 10px;
  right: 10px;
  padding: 6px;             
`;

const HeartIcon = styled.Image`
  width: 22px;
  height: 22px;
  resize-mode: contain;
  opacity: 0.8;            /* tweak 0.5-1.0*/
`;

const BottomSpace = styled.View`
  height: 100px;
`;
