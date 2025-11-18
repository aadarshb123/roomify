import React, { useState, useEffect } from 'react';
import styled from 'styled-components/native';
import { ActivityIndicator, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image as ExpoImage } from 'expo-image';
import { useNavigation } from '@react-navigation/native';
import { User, getFollowingList, getFollowerList } from '../../services/api';

const COLOR = {
  bg: '#EDE8DC',
  text: '#111827',
  subtext: '#444',
  cardBg: '#FFFFFF',
  shadow: '#000000',
  border: '#111827',
};

interface FollowingFollowersScreenProps {
  route: {
    params: {
      type: 'following' | 'followers';
    };
  };
  navigation: any;
}

export default function FollowingFollowersScreen({ route, navigation }: FollowingFollowersScreenProps) {
  const { type } = route.params;
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        setLoading(true);
        const userList = type === 'following' 
          ? await getFollowingList()
          : await getFollowerList();
        setUsers(userList);
      } catch (error) {
        console.error('Error loading users:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, [type]);

  const getInitials = (name?: string) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };

  const handleUserPress = (userId: string) => {
    navigation.navigate('UserProfile', { userId });
  };

  return (
    <Screen>
      <TopBar>
        <BackButton onPress={() => navigation.goBack()} activeOpacity={0.7}>
          <BackIcon>←</BackIcon>
        </BackButton>
        <Title>{type === 'following' ? 'Following' : 'Followers'}</Title>
        <Spacer />
      </TopBar>

      {loading ? (
        <LoadingContainer>
          <ActivityIndicator size="large" color={COLOR.text} />
        </LoadingContainer>
      ) : users.length === 0 ? (
        <EmptyContainer>
          <EmptyText>
            {type === 'following' 
              ? "You're not following anyone yet"
              : "You don't have any followers yet"}
          </EmptyText>
        </EmptyContainer>
      ) : (
        <ScrollArea showsVerticalScrollIndicator={false}>
          {users.map((user) => (
            <UserCard
              key={user.id}
              onPress={() => handleUserPress(user.id)}
              activeOpacity={0.7}
            >
              <Avatar>
                {user.photoURL ? (
                  <AvatarImage source={{ uri: user.photoURL }} />
                ) : (
                  <AvatarText>{getInitials(user.displayName)}</AvatarText>
                )}
              </Avatar>
              <UserInfo>
                <UserName>{user.displayName || 'User'}</UserName>
                {user.bio && <UserBio numberOfLines={1}>{user.bio}</UserBio>}
              </UserInfo>
            </UserCard>
          ))}
          <BottomSpace />
        </ScrollArea>
      )}
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

const Title = styled.Text`
  font-size: 20px;
  font-weight: bold;
  color: ${COLOR.text};
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

const EmptyContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: 40px;
`;

const EmptyText = styled.Text`
  font-size: 16px;
  color: ${COLOR.subtext};
  text-align: center;
`;

const UserCard = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  padding: 15px 20px;
  background-color: ${COLOR.cardBg};
  margin-horizontal: 15px;
  margin-top: 10px;
  border-radius: 12px;
  shadow-color: ${COLOR.shadow};
  shadow-opacity: 0.1;
  shadow-radius: 4px;
  shadow-offset: 0px 2px;
  elevation: 2;
`;

const Avatar = styled.View`
  width: 50px;
  height: 50px;
  border-radius: 25px;
  background-color: #111827;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  margin-right: 12px;
`;

const AvatarImage = styled(ExpoImage)`
  width: 100%;
  height: 100%;
`;

const AvatarText = styled.Text`
  color: #EDE8DC;
  font-size: 20px;
  font-weight: 700;
`;

const UserInfo = styled.View`
  flex: 1;
`;

const UserName = styled.Text`
  font-size: 16px;
  font-weight: 600;
  color: ${COLOR.text};
  margin-bottom: 4px;
`;

const UserBio = styled.Text`
  font-size: 13px;
  color: ${COLOR.subtext};
`;

const BottomSpace = styled.View`
  height: 20px;
`;

