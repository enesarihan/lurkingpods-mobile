import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { Text, TouchableOpacity } from 'react-native';

// Screens
import HomeScreen from '../screens/HomeScreen';
import CategoryScreen from '../screens/CategoryScreen';
import PlayerScreen from '../screens/PlayerScreen';
import ProfileScreen from '../screens/ProfileScreen';
import AuthScreen from '../screens/AuthScreen';

// Types
interface Podcast {
  id: string;
  title: string;
  description: string;
  script_content: string;
  audio_file_url: string;
  audio_duration: number;
  category_id: string;
  language: 'en' | 'tr';
  created_at: string;
  play_count: number;
  is_featured: boolean;
  speaker_1_voice_id: string;
  speaker_2_voice_id: string;
}

interface Category {
  id: string;
  name: string;
  display_name: string;
  description: string;
  icon_url: string;
  color_hex: string;
  is_active: boolean;
  sort_order: number;
}

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

// Navigation Types
export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
  Player: { podcast: Podcast };
  Category: { category: Category };
};

export type MainTabParamList = {
  Home: undefined;
  Profile: undefined;
};

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

const Tab = createBottomTabNavigator<MainTabParamList>();
const Stack = createStackNavigator<RootStackParamList>();

// Tab Bar Component
function CustomTabBar({ state, descriptors, navigation }: any) {
  return (
    <BlurView
      style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 90,
        borderTopWidth: 1,
        borderTopColor: 'rgba(255, 255, 255, 0.1)',
      }}
      tint="dark"
      intensity={50}
    >
      <LinearGradient
        colors={['rgba(0, 0, 0, 0.8)', 'rgba(0, 0, 0, 0.9)']}
        style={{
          flex: 1,
          flexDirection: 'row',
          paddingTop: 10,
          paddingBottom: 30,
        }}
      >
        {state.routes.map((route: any, index: number) => {
          const { options } = descriptors[route.key];
          const label = options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          const getTabIcon = (routeName: string) => {
            switch (routeName) {
              case 'Home':
                return isFocused ? '🏠' : '🏡';
              case 'Profile':
                return isFocused ? '👤' : '👥';
              default:
                return '📱';
            }
          };

          return (
            <TouchableOpacity
              key={route.key}
              style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
              }}
              onPress={onPress}
            >
              <Text style={{ fontSize: 24, marginBottom: 5 }}>
                {getTabIcon(route.name)}
              </Text>
              <Text
                style={{
                  color: isFocused ? '#AE8EFF' : '#FFFFFF',
                  fontSize: 12,
                  fontWeight: isFocused ? 'bold' : 'normal',
                }}
              >
                {label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </LinearGradient>
    </BlurView>
  );
}

// Main Tab Navigator
function MainTabNavigator() {
  return (
    <Tab.Navigator
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen as unknown as React.ComponentType<any>}
        options={{
          tabBarLabel: 'Home',
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen as unknown as React.ComponentType<any>}
        options={{
          tabBarLabel: 'Profile',
        }}
      />
    </Tab.Navigator>
  );
}

// Root Stack Navigator
function RootStackNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        presentation: 'modal',
      }}
    >
      <Stack.Screen name="Auth" component={AuthScreen} />
      <Stack.Screen name="Main" component={MainTabNavigator} />
      <Stack.Screen
        name="Player"
        component={PlayerScreen as unknown as React.ComponentType<any>}
        options={{
          presentation: 'modal',
        }}
      />
      <Stack.Screen
        name="Category"
        component={CategoryScreen as unknown as React.ComponentType<any>}
        options={{
          presentation: 'card',
        }}
      />
    </Stack.Navigator>
  );
}

// Main App Navigator
export default function AppNavigator() {
  return (
    <NavigationContainer>
      <RootStackNavigator />
    </NavigationContainer>
  );
}
