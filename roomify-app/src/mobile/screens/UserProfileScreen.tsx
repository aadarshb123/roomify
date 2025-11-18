import React, { useState, useEffect } from 'react';
import styled from 'styled-components/native';
import { ScrollView, ActivityIndicator, Dimensions } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Image as ExpoImage } from 'expo-image';
import { getUser, User, getRooms, Room } from '../../services/api';

const COLOR = {
  bg: '#EDE8DC',
  text: '#111827',
  subtext: '#444',
  cardBg: '#FFFFFF',
  shadow: '#000000',
  chipBg: '#D8D3C4',
  chipSelectedBg: '#111827',
  chipText: '#111827',
  chipTextSelected: '#EDE8DC',
  border: '#111827',
};

const { width } = Dimensions.get('window');
const GUTTER = 12;
const COL_W = (width - 40 - GUTTER) / 2;

interface UserProfileScreenProps {
  route: {
    params: {
      userId: string;
    };
  };
  navigation: any;
}

export default function UserProfileScreen({ route, navigation }: UserProfileScreenProps) {
  const { userId } = route.params;
  const insets = useSafeAreaInsets();
  
  const [user, setUser] = useState<User | null>(null);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState('All History');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userData, roomsData] = await Promise.all([
          getUser(userId),
          getRooms({ limit: 100 }),
        ]);
        
        setUser(userData);
        // Filter rooms by this user
        const userRooms = roomsData.rooms.filter(room => room.userId === userId);
        setRooms(userRooms);
      } catch (error) {
        console.error('Error fetching user profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  const getInitials = (name?: string) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };

  if (loading) {
    return (
      <Screen edges={['top']}>
        <LoadingContainer>
          <ActivityIndicator size="large" color={COLOR.text} />
        </LoadingContainer>
      </Screen>
    );
  }

  if (!user) {
    return (
      <Screen edges={['top']}>
        <TopBar>
          <BackButton onPress={() => navigation.goBack()} activeOpacity={0.7}>
            <BackIcon>←</BackIcon>
          </BackButton>
          <Spacer />
        </TopBar>
        <EmptyContainer>
          <EmptyText>User not found</EmptyText>
        </EmptyContainer>
      </Screen>
    );
  }

  return (
    <Screen edges={['top']}>
      <TopBar>
        <BackButton onPress={() => navigation.goBack()} activeOpacity={0.7}>
          <BackIcon>←</BackIcon>
        </BackButton>
        <Spacer />
      </TopBar>

      <ScrollArea showsVerticalScrollIndicator={false}>
        <Header>
          <Avatar>
            {user.photoURL ? (
              <AvatarImage source={{ uri: user.photoURL }} />
            ) : (
              <AvatarText>{getInitials(user.displayName)}</AvatarText>
            )}
          </Avatar>
          <Name>{user.displayName || 'User'}</Name>
          <Bio>Sharing beautiful room designs</Bio>
        </Header>

        <StatsRow>
          {[
            { label: 'History', value: rooms.length },
            { label: 'Likes', value: 0 },
            { label: 'Saved', value: 0 },
            { label: 'Following', value: 0 },
            { label: 'Posts', value: rooms.length },
          ].map((item) => (
            <Stat key={item.label}>
              <StatNum>{item.value}</StatNum>
              <StatLabel>{item.label}</StatLabel>
            </Stat>
          ))}
        </StatsRow>

        <TabsWrap>
          {['All History', 'Saved History'].map(tab => (
            <Tab key={tab} $active={selectedTab === tab} onPress={() => setSelectedTab(tab)}>
              <TabText $active={selectedTab === tab}>{tab}</TabText>
            </Tab>
          ))}
        </TabsWrap>

        <Grid>
          {rooms.length === 0 ? (
            <EmptyContainer>
              <EmptyText>No rooms yet</EmptyText>
            </EmptyContainer>
          ) : (
            rooms.map((room) => (
              <CardShadow key={room.id}>
                <Card 
                  activeOpacity={0.85}
                  onPress={() => navigation.navigate('RoomDetail', { room })}
                >
                  <CardImg source={{ uri: room.uri }} />
                </Card>
              </CardShadow>
            ))
          )}
        </Grid>

        <BottomSpace />
      </ScrollArea>
    </Screen>
  );
}

const Screen = styled(SafeAreaView)`
  flex: 1;
  background-color: ${COLOR.bg};
`;

const TopBar = styled.View`
  flex-direction: row;
  align-items: center;
  padding: 10px 15px 15px 15px;
  gap: 10px;
`;

const BackButton = styled.TouchableOpacity`
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background-color: #ffffffcc;
  justify-content: center;
  align-items: center;
  shadow-color: #000;
  shadow-opacity: 0.1;
  shadow-radius: 4px;
  shadow-offset: 0px 1px;
  elevation: 2;
`;

const BackIcon = styled.Text`
  font-size: 24px;
  color: ${COLOR.text};
  font-weight: 300;
`;

const Spacer = styled.View`
  flex: 1;
`;

const ScrollArea = styled.ScrollView`
  flex: 1;
`;

const LoadingContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
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
  overflow: hidden;
`;

const AvatarImage = styled.Image`
  width: 100%;
  height: 100%;
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

const CardImg = styled(ExpoImage)`
  width: 100%;
  height: 100%;
  background-color: #f2f2f2;
`;

const EmptyContainer = styled.View`
  padding: 60px 20px;
  align-items: center;
`;

const EmptyText = styled.Text`
  font-size: 16px;
  color: ${COLOR.subtext};
  text-align: center;
`;

const BottomSpace = styled.View`
  height: 100px;
`;
