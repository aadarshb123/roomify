import React, { useState, useEffect } from 'react';
import styled from 'styled-components/native';
import { ScrollView, Dimensions, Platform, Alert } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Image as ExpoImage } from 'expo-image';
import { Room, getUser, User, getCommentCount, getLikeCount, hasUserLiked, toggleLike, hasUserSaved, toggleSave, deleteRoom } from '../../services/api';
import { useAuth } from '../context/AuthContext';

const COLOR = {
  bg: '#EDE8DC',
  text: '#111827',
  subtext: '#6B7280',
  cardBg: '#FFFFFF',
  shadow: '#000000',
};

const { width } = Dimensions.get('window');

interface RoomDetailScreenProps {
  route: {
    params: {
      room: Room;
    };
  };
  navigation: any;
}

export default function RoomDetailScreen({ route, navigation }: RoomDetailScreenProps) {
  const { room } = route.params;
  const insets = useSafeAreaInsets();
  const { user: currentUser } = useAuth();
  
  const [user, setUser] = useState<User | null>(null);
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [commentCount, setCommentCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);

  const isOwner = currentUser?.uid === room.userId;

  // Refresh counts when screen comes into focus
  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      const refreshCounts = async () => {
        try {
          const [commentCountData, likeCountData, userLiked, userSaved] = await Promise.all([
            getCommentCount(room.id),
            getLikeCount(room.id),
            hasUserLiked(room.id),
            hasUserSaved(room.id),
          ]);
          setCommentCount(commentCountData);
          setLikeCount(likeCountData);
          setLiked(userLiked);
          setSaved(userSaved);
        } catch (error) {
          console.error('Error refreshing counts:', error);
        }
      };
      refreshCounts();
    });

    return unsubscribe;
  }, [navigation, room.id]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (room.userId) {
          const userData = await getUser(room.userId);
          setUser(userData);
        }
        
        // Fetch actual counts
        const [commentCountData, likeCountData, userLiked, userSaved] = await Promise.all([
          getCommentCount(room.id),
          getLikeCount(room.id),
          hasUserLiked(room.id),
          hasUserSaved(room.id),
        ]);
        
        setCommentCount(commentCountData);
        setLikeCount(likeCountData);
        setLiked(userLiked);
        setSaved(userSaved);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [room.userId, room.id]);

  const handleLike = async () => {
    try {
      const result = await toggleLike(room.id);
      setLiked(result.liked);
      setLikeCount(result.count);
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const handleSave = async () => {
    try {
      const result = await toggleSave(room.id);
      setSaved(result.saved);
    } catch (error) {
      console.error('Error toggling save:', error);
    }
  };

  const handleShare = async () => {
    try {
      const shareUrl = `https://roomify.app/room/${room.id}`;
      const shareText = `Check out this beautiful room: ${room.title}`;
      
      if (Platform.OS === 'web') {
        // Web share API
        if (navigator.share) {
          await navigator.share({
            title: room.title,
            text: shareText,
            url: shareUrl,
          });
        } else {
          // Fallback: copy to clipboard
          await navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
          alert('Link copied to clipboard!');
        }
      } else {
        // React Native Share
        const { Share } = await import('react-native');
        await Share.share({
          message: `${shareText}\n${shareUrl}`,
          title: room.title,
        });
      }
    } catch (error: any) {
      if (error.message !== 'User cancelled') {
        console.error('Error sharing:', error);
      }
    }
  };

  const handleDelete = () => {
    if (Platform.OS === 'web') {
      const confirmed = (globalThis as any).window?.confirm(
        'Are you sure you want to delete this room? This action cannot be undone.'
      );
      if (confirmed) {
        performDelete();
      }
    } else {
      Alert.alert(
        'Delete Room',
        'Are you sure you want to delete this room? This action cannot be undone.',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Delete',
            style: 'destructive',
            onPress: performDelete,
          },
        ]
      );
    }
  };

  const performDelete = async () => {
    try {
      setIsDeleting(true);
      await deleteRoom(room.id);
      // Navigate back after successful deletion
      navigation.goBack();
    } catch (error: any) {
      console.error('Error deleting room:', error);
      if (Platform.OS === 'web') {
        (globalThis as any).window?.alert(error.message || 'Failed to delete room');
      } else {
        Alert.alert('Error', error.message || 'Failed to delete room');
      }
    } finally {
      setIsDeleting(false);
    }
  };


  const getInitials = (name?: string) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Screen edges={['top']}>
      <Header>
        <BackButton onPress={() => navigation.goBack()} activeOpacity={0.7}>
          <BackIcon>←</BackIcon>
        </BackButton>
        <HeaderTitle>Room Details</HeaderTitle>
        <Spacer />
        {isOwner && (
          <DeleteButton 
            onPress={handleDelete} 
            activeOpacity={0.7}
            disabled={isDeleting}
          >
            <DeleteText>Delete</DeleteText>
          </DeleteButton>
        )}
      </Header>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
      >
        <ImageContainer>
          <RoomImage
            source={{ uri: room.uri }}
            contentFit="cover"
            transition={200}
          />
        </ImageContainer>

        <Content>
          {/* User Info */}
          {user && (
            <UserRow 
              onPress={() => navigation.navigate('UserProfile', { userId: user.id })}
              activeOpacity={0.7}
            >
              <UserAvatar>
                {user.photoURL ? (
                  <AvatarImage source={{ uri: user.photoURL }} />
                ) : (
                  <AvatarText>{getInitials(user.displayName)}</AvatarText>
                )}
              </UserAvatar>
              <UserInfo>
                <UserName>{user.displayName || 'User'}</UserName>
              </UserInfo>
            </UserRow>
          )}

          <Title>{room.title}</Title>

          {room.description && (
            <Description>{room.description}</Description>
          )}

          {/* Action Buttons */}
          <ActionRow>
            <ActionButton onPress={handleLike} activeOpacity={0.7}>
              <ActionIcon 
                source={liked ? require('../../../assets/icons/filledheart.png') : require('../../../assets/icons/heart.png')}
                style={{ tintColor: liked ? '#EF4444' : COLOR.text, marginLeft: 4, marginRight: 10 }}
              />
              <ActionText style={{ color: liked ? '#EF4444' : COLOR.text }}>{likeCount}</ActionText>
            </ActionButton>

            <ActionButton 
              onPress={() => navigation.navigate('Comments', { room })} 
              activeOpacity={0.7}
            >
              <ActionIcon source={require('../../../assets/icons/ChatCircleDots.png')} style={{ marginRight: 6 }} />
              <ActionText>{commentCount}</ActionText>
            </ActionButton>

            <ActionButton onPress={handleShare} activeOpacity={0.7}>
              <ActionIcon source={require('../../../assets/icons/Export.png')} style={{ marginRight: 6 }} />
              <ActionText>Share</ActionText>
            </ActionButton>

            <Spacer />

            <ActionButton onPress={handleSave} activeOpacity={0.7}>
              <ActionText style={{ color: saved ? '#10B981' : COLOR.text }}>{saved ? 'Saved' : 'Save'}</ActionText>
            </ActionButton>
          </ActionRow>

          <DetailsGrid>
            {room.roomType && (
              <DetailItem>
                <DetailLabel>Room Type</DetailLabel>
                <DetailValue>{room.roomType}</DetailValue>
              </DetailItem>
            )}

            {room.style && (
              <DetailItem>
                <DetailLabel>Style</DetailLabel>
                <DetailValue>{room.style}</DetailValue>
              </DetailItem>
            )}

            {room.color && (
              <DetailItem>
                <DetailLabel>Color</DetailLabel>
                <DetailValue>{room.color}</DetailValue>
              </DetailItem>
            )}
          </DetailsGrid>
        </Content>
      </ScrollView>
    </Screen>
  );
}

