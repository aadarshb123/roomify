import React, { useState, useEffect } from 'react';
import styled from 'styled-components/native';
import { Alert, Dimensions, Platform, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import { Room, getUserCreatedRooms, getUserLikedRooms, getFollowingCount, getFollowerCount, getUser } from '../services/api';

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
  const navigation = useNavigation();
  const [selectedTab, setSelectedTab] = useState('Created');
  const [createdRooms, setCreatedRooms] = useState<Room[]>([]);
  const [likedRooms, setLikedRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [followingCount, setFollowingCount] = useState(0);
  const [followerCount, setFollowerCount] = useState(0);
  const [userBio, setUserBio] = useState<string>('');
  const [stylePreferences, setStylePreferences] = useState<string[]>([]);

  // Fetch rooms based on selected tab
  useEffect(() => {
    const loadRooms = async () => {
      if (!user) {
        setCreatedRooms([]);
        setLikedRooms([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const [created, liked, following, followers, userData] = await Promise.all([
          getUserCreatedRooms(),
          getUserLikedRooms(),
          getFollowingCount(),
          getFollowerCount(),
          getUser(user.uid),
        ]);
        console.log('📊 ProfileScreen - Loaded data:', {
          created: created.length,
          liked: liked.length,
          following,
          followers,
        });
        setCreatedRooms(created);
        setLikedRooms(liked);
        setFollowingCount(following);
        setFollowerCount(followers);
        setUserBio(userData?.bio || 'Crafting beautiful spaces with modern minimalism');
        setStylePreferences(userData?.stylePreferences || STYLE_PREFERENCES);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadRooms();
  }, [user]);

  // Refresh when screen comes into focus
  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      const loadRooms = async () => {
        if (!user) {
          setCreatedRooms([]);
          setLikedRooms([]);
          return;
        }

        try {
          const [created, liked, following, followers, userData] = await Promise.all([
            getUserCreatedRooms(),
            getUserLikedRooms(),
            getFollowingCount(),
            getFollowerCount(),
            getUser(user.uid),
          ]);
          console.log('📊 ProfileScreen - Refreshed data:', {
            created: created.length,
            liked: liked.length,
            following,
            followers,
          });
          setCreatedRooms(created);
          setLikedRooms(liked);
          setFollowingCount(following);
          setFollowerCount(followers);
          setUserBio(userData?.bio || 'Crafting beautiful spaces with modern minimalism');
          setStylePreferences(userData?.stylePreferences || STYLE_PREFERENCES);
        } catch (error) {
          console.error('Error loading data:', error);
        }
      };
      loadRooms();
    });

    return unsubscribe;
  }, [navigation, user]);

  const handleLogout = async () => {
    console.log('🔴 Logout button clicked!');
    console.log('Platform:', Platform.OS);
    
    // On web, Alert might not work well, so we'll use confirm
    if (Platform.OS === 'web') {
      const confirmed = (globalThis as any).window?.confirm('Are you sure you want to logout?');
      if (!confirmed) {
        console.log('❌ Logout cancelled');
        return;
      }
      console.log('✅ Logout confirmed (web), calling logout()...');
      try {
        await logout();
        console.log('✅ Logout function completed successfully');
      } catch (error: any) {
        console.error('❌ Logout failed with error:', error);
        (globalThis as any).window?.alert(error.message || 'Failed to logout. Please try again.');
      }
      return;
    }
    
    // For mobile, use Alert
    Alert.alert(
      'Logout', 
      'Are you sure you want to logout?', 
      [
        { 
          text: 'Cancel', 
          style: 'cancel',
          onPress: () => console.log('❌ Logout cancelled')
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            console.log('✅ Logout confirmed, calling logout()...');
            try {
              console.log('📞 Calling logout function...');
              await logout();
              console.log('✅ Logout function completed successfully');
              // Navigation will happen automatically via RootNavigator
              // when user state becomes null
            } catch (error: any) {
              console.error('❌ Logout failed with error:', error);
              console.error('Error details:', JSON.stringify(error, null, 2));
              Alert.alert('Error', error.message || 'Failed to logout. Please try again.');
            }
          },
        },
      ],
      { cancelable: true }
    );
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
        <Spacer />
        <IconButton 
          onPress={() => navigation.navigate('Settings' as never)}
          activeOpacity={0.7}
        >
          <IconImg source={require('../../assets/icons/Gear.png')} />
        </IconButton>
        <IconButton 
          onPress={handleLogout}
          activeOpacity={0.7}
          testID="logout-button"
        >
          <IconImg source={require('../../assets/icons/SignOut.png')} />
        </IconButton>
      </TopBar>

      <ScrollArea showsVerticalScrollIndicator={false}>
        <Header>
          <Avatar><AvatarText>{getInitials()}</AvatarText></Avatar>
          <Name>{user?.displayName || 'User'}</Name>
          <Bio>{userBio || 'Crafting beautiful spaces with modern minimalism'}</Bio>
        </Header>

        <StatsRow>
          {[
            { label: 'Following', value: followingCount, type: 'following' as const },
            { label: 'Follower', value: followerCount, type: 'followers' as const },
            { label: 'Created', value: createdRooms.length },
            { label: 'Liked', value: likedRooms.length },
          ].map((item) => (
            <Stat 
              key={item.label}
              onPress={item.type ? () => navigation.navigate('FollowingFollowers', { type: item.type }) : undefined}
              disabled={!item.type}
              activeOpacity={item.type ? 0.7 : 1}
            >
              <StatNum>{item.value}</StatNum>
              <StatLabel>{item.label}</StatLabel>
            </Stat>
          ))}
        </StatsRow>

        {/* Style Preferences with original colors */}
        {stylePreferences.length > 0 && (
          <PrefSection>
            <PrefTitle>My Style Preferences</PrefTitle>
            <PrefWrap>
              {stylePreferences.map((style, idx) => {
                const styleIndex = STYLE_PREFERENCES.indexOf(style as any);
                const bgColor = styleIndex >= 0 
                  ? PREF_COLORS[styleIndex % PREF_COLORS.length]
                  : PREF_COLORS[idx % PREF_COLORS.length];
                return (
                  <PrefChip key={style} $bg={bgColor}>
                    <PrefText>{style}</PrefText>
                  </PrefChip>
                );
              })}
            </PrefWrap>
          </PrefSection>
        )}

        <TabsWrap>
          {['Created', 'Liked'].map(tab => (
            <Tab key={tab} $active={selectedTab === tab} onPress={() => setSelectedTab(tab)}>
              <TabText $active={selectedTab === tab}>{tab}</TabText>
            </Tab>
          ))}
        </TabsWrap>

        {loading ? (
          <LoadingContainer>
            <ActivityIndicator size="large" color={COLOR.text} />
          </LoadingContainer>
        ) : (
          <Grid>
            {(selectedTab === 'Created' ? createdRooms : likedRooms).map((room) => (
              <CardShadow key={room.id}>
                <Card 
                  activeOpacity={0.85}
                  onPress={() => navigation.navigate('RoomDetail' as never, { room } as never)}
                >
                  <CardImg source={{ uri: room.uri }} />
                  {selectedTab === 'Liked' && (
                    <HeartFab 
                      activeOpacity={0.8} 
                      onPress={(e) => {
                        e.stopPropagation();
                        // TODO: toggle like
                      }}
                    >
                      <HeartIcon source={require('../../assets/icons/filledheart-white.png')} />
                    </HeartFab>
                  )}
                </Card>
              </CardShadow>
            ))}
          </Grid>
        )}

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
  
  /* Ensure button is clickable */
  z-index: 10;
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

const Stat = styled.TouchableOpacity`
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
  background-color: ${({ $bg }: { $bg: string }) => $bg};
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
  background-color: ${({ $active }: { $active: boolean }) =>
    $active ? '#111827' : 'rgba(17,24,39,0.1)'};
  align-items: center;
  border: 1px solid #111827;
`;

const TabText = styled.Text<{ $active: boolean }>`
  font-size: 13px;
  font-weight: 600;
  color: ${({ $active }: { $active: boolean }) => ($active ? '#EDE8DC' : '#111827')};
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

const LoadingContainer = styled.View`
  padding: 60px 20px;
  align-items: center;
  justify-content: center;
`;
