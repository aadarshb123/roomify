import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ImageBackground, Alert, ActivityIndicator } from 'react-native';
import { useAuth } from '../context/AuthContext';

export default function SignupScreen({ navigation }: any) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signUp, signInWithGoogle } = useAuth();

  const handleSignup = async () => {
    if (!name || !email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      await signUp(email, password, name);
    } catch (error: any) {
      Alert.alert('Signup Failed', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      await signInWithGoogle();
    } catch (error: any) {
      Alert.alert('Google Sign In Failed', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ImageBackground
      source={{ uri: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800' }}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.logo}>🏠</Text>
            <Text style={styles.brandName}>Roomify</Text>
            <Text style={styles.title}>Register</Text>
            <Text style={styles.subtitle}>Create your account to get started.</Text>
          </View>

          <View style={styles.formContainer}>
            <TextInput
              style={styles.input}
              placeholder="Name"
              placeholderTextColor="#999"
              autoCapitalize="words"
              value={name}
              onChangeText={setName}
            />

            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="#999"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />

            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#999"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />

            <TouchableOpacity
              style={styles.button}
              onPress={handleSignup}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Register</Text>
              )}
            </TouchableOpacity>

            <Text style={styles.orText}>Or Register with</Text>

            <TouchableOpacity
              style={styles.googleButton}
              onPress={handleGoogleSignIn}
              disabled={loading}
            >
              <Text style={styles.googleButtonText}>Google</Text>
            </TouchableOpacity>

            <View style={styles.footer}>
              <Text style={styles.footerText}>Already have an account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={styles.loginText}>Login</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(230, 220, 200, 0.85)',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 60,
  },
  logo: {
    fontSize: 32,
    marginBottom: 5,
  },
  brandName: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 15,
  },
  title: {
    fontSize: 32,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#4a4a4a',
  },
  formContainer: {
    width: '100%',
    maxWidth: 400,
  },
  input: {
    width: '100%',
    height: 55,
    backgroundColor: 'rgba(230, 220, 200, 0.6)',
    borderWidth: 1.5,
    borderColor: '#2a2a2a',
    borderRadius: 28,
    paddingHorizontal: 25,
    marginBottom: 20,
    fontSize: 16,
    color: '#1a1a1a',
  },
  button: {
    width: '100%',
    height: 55,
    backgroundColor: '#1a1a1a',
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 30,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    color: '#1a1a1a',
    fontSize: 14,
  },
  loginText: {
    color: '#1a1a1a',
    fontSize: 14,
    fontWeight: 'bold',
  },
  orText: {
    textAlign: 'center',
    color: '#4a4a4a',
    fontSize: 14,
    marginBottom: 15,
  },
  googleButton: {
    width: '100%',
    height: 55,
    backgroundColor: '#fff',
    borderRadius: 28,
    borderWidth: 1.5,
    borderColor: '#2a2a2a',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  googleButtonText: {
    color: '#1a1a1a',
    fontSize: 16,
    fontWeight: '600',
  },
});
