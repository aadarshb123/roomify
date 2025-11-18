import React from 'react';
import styled from 'styled-components/native';
import { Alert, Platform } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../context/AuthContext';

const COLOR = {
  bg: '#EDE8DC',
  text: '#111827',
  subtext: '#666',
  cardBg: '#FFFFFF',
  shadow: '#000000',
  border: '#111827',
  danger: '#EF4444',
};

interface SettingItem {
  id: string;
  title: string;
  subtitle?: string;
  icon?: string;
  onPress: () => void;
  danger?: boolean;
}

export default function SettingsScreen() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    if (Platform.OS === 'web') {
      const confirmed = (globalThis as any).window?.confirm('Are you sure you want to logout?');
      if (!confirmed) {
        return;
      }
      try {
        await logout();
      } catch (error: any) {
        (globalThis as any).window?.alert(error.message || 'Failed to logout. Please try again.');
      }
      return;
    }
    
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              await logout();
            } catch (error: any) {
              Alert.alert('Error', error.message || 'Failed to logout. Please try again.');
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  const settings: SettingItem[] = [
    {
      id: 'account',
      title: 'Account',
      subtitle: 'Manage your account settings',
      onPress: () => {
        // TODO: Navigate to account settings
        Alert.alert('Account', 'Account settings coming soon');
      },
    },
    {
      id: 'notifications',
      title: 'Notifications',
      subtitle: 'Manage notification preferences',
      onPress: () => {
        // TODO: Navigate to notification settings
        Alert.alert('Notifications', 'Notification settings coming soon');
      },
    },
    {
      id: 'privacy',
      title: 'Privacy',
      subtitle: 'Control your privacy settings',
      onPress: () => {
        // TODO: Navigate to privacy settings
        Alert.alert('Privacy', 'Privacy settings coming soon');
      },
    },
    {
      id: 'about',
      title: 'About',
      subtitle: 'App version and information',
      onPress: () => {
        Alert.alert('About', 'Roomify\nVersion 1.0.0\n\nA beautiful room inspiration app');
      },
    },
    {
      id: 'logout',
      title: 'Logout',
      subtitle: 'Sign out of your account',
      onPress: handleLogout,
      danger: true,
    },
  ];

  return (
    <Screen edges={['top']}>
      <Header>
        <BackButton onPress={() => navigation.goBack()} activeOpacity={0.7}>
          <BackIcon>←</BackIcon>
        </BackButton>
        <HeaderTitle>Settings</HeaderTitle>
        <Spacer />
      </Header>

      <Container
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}
      >
        {/* User Info Section */}
        <UserSection>
          <UserInfo>
            <UserName>{user?.displayName || 'User'}</UserName>
            <UserEmail>{user?.email || ''}</UserEmail>
          </UserInfo>
        </UserSection>

        {/* Settings List */}
        <SettingsList>
          {settings.map((setting, index) => (
            <SettingItem
              key={setting.id}
              onPress={setting.onPress}
              activeOpacity={0.7}
              $isLast={index === settings.length - 1}
            >
              <SettingContent>
                <SettingTitle $danger={setting.danger}>{setting.title}</SettingTitle>
                {setting.subtitle && (
                  <SettingSubtitle>{setting.subtitle}</SettingSubtitle>
                )}
              </SettingContent>
              <Chevron>›</Chevron>
            </SettingItem>
          ))}
        </SettingsList>
      </Container>
    </Screen>
  );
}

/* ---------- Styles ---------- */
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

const Container = styled.ScrollView`
  flex: 1;
  background-color: ${COLOR.bg};
`;

const UserSection = styled.View`
  padding: 24px 20px;
  background-color: ${COLOR.cardBg};
  margin: 16px 16px 0 16px;
  border-radius: 12px;
  border: 1px solid rgba(17, 24, 39, 0.1);
`;

const UserInfo = styled.View`
  align-items: center;
`;

const UserName = styled.Text`
  font-size: 20px;
  font-weight: 600;
  color: ${COLOR.text};
  margin-bottom: 4px;
`;

const UserEmail = styled.Text`
  font-size: 14px;
  color: ${COLOR.subtext};
`;

const SettingsList = styled.View`
  margin: 16px;
  background-color: ${COLOR.cardBg};
  border-radius: 12px;
  border: 1px solid rgba(17, 24, 39, 0.1);
  overflow: hidden;
`;

const SettingItem = styled.TouchableOpacity<{ $isLast?: boolean }>`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom-width: ${({ $isLast }) => ($isLast ? 0 : 1)}px;
  border-bottom-color: rgba(17, 24, 39, 0.1);
`;

const SettingContent = styled.View`
  flex: 1;
`;

const SettingTitle = styled.Text<{ $danger?: boolean }>`
  font-size: 16px;
  font-weight: 500;
  color: ${({ $danger }) => ($danger ? COLOR.danger : COLOR.text)};
  margin-bottom: 2px;
`;

const SettingSubtitle = styled.Text`
  font-size: 13px;
  color: ${COLOR.subtext};
  margin-top: 2px;
`;

const Chevron = styled.Text`
  font-size: 20px;
  color: ${COLOR.subtext};
  margin-left: 12px;
`;

