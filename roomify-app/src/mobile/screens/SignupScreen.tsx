import React, { useState } from 'react';
import { Alert, ActivityIndicator } from 'react-native';
import styled from 'styled-components/native';
import { useAuth } from '../../context/AuthContext';
import logoFull from '../../../assets/logo-full.png';
import googleG from '../../../assets/web_light_rd_na.svg';

const COLOR = {
  bg: '#EDE8DC',
  text: '#111827',
  cta: '#111827',
  white: '#FFFFFF',
  border: '#111827',
  overlay: 'rgba(230,218,201,0.9)',
  hint: '#9CA3AF',
};

const BG_URI = 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=1600';

export default function SignupScreen({ navigation }: any) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { signUp, signInWithGoogle, loading } = useAuth();

  const handleSignup = async () => {
    if (!name || !email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      Alert.alert('Error', 'Enter a valid email');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }
    try {
      await signUp(email, password, name);

      // If your app does NOT auto-switch stacks based on `user`, navigate now:
      // Change 'Root' to your main navigator name (e.g., 'HomeTabs', 'AppTabs', etc.)
      navigation.reset({ index: 0, routes: [{ name: 'Root' }] });
    } catch (error: any) {
      Alert.alert('Signup Failed', error.message);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      navigation.reset({ index: 0, routes: [{ name: 'Root' }] });
    } catch (error: any) {
      Alert.alert('Google Sign In Failed', error.message);
    }
  };

  return (
    <Background source={{ uri: BG_URI }} resizeMode="cover">
      <Tint />
      <Container>
        <LogoFull source={logoFull} resizeMode="contain" />

        <FormGroup>
          <Field
            placeholder="Name"
            placeholderTextColor={COLOR.hint}
            autoCapitalize="words"
            value={name}
            onChangeText={setName}
          />
          <Field
            placeholder="Email"
            placeholderTextColor={COLOR.hint}
            autoCapitalize="none"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />
          <Field
            placeholder="Password"
            placeholderTextColor={COLOR.hint}
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          <CTA onPress={handleSignup} disabled={loading}>
            {loading ? <ActivityIndicator color={COLOR.bg} /> : <CTAText>REGISTER</CTAText>}
          </CTA>

          <OrRow>
            <Line />
            <OrText>OR</OrText>
            <Line />
          </OrRow>

          <SocialRow>
            <Circle onPress={handleGoogleSignIn} activeOpacity={0.8}>
              <Icon source={googleG} resizeMode="cover" />
            </Circle>
          </SocialRow>

          <BottomLinks>
            <Muted>ALREADY HAVE AN ACCOUNT?</Muted>
            <UnderlineButton onPress={() => navigation.navigate('Login')}>
              <Underline>LOG IN</Underline>
            </UnderlineButton>
          </BottomLinks>
        </FormGroup>
      </Container>
    </Background>
  );
}

/* ---------- styled-components ---------- */

const Background = styled.ImageBackground`
  flex: 1;
  width: 100%;
  height: 100%;
  background-color: ${COLOR.bg};
`;

const Tint = styled.View`
  position: absolute;
  left: 0; right: 0; top: 0; bottom: 0;
  background-color: ${COLOR.overlay};
`;

const Container = styled.View`
  flex: 1;
  align-items: center;
  justify-content: flex-end;
  padding: 24px;
  gap: 14px;
`;

const FormGroup = styled.View`
  width: 100%;
  align-items: center;
  gap: 14px;
  transform: translateY(-20px);
`;

const LogoFull = styled.Image`
  width: 100%;
  max-width: 400px;
  height: 85px;
  margin-bottom: 50px;
`;

const Field = styled.TextInput`
  width: 100%;
  max-width: 400px;
  height: 54px;
  border-radius: 28px;
  padding: 0 22px;
  font-size: 16px;
  color: ${COLOR.text};
  background-color: rgba(255, 255, 255, 0.9);
  border: 1px solid ${COLOR.border};
`;

const CTA = styled.TouchableOpacity`
  width: 100%;
  max-width: 400px;
  height: 56px;
  background-color: ${COLOR.cta};
  border-radius: 28px;
  justify-content: center;
  align-items: center;
  border: 1.5px solid ${COLOR.border};
`;

const CTAText = styled.Text`
  color: ${COLOR.bg};
  font-size: 18px;
  font-weight: 500;
`;

const OrRow = styled.View`
  width: 100%;
  max-width: 400px;
  flex-direction: row;
  align-items: center;
`;

const Line = styled.View`
  flex: 1;
  height: 1px;
  background-color: ${COLOR.text};
  opacity: 0.4;
`;

const OrText = styled.Text`
  color: ${COLOR.text};
  margin: 0 12px;
`;

const SocialRow = styled.View`
  width: 100%;
  max-width: 400px;
  flex-direction: row;
  justify-content: center;
`;

const Circle = styled.TouchableOpacity`
  width: 60px;
  height: 60px;
  border-radius: 30px;
  background-color: ${COLOR.white};
  justify-content: center;
  align-items: center;
  margin: 4px;
  overflow: hidden;
`;

const Icon = styled.Image`
  width: 100%;
  height: 100%;
  resize-mode: cover;
`;

const BottomLinks = styled.View`
  align-items: center;
  margin-bottom: 12px;
`;

const Muted = styled.Text`
  color: ${COLOR.text};
  opacity: 0.85;
  font-size: 14px;
`;

const UnderlineButton = styled.TouchableOpacity``;

const Underline = styled.Text`
  color: ${COLOR.text};
  text-decoration: underline;
  font-size: 14px;
  font-weight: 700;
`;