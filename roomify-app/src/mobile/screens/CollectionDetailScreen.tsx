import React, { useState, useEffect } from 'react';
import styled from 'styled-components/native';
import { Dimensions, ActivityIndicator, TouchableOpacity } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Image as ExpoImage } from 'expo-image';
import { Room, getCollectionRooms, Collection } from '../../services/api';

const COLOR = {
  bg: '#EDE8DC',
  text: '#111827',
  subtext: '#666',
  cardBg: '#FFFFFF',
  shadow: '#000000',
};

const { width } = Dimensions.get('window');
const H_PADDING = 16;
const GUTTER = 14;
const MAX_CONTENT = 860;
const COL_W = (Math.min(width, MAX_CONTENT) - H_PADDING * 2 - GUTTER) / 2;

interface CollectionDetailScreenProps {
  route: {
    params: {
      collection: Collection;
    };
  };
  navigation: any;
}

export default function CollectionDetailScreen({ route, navigation }: CollectionDetailScreenProps) {
  const { collection } = route.params;
  const insets = useSafeAreaInsets();
  
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadRooms = async () => {
      try {
        setLoading(true);
        const collectionRooms = await getCollectionRooms(collection.id);
        setRooms(collectionRooms);
      } catch (error) {
        console.error('Error loading collection rooms:', error);
      } finally {
        setLoading(false);
      }
    };

    loadRooms();
  }, [collection.id]);

  // Refresh when screen comes into focus
  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      const loadRooms = async () => {
        try {
          const collectionRooms = await getCollectionRooms(collection.id);
          setRooms(collectionRooms);
        } catch (error) {
          console.error('Error loading collection rooms:', error);
        }
      };
      loadRooms();
    });

    return unsubscribe;
  }, [navigation, collection.id]);

  const leftRooms = rooms.filter((_, i) => i % 2 === 0);
  const rightRooms = rooms.filter((_, i) => i % 2 === 1);

  return (
    <Screen edges={['top']}>
      <Container
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}
      >
        {/* Header with back button */}
        <Header>
          <BackButton onPress={() => navigation.goBack()} activeOpacity={0.7}>
            <BackIcon>←</BackIcon>
          </BackButton>
          <HeaderContent>
            <Title>{collection.name}</Title>
            <Subtitle>{rooms.length} {rooms.length === 1 ? 'room' : 'rooms'}</Subtitle>
          </HeaderContent>
        </Header>

        {/* Rooms grid */}
        {loading ? (
          <LoadingContainer>
            <ActivityIndicator size="large" color={COLOR.text} />
          </LoadingContainer>
        ) : rooms.length === 0 ? (
          <EmptyContainer>
            <EmptyText>No rooms in this collection</EmptyText>
            <EmptySubtext>Add rooms to see them here</EmptySubtext>
          </EmptyContainer>
        ) : (
          <Grid>
            <Column>
              {leftRooms.map((room, index) => {
                // Calculate height for staggered layout
                const height = index % 3 === 0 ? 240 : index % 3 === 1 ? 200 : 300;
                return (
                  <CardShadow key={room.id}>
                    <Card 
                      activeOpacity={0.85}
                      onPress={() => navigation.navigate('RoomDetail' as never, { room } as never)}
                    >
                      <CardImg
                        source={{ uri: room.uri }}
                        style={{ width: COL_W, height, borderRadius: 14 }}
                        contentFit="cover"
                        transition={120}
                      />
                    </Card>
                  </CardShadow>
                );
              })}
            </Column>
            <Column>
              {rightRooms.map((room, index) => {
                // Calculate height for staggered layout
                const height = index % 3 === 0 ? 200 : index % 3 === 1 ? 300 : 240;
                return (
                  <CardShadow key={room.id}>
                    <Card 
                      activeOpacity={0.85}
                      onPress={() => navigation.navigate('RoomDetail' as never, { room } as never)}
                    >
                      <CardImg
                        source={{ uri: room.uri }}
                        style={{ width: COL_W, height, borderRadius: 14 }}
                        contentFit="cover"
                        transition={120}
                      />
                    </Card>
                  </CardShadow>
                );
              })}
            </Column>
          </Grid>
        )}
      </Container>
    </Screen>
  );
}

/* ---------- Styles ---------- */
const Screen = styled(SafeAreaView)`
  flex: 1;
  background-color: ${COLOR.bg};
`;

const Container = styled.ScrollView`
  flex: 1;
  background-color: ${COLOR.bg};
`;

const Header = styled.View`
  flex-direction: row;
  align-items: center;
  padding: 16px ${H_PADDING}px;
  background-color: ${COLOR.bg};
`;

const BackButton = styled.TouchableOpacity`
  width: 40px;
  height: 40px;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
`;

const BackIcon = styled.Text`
  font-size: 24px;
  color: ${COLOR.text};
  font-weight: 600;
`;

const HeaderContent = styled.View`
  flex: 1;
`;

const Title = styled.Text`
  font-size: 24px;
  font-weight: 800;
  color: ${COLOR.text};
`;

const Subtitle = styled.Text`
  margin-top: 4px;
  font-size: 13px;
  color: ${COLOR.subtext};
`;

const LoadingContainer = styled.View`
  padding: 60px 20px;
  align-items: center;
  justify-content: center;
`;

const EmptyContainer = styled.View`
  padding: 60px 20px;
  align-items: center;
  justify-content: center;
`;

const EmptyText = styled.Text`
  font-size: 18px;
  font-weight: 700;
  color: ${COLOR.text};
  margin-bottom: 6px;
`;

const EmptySubtext = styled.Text`
  font-size: 13px;
  color: ${COLOR.subtext};
  text-align: center;
`;

const Grid = styled.View`
  width: 100%;
  max-width: ${MAX_CONTENT}px;
  align-self: center;
  padding: 0 ${H_PADDING}px;
  flex-direction: row;
  gap: ${GUTTER}px;
`;

const Column = styled.View`
  flex: 1;
  gap: ${GUTTER}px;
`;

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
  overflow: hidden;
  border-radius: 14px;
  background-color: ${COLOR.cardBg};
`;

const CardImg = styled(ExpoImage)`
  width: 100%;
  background-color: #f2f2f2;
`;

