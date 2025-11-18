import React, { useState } from 'react';
import { Alert, ActivityIndicator } from 'react-native';
import styled from 'styled-components/native';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../../config/firebase';
import logoFull from '../../../assets/logo-full.png';

const COLOR = {
  bg: '#EDE8DC',
  text: '#111827',
  cta: '#111827',
  white: '#FFFFFF',
  border: '#111827',
  overlay: 'rgba(230,218,201,0.9)',
};

const BG_URI = 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=1600';

export default function ForgotPasswordScreen({ navigation }: any) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleResetPassword = async () => {
    if (!email) {
      Alert.alert('Error', 'Please enter your email address');
      return;
    }

    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      Alert.alert(
        'Success',
        'Password reset email sent! Please check your inbox.',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Background source={{ uri: BG_URI }} resizeMode="cover">
      <Tint />
      <Container>
        <BackButton onPress={() => navigation.goBack()}>
          <BackText>← Back</BackText>
        </BackButton>

        <LogoFull source={logoFull} resizeMode="contain" />

        <FormGroup>
          <Title>Reset Password</Title>
          <Description>
            Enter your email address and we'll send you a link to reset your password.
          </Description>

          <Field
            placeholder="Email"
            placeholderTextColor="#999"
            autoCapitalize="none"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />

          <CTA onPress={handleResetPassword} disabled={loading}>
            {loading ? (
              <ActivityIndicator color={COLOR.bg} />
            ) : (
              <CTAText>SEND RESET LINK</CTAText>
            )}
          </CTA>
        </FormGroup>
      </Container>
    </Background>
  );
}

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
  justify-content: center;
  padding: 24px;
`;

const BackButton = styled.TouchableOpacity`
  position: absolute;
  top: 50px;
  left: 24px;
  z-index: 10;
`;

const BackText = styled.Text`
  color: ${COLOR.text};
  font-size: 16px;
  font-weight: 600;
`;

const FormGroup = styled.View`
  width: 100%;
  align-items: center;
  gap: 14px;
`;

const LogoFull = styled.Image`
  width: 100%;
  max-width: 400px;
  height: 85px;
  margin-bottom: 30px;
`;

const Title = styled.Text`
  font-size: 28px;
  font-weight: bold;
  color: ${COLOR.text};
  margin-bottom: 10px;
`;

const Description = styled.Text`
  font-size: 14px;
  color: ${COLOR.text};
  text-align: center;
  opacity: 0.8;
  margin-bottom: 20px;
  padding: 0 20px;
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
  margin-top: 10px;
`;

const CTAText = styled.Text`
  color: ${COLOR.bg};
  font-size: 18px;
  font-weight: 500;
`;
