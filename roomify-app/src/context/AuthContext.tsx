import React, { createContext, useState, useEffect, useContext } from 'react';
import { Platform } from 'react-native';
import {
  User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  updateProfile,
} from 'firebase/auth';
import { auth } from '../config/firebase';
import { login, createOrUpdateUser } from '../services/api';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signUp: (email: string, password: string, displayName: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signUp: async () => {},
  signIn: async () => {},
  signInWithGoogle: async () => {},
  logout: async () => {},
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log('🔄 Auth state changed:', user ? `User: ${user.uid}` : 'User: null (logged out)');
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signUp = async (email: string, password: string, displayName: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);

      // Update user profile with display name
      if (userCredential.user) {
        await updateProfile(userCredential.user, {
          displayName: displayName,
        });

        // Create user document in Firestore
        try {
          await createOrUpdateUser({
            displayName,
            email,
            photoURL: userCredential.user.photoURL || undefined,
          });
        } catch (apiError) {
          console.warn('Failed to create user in Firestore:', apiError);
          // Don't throw - Firebase auth succeeded, Firestore sync is optional
        }
      }
    } catch (error: any) {
      console.error('Sign up error:', error);
      throw new Error(error.message);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      
      // Sync user with Firestore after successful login
      try {
        await login();
      } catch (apiError) {
        console.warn('Failed to sync with Firestore:', apiError);
        // Don't throw - Firebase auth succeeded, Firestore sync is optional
      }
    } catch (error: any) {
      console.error('Sign in error:', error);
      throw new Error(error.message);
    }
  };

  const signInWithGoogle = async () => {
    try {
      if (Platform.OS === 'web') {
        // Web: Use Firebase popup
        const { signInWithPopup } = await import('firebase/auth');
        const provider = new GoogleAuthProvider();
        await signInWithPopup(auth, provider);

        // Sync with backend after successful login
        try {
          await login();
        } catch (apiError) {
          console.warn('Failed to sync with backend:', apiError);
          // Don't throw - Firebase auth succeeded, backend sync is optional
        }
      } else {
        // For mobile apps in Expo Go, show helpful message
        throw new Error('Google Sign-In is currently only available on web. Please use email/password to sign in on mobile, or build a development build for native Google Sign-In.');
      }
    } catch (error: any) {
      console.error('❌ Google sign in error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      console.log('🔓 Starting logout process...');
      console.log('Current user before logout:', auth.currentUser?.uid);
      
      await signOut(auth);
      
      console.log('✅ signOut() completed');
      console.log('Current user after logout:', auth.currentUser);
      
      // Force a small delay to ensure state updates
      await new Promise(resolve => setTimeout(resolve, 100));
      
      console.log('✅ Logout process completed');
      // The onAuthStateChanged listener will automatically update the user state
      // which will trigger navigation to AuthNavigator
    } catch (error: any) {
      console.error('❌ Logout error:', error);
      console.error('Error code:', error.code);
      console.error('Error message:', error.message);
      throw new Error(error.message || 'Failed to logout');
    }
  };

  const value = {
    user,
    loading,
    signUp,
    signIn,
    signInWithGoogle,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};