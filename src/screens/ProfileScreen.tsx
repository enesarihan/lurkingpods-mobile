import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Switch,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'react-native-blur';

interface User {
  id: string;
  email: string;
  language_preference: 'en' | 'tr';
  trial_start_date: Date;
  trial_end_date: Date;
  subscription_status: 'trial' | 'active' | 'expired' | 'cancelled';
  notification_enabled: boolean;
  notification_time: string;
  favorite_categories: string[];
  theme_preference: 'light' | 'dark' | 'system';
}

interface Subscription {
  is_subscribed: boolean;
  subscription_type: 'monthly' | 'yearly' | null;
  end_date: Date | null;
  is_expired: boolean;
}

interface ProfileScreenProps {
  user: User;
  subscription: Subscription;
  onUpdatePreferences: (preferences: Partial<User>) => Promise<void>;
  onUpgradeSubscription: () => void;
  onLogout: () => void;
}

export default function ProfileScreen({
  user,
  subscription,
  onUpdatePreferences,
  onUpgradeSubscription,
  onLogout,
}: ProfileScreenProps) {
  const [notificationEnabled, setNotificationEnabled] = useState(user.notification_enabled);
  const [languagePreference, setLanguagePreference] = useState(user.language_preference);
  const [themePreference, setThemePreference] = useState(user.theme_preference);

  const handleNotificationToggle = async (value: boolean) => {
    setNotificationEnabled(value);
    await onUpdatePreferences({ notification_enabled: value });
  };

  const handleLanguageChange = async (language: 'en' | 'tr') => {
    setLanguagePreference(language);
    await onUpdatePreferences({ language_preference: language });
  };

  const handleThemeChange = async (theme: 'light' | 'dark' | 'system') => {
    setThemePreference(theme);
    await onUpdatePreferences({ theme_preference: theme });
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', style: 'destructive', onPress: onLogout },
      ]
    );
  };

  const getTrialDaysRemaining = () => {
    const now = new Date();
    const diff = user.trial_end_date.getTime() - now.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  const getSubscriptionStatusText = () => {
    if (subscription.is_subscribed) {
      return `Active (${subscription.subscription_type})`;
    } else if (user.subscription_status === 'trial') {
      return `Trial (${getTrialDaysRemaining()} days left)`;
    } else {
      return 'Expired';
    }
  };

  const getSubscriptionStatusColor = () => {
    if (subscription.is_subscribed) {
      return '#4CAF50';
    } else if (user.subscription_status === 'trial') {
      return '#FF9800';
    } else {
      return '#F44336';
    }
  };

  return (
    <LinearGradient
      colors={['#000000', '#1a1a1a']}
      style={styles.container}
    >
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Profile</Text>
          <Text style={styles.subtitle}>Manage your account</Text>
        </View>

        {/* User Info */}
        <BlurView style={styles.userInfo} blurType="dark" blurAmount={10}>
          <View style={styles.userContent}>
            <View style={styles.userAvatar}>
              <Text style={styles.userAvatarText}>
                {user.email.charAt(0).toUpperCase()}
              </Text>
            </View>
            <View style={styles.userDetails}>
              <Text style={styles.userEmail}>{user.email}</Text>
              <Text style={styles.userStatus}>
                {getSubscriptionStatusText()}
              </Text>
            </View>
          </View>
        </BlurView>

        {/* Subscription Status */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Subscription</Text>
          
          <View style={styles.subscriptionCard}>
            <View style={styles.subscriptionInfo}>
              <Text style={styles.subscriptionTitle}>
                {subscription.is_subscribed ? 'Premium Active' : 'Free Trial'}
              </Text>
              <Text style={[
                styles.subscriptionStatus,
                { color: getSubscriptionStatusColor() }
              ]}>
                {getSubscriptionStatusText()}
              </Text>
            </View>
            
            {!subscription.is_subscribed && (
              <TouchableOpacity
                style={styles.upgradeButton}
                onPress={onUpgradeSubscription}
              >
                <Text style={styles.upgradeButtonText}>Upgrade</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Preferences */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>

          {/* Language Preference */}
          <View style={styles.preferenceItem}>
            <Text style={styles.preferenceLabel}>Language</Text>
            <View style={styles.languageButtons}>
              <TouchableOpacity
                style={[
                  styles.languageButton,
                  languagePreference === 'en' && styles.languageButtonActive
                ]}
                onPress={() => handleLanguageChange('en')}
              >
                <Text style={[
                  styles.languageButtonText,
                  languagePreference === 'en' && styles.languageButtonTextActive
                ]}>
                  English
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.languageButton,
                  languagePreference === 'tr' && styles.languageButtonActive
                ]}
                onPress={() => handleLanguageChange('tr')}
              >
                <Text style={[
                  styles.languageButtonText,
                  languagePreference === 'tr' && styles.languageButtonTextActive
                ]}>
                  Türkçe
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Theme Preference */}
          <View style={styles.preferenceItem}>
            <Text style={styles.preferenceLabel}>Theme</Text>
            <View style={styles.themeButtons}>
              <TouchableOpacity
                style={[
                  styles.themeButton,
                  themePreference === 'light' && styles.themeButtonActive
                ]}
                onPress={() => handleThemeChange('light')}
              >
                <Text style={[
                  styles.themeButtonText,
                  themePreference === 'light' && styles.themeButtonTextActive
                ]}>
                  Light
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.themeButton,
                  themePreference === 'dark' && styles.themeButtonActive
                ]}
                onPress={() => handleThemeChange('dark')}
              >
                <Text style={[
                  styles.themeButtonText,
                  themePreference === 'dark' && styles.themeButtonTextActive
                ]}>
                  Dark
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.themeButton,
                  themePreference === 'system' && styles.themeButtonActive
                ]}
                onPress={() => handleThemeChange('system')}
              >
                <Text style={[
                  styles.themeButtonText,
                  themePreference === 'system' && styles.themeButtonTextActive
                ]}>
                  System
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Notifications */}
          <View style={styles.preferenceItem}>
            <View style={styles.preferenceRow}>
              <Text style={styles.preferenceLabel}>Push Notifications</Text>
              <Switch
                value={notificationEnabled}
                onValueChange={handleNotificationToggle}
                trackColor={{ false: '#767577', true: '#AE8EFF' }}
                thumbColor={notificationEnabled ? '#FFFFFF' : '#f4f3f4'}
              />
            </View>
            <Text style={styles.preferenceDescription}>
              Get notified when new podcasts are available
            </Text>
          </View>
        </View>

        {/* Account Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionButtonText}>Privacy Policy</Text>
            <Text style={styles.actionButtonIcon}>›</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionButtonText}>Terms of Service</Text>
            <Text style={styles.actionButtonIcon}>›</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionButtonText}>Support</Text>
            <Text style={styles.actionButtonIcon}>›</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionButtonText}>About</Text>
            <Text style={styles.actionButtonIcon}>›</Text>
          </TouchableOpacity>
        </View>

        {/* Logout */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#FFFFFF',
    opacity: 0.7,
  },
  userInfo: {
    margin: 20,
    borderRadius: 20,
    overflow: 'hidden',
  },
  userContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  userAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#AE8EFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  userAvatarText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
  userDetails: {
    flex: 1,
  },
  userEmail: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 5,
  },
  userStatus: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.7,
  },
  section: {
    margin: 20,
    marginTop: 0,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 15,
  },
  subscriptionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
  },
  subscriptionInfo: {
    flex: 1,
  },
  subscriptionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 3,
  },
  subscriptionStatus: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  upgradeButton: {
    backgroundColor: '#AE8EFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  upgradeButtonText: {
    color: '#000000',
    fontSize: 14,
    fontWeight: 'bold',
  },
  preferenceItem: {
    marginBottom: 20,
  },
  preferenceLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 10,
  },
  preferenceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  preferenceDescription: {
    fontSize: 12,
    color: '#FFFFFF',
    opacity: 0.6,
    marginTop: 5,
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
    borderColor: 'rgba(255, 255, 255, 0.3)',
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
  themeButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  themeButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  themeButtonActive: {
    borderColor: '#AE8EFF',
    backgroundColor: 'rgba(174, 142, 255, 0.2)',
  },
  themeButtonText: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontSize: 12,
  },
  themeButtonTextActive: {
    color: '#AE8EFF',
    fontWeight: 'bold',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
  },
  actionButtonText: {
    flex: 1,
    fontSize: 16,
    color: '#FFFFFF',
  },
  actionButtonIcon: {
    fontSize: 20,
    color: '#FFFFFF',
    opacity: 0.5,
  },
  logoutButton: {
    backgroundColor: 'rgba(255, 107, 107, 0.2)',
    borderRadius: 12,
    padding: 15,
    margin: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 107, 107, 0.3)',
  },
  logoutButtonText: {
    color: '#FF6B6B',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
