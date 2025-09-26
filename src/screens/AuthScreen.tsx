import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';

interface AuthScreenProps {
  onLogin: (email: string, password: string) => Promise<void>;
  onRegister: (email: string, password: string, language: 'en' | 'tr') => Promise<void>;
}

export default function AuthScreen({ onLogin, onRegister }: AuthScreenProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [language, setLanguage] = useState<'en' | 'tr'>('en');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      if (isLogin) {
        await onLogin(email, password);
      } else {
        await onRegister(email, password, language);
      }
    } catch (error) {
      Alert.alert('Error', error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient
      colors={['#000000', '#1a1a1a']}
      style={styles.container}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <Text style={styles.title}>LurkingPods</Text>
            <Text style={styles.subtitle}>
              AI-Powered Daily Podcasts
            </Text>
          </View>

          <BlurView
            style={styles.formContainer}
            tint="dark"
            intensity={50}
          >
            <View style={styles.form}>
              <Text style={styles.formTitle}>
                {isLogin ? 'Welcome Back' : 'Create Account'}
              </Text>

              {!isLogin && (
                <View style={styles.languageSelector}>
                  <Text style={styles.languageLabel}>Language:</Text>
                  <View style={styles.languageButtons}>
                    <TouchableOpacity
                      style={[
                        styles.languageButton,
                        language === 'en' && styles.languageButtonActive
                      ]}
                      onPress={() => setLanguage('en')}
                    >
                      <Text style={[
                        styles.languageButtonText,
                        language === 'en' && styles.languageButtonTextActive
                      ]}>
                        English
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[
                        styles.languageButton,
                        language === 'tr' && styles.languageButtonActive
                      ]}
                      onPress={() => setLanguage('tr')}
                    >
                      <Text style={[
                        styles.languageButtonText,
                        language === 'tr' && styles.languageButtonTextActive
                      ]}>
                        Türkçe
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}

              <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor="#666"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />

              <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="#666"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoCapitalize="none"
                autoCorrect={false}
              />

              <TouchableOpacity
                style={[styles.submitButton, loading && styles.submitButtonDisabled]}
                onPress={handleSubmit}
                disabled={loading}
              >
                <Text style={styles.submitButtonText}>
                  {loading ? 'Loading...' : (isLogin ? 'Sign In' : 'Sign Up')}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.switchButton}
                onPress={() => setIsLogin(!isLogin)}
              >
                <Text style={styles.switchButtonText}>
                  {isLogin
                    ? "Don't have an account? Sign up"
                    : 'Already have an account? Sign in'
                  }
                </Text>
              </TouchableOpacity>

              {!isLogin && (
                <View style={styles.trialInfo}>
                  <Text style={styles.trialText}>
                    🎉 2-day free trial included
                  </Text>
                  <Text style={styles.trialSubtext}>
                    Access all premium features
                  </Text>
                </View>
              )}
            </View>
          </BlurView>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#AE8EFF',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#FFFFFF',
    opacity: 0.8,
  },
  formContainer: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  form: {
    padding: 30,
  },
  formTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 30,
  },
  languageSelector: {
    marginBottom: 20,
  },
  languageLabel: {
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 10,
  },
  languageButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  languageButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#333',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  languageButtonActive: {
    borderColor: '#AE8EFF',
    backgroundColor: 'rgba(174, 142, 255, 0.2)',
  },
  languageButtonText: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontSize: 14,
  },
  languageButtonTextActive: {
    color: '#AE8EFF',
    fontWeight: 'bold',
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 15,
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 15,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  submitButton: {
    backgroundColor: '#AE8EFF',
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  switchButton: {
    marginTop: 20,
    alignItems: 'center',
  },
  switchButtonText: {
    color: '#AE8EFF',
    fontSize: 14,
  },
  trialInfo: {
    marginTop: 20,
    alignItems: 'center',
    padding: 15,
    backgroundColor: 'rgba(174, 142, 255, 0.1)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(174, 142, 255, 0.3)',
  },
  trialText: {
    color: '#AE8EFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  trialSubtext: {
    color: '#FFFFFF',
    fontSize: 12,
    opacity: 0.8,
  },
});
