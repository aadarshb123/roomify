import React, { useState, useEffect } from 'react';
import styled from 'styled-components/native';
import { ScrollView, TextInput, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Room, getUser, User, getComments, createComment, Comment } from '../../services/api';
import { auth } from '../../config/firebase';

const COLOR = {
  bg: '#EDE8DC',
  text: '#111827',
  subtext: '#6B7280',
  cardBg: '#FFFFFF',
  shadow: '#000000',
  border: '#E5E7EB',
};


interface CommentsScreenProps {
  route: {
    params: {
      room: Room;
    };
  };
  navigation: any;
}

export default function CommentsScreen({ route, navigation }: CommentsScreenProps) {
  const { room } = route.params;
  const insets = useSafeAreaInsets();
  
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('🔄 CommentsScreen: Fetching data for room:', room.id);
        const user = auth.currentUser;
        if (user) {
          const userData = await getUser(user.uid);
          setCurrentUser(userData);
        }

        const commentsData = await getComments(room.id);
        console.log('✅ CommentsScreen: Received', commentsData.length, 'comments');
        setComments(commentsData);
      } catch (error: any) {
        console.error('❌ Error fetching comments:', error);
        console.error('Error details:', error.message);
        // Show error to user
        if (error.message?.includes('index')) {
          console.error('⚠️ Firestore index missing! Create index for: comments/roomId/createdAt');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [room.id]);

  const handleAddComment = async () => {
    if (!newComment.trim() || !currentUser || submitting) return;

    try {
      setSubmitting(true);
      const comment = await createComment({
        roomId: room.id,
        text: newComment.trim(),
      });

      setComments([comment, ...comments]);
      setNewComment('');
    } catch (error) {
      console.error('Error adding comment:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const formatTime = (date: Date | any) => {
    if (!date) return 'Just now';
    
    let dateObj: Date;
    
    // Handle Firestore Timestamp
    if (date && typeof date.toDate === 'function') {
      dateObj = date.toDate();
    } else if (date && date.seconds) {
      // Handle Firestore Timestamp object with seconds property
      dateObj = new Date(date.seconds * 1000);
    } else if (date instanceof Date) {
      dateObj = date;
    } else if (typeof date === 'string' || typeof date === 'number') {
      dateObj = new Date(date);
    } else {
      return 'Just now';
    }
    
    // Check if date is valid
    if (isNaN(dateObj.getTime())) {
      return 'Just now';
    }
    
    const now = new Date();
    const diff = now.getTime() - dateObj.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return dateObj.toLocaleDateString();
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (loading) {
    return (
      <Screen edges={['top']}>
        <Header>
          <BackButton onPress={() => navigation.goBack()} activeOpacity={0.7}>
            <BackIcon>←</BackIcon>
          </BackButton>
          <HeaderTitle>Comments</HeaderTitle>
          <Spacer />
        </Header>
        <LoadingContainer>
          <ActivityIndicator size="large" color={COLOR.text} />
        </LoadingContainer>
      </Screen>
    );
  }

  return (
    <Screen edges={['top']}>
      <Header>
        <BackButton onPress={() => navigation.goBack()} activeOpacity={0.7}>
          <BackIcon>←</BackIcon>
        </BackButton>
        <HeaderTitle>Comments</HeaderTitle>
        <Spacer />
      </Header>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <CommentsList
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: insets.bottom + 80 }}
        >
          {comments.length === 0 ? (
            <EmptyContainer>
              <EmptyText>No comments yet</EmptyText>
              <EmptySubtext>Be the first to comment!</EmptySubtext>
            </EmptyContainer>
          ) : (
            comments.map((comment) => (
              <CommentCard key={comment.id}>
                <CommentAvatar>
                  {comment.userAvatar ? (
                    <AvatarImage source={{ uri: comment.userAvatar }} />
                  ) : (
                    <AvatarText>{getInitials(comment.userName)}</AvatarText>
                  )}
                </CommentAvatar>
                <CommentContent>
                  <CommentHeader>
                    <CommentName>{comment.userName}</CommentName>
                    <CommentTime>{formatTime(comment.createdAt)}</CommentTime>
                  </CommentHeader>
                  <CommentText>{comment.text}</CommentText>
                </CommentContent>
              </CommentCard>
            ))
          )}
        </CommentsList>

        <InputContainer>
          <InputWrapper>
            {currentUser && (
              <InputAvatar>
                {currentUser.photoURL ? (
                  <AvatarImage source={{ uri: currentUser.photoURL }} />
                ) : (
                  <AvatarText>{getInitials(currentUser.displayName || 'U')}</AvatarText>
                )}
              </InputAvatar>
            )}
            <CommentInput
              placeholder="Add a comment..."
              placeholderTextColor={COLOR.subtext}
              value={newComment}
              onChangeText={setNewComment}
              multiline
              maxLength={500}
              editable={!submitting}
            />
            <SendButton 
              onPress={handleAddComment} 
              disabled={!newComment.trim() || submitting} 
              activeOpacity={0.7}
            >
              {submitting ? (
                <ActivityIndicator size="small" color={COLOR.bg} />
              ) : (
                <SendText $disabled={!newComment.trim()}>Post</SendText>
              )}
            </SendButton>
          </InputWrapper>
        </InputContainer>
      </KeyboardAvoidingView>
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

const LoadingContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const CommentsList = styled.ScrollView`
  flex: 1;
  padding: 16px;
`;

const CommentCard = styled.View`
  flex-direction: row;
  margin-bottom: 20px;
`;

const CommentAvatar = styled.View`
  width: 40px;
  height: 40px;
  border-radius: 20px;
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
  font-size: 14px;
  font-weight: 600;
`;

const CommentContent = styled.View`
  flex: 1;
`;

const CommentHeader = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 4px;
`;

const CommentName = styled.Text`
  font-size: 14px;
  font-weight: 600;
  color: ${COLOR.text};
  margin-right: 8px;
`;

const CommentTime = styled.Text`
  font-size: 12px;
  color: ${COLOR.subtext};
`;

const CommentText = styled.Text`
  font-size: 14px;
  line-height: 20px;
  color: ${COLOR.text};
`;

const EmptyContainer = styled.View`
  padding: 60px 20px;
  align-items: center;
`;

const EmptyText = styled.Text`
  font-size: 18px;
  font-weight: 600;
  color: ${COLOR.text};
  margin-bottom: 8px;
`;

const EmptySubtext = styled.Text`
  font-size: 14px;
  color: ${COLOR.subtext};
`;

const InputContainer = styled.View`
  padding: 12px 16px;
  background-color: ${COLOR.bg};
  border-top-width: 1px;
  border-top-color: rgba(17, 24, 39, 0.1);
`;

const InputWrapper = styled.View`
  flex-direction: row;
  align-items: flex-end;
  background-color: ${COLOR.cardBg};
  border-radius: 24px;
  padding: 8px 12px;
  border: 1px solid ${COLOR.border};
`;

const InputAvatar = styled.View`
  width: 32px;
  height: 32px;
  border-radius: 16px;
  background-color: ${COLOR.text};
  justify-content: center;
  align-items: center;
  margin-right: 8px;
  overflow: hidden;
`;

const CommentInput = styled.TextInput`
  flex: 1;
  font-size: 14px;
  color: ${COLOR.text};
  max-height: 100px;
  padding: 4px 0;
`;

const SendButton = styled.TouchableOpacity<{ disabled: boolean }>`
  padding: 8px 16px;
  border-radius: 16px;
  background-color: ${({ disabled }) => (disabled ? COLOR.border : COLOR.text)};
  opacity: ${({ disabled }) => (disabled ? 0.5 : 1)};
`;

const SendText = styled.Text<{ $disabled: boolean }>`
  font-size: 14px;
  font-weight: 600;
  color: ${({ $disabled }) => ($disabled ? COLOR.subtext : COLOR.bg)};
`;