const Screen = styled(SafeAreaView)`
  flex: 1;
  background-color: ${COLOR.bg};
`;

const Header = styled.View`
  flex-direction: row;
  align-items: center;
  padding: 12px 16px;
  background-color: ${COLOR.bg};
  border-bottom-width: 0.5px;
  border-bottom-color: rgba(17, 24, 39, 0.1);
`;

const BackButton = styled.TouchableOpacity`
  width: 40px;
  height: 40px;
  justify-content: center;
  align-items: center;
`;

const BackIcon = styled.Text`
  font-size: 24px;
  color: ${COLOR.text};
  font-weight: 300;
`;

const HeaderTitle = styled.Text`
  font-size: 18px;
  font-weight: 600;
  color: ${COLOR.text};
  margin-left: 12px;
`;

const Spacer = styled.View`
  flex: 1;
`;

const ImageContainer = styled.View`
  width: 100%;
  height: ${width * 0.75}px;
  background-color: #f2f2f2;
`;

const RoomImage = styled(ExpoImage)`
  width: 100%;
  height: 100%;
`;

const Content = styled.View`
  padding: 24px 20px;
`;

const Title = styled.Text`
  font-size: 18px;
  font-weight: 500;
  color: ${COLOR.text};
  margin-bottom: 8px;
  line-height: 24px;
  letter-spacing: -0.2px;
`;

const Description = styled.Text`
  font-size: 16px;
  line-height: 24px;
  color: ${COLOR.subtext};
  margin-bottom: 24px;
`;

const DetailsGrid = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  gap: 16px;
`;

const DetailItem = styled.View`
  flex: 1;
  min-width: 120px;
  padding: 16px;
  background-color: ${COLOR.cardBg};
  border-radius: 12px;
  border: 1px solid rgba(17, 24, 39, 0.1);
`;

const DetailLabel = styled.Text`
  font-size: 12px;
  color: ${COLOR.subtext};
  margin-bottom: 4px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const DetailValue = styled.Text`
  font-size: 16px;
  font-weight: 600;
  color: ${COLOR.text};
`;

const UserRow = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  margin-bottom: 20px;
  padding: 16px;
  background-color: ${COLOR.cardBg};
  border-radius: 12px;
  border: 1px solid rgba(17, 24, 39, 0.1);
`;

const UserAvatar = styled.View`
  width: 50px;
  height: 50px;
  border-radius: 25px;
  background-color: ${COLOR.text};
  justify-content: center;
  align-items: center;
  margin-right: 12px;
  overflow: hidden;
`;

const AvatarImage = styled.Image`
  width: 100%;
  height: 100%;
`;

const AvatarText = styled.Text`
  color: ${COLOR.bg};
  font-size: 18px;
  font-weight: 600;
`;

const UserInfo = styled.View`
  flex: 1;
`;

const UserName = styled.Text`
  font-size: 16px;
  font-weight: 600;
  color: ${COLOR.text};
  margin-bottom: 2px;
`;

const ActionRow = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 24px;
  padding: 12px 0;
  padding-left: 4px;
  border-top-width: 1px;
  border-bottom-width: 1px;
  border-color: rgba(17, 24, 39, 0.1);
`;

const ActionButton = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  margin-right: 20px;
  padding: 4px 0;
`;

const ActionIcon = styled.Image`
  width: 24px;
  height: 24px;
  resize-mode: contain;
`;

const ActionText = styled.Text`
  font-size: 14px;
  font-weight: 500;
  color: ${COLOR.text};
`;

const DeleteButton = styled.TouchableOpacity<{ disabled?: boolean }>`
  padding: 8px 12px;
  justify-content: center;
  align-items: center;
  opacity: ${({ disabled }) => (disabled ? 0.5 : 1)};
`;

const DeleteText = styled.Text`
  font-size: 14px;
  font-weight: 500;
  color: #EF4444;
`;

