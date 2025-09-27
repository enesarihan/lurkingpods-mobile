import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';

interface NotificationBannerProps {
  title: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
  visible: boolean;
  onDismiss: () => void;
  autoHide?: boolean;
  duration?: number;
}

export default function NotificationBanner({
  title,
  message,
  type,
  visible,
  onDismiss,
  autoHide = true,
  duration = 3000,
}: NotificationBannerProps) {
  const [animation] = useState(new Animated.Value(0));
  const [opacity] = useState(new Animated.Value(0));

  useEffect(() => {
    if (visible) {
      showBanner();
      if (autoHide) {
        const timer = setTimeout(() => {
          hideBanner();
        }, duration);
        return () => clearTimeout(timer);
      }
    } else {
      hideBanner();
    }
  }, [visible, autoHide, duration]);

  const showBanner = () => {
    Animated.parallel([
      Animated.timing(animation, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const hideBanner = () => {
    Animated.parallel([
      Animated.timing(animation, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onDismiss();
    });
  };

  const getTypeConfig = () => {
    switch (type) {
      case 'success':
        return {
          colors: ['#4CAF50', '#45a049'] as const,
          icon: '✓',
          iconColor: '#FFFFFF',
        };
      case 'info':
        return {
          colors: ['#2196F3', '#1976D2'] as const,
          icon: 'ℹ',
          iconColor: '#FFFFFF',
        };
      case 'warning':
        return {
          colors: ['#FF9800', '#F57C00'] as const,
          icon: '⚠',
          iconColor: '#FFFFFF',
        };
      case 'error':
        return {
          colors: ['#F44336', '#D32F2F'] as const,
          icon: '✕',
          iconColor: '#FFFFFF',
        };
      default:
        return {
          colors: ['#AE8EFF', '#8B5CF6'] as const,
          icon: 'ℹ',
          iconColor: '#FFFFFF',
        };
    }
  };

  const config = getTypeConfig();

  if (!visible) return null;

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity,
          transform: [
            {
              translateY: animation.interpolate({
                inputRange: [0, 1],
                outputRange: [-100, 0],
              }),
            },
          ],
        },
      ]}
    >
      <BlurView style={styles.banner} tint="dark" intensity={50}>
        <LinearGradient
          colors={config.colors}
          style={styles.gradient}
        >
          <View style={styles.content}>
            <View style={styles.iconContainer}>
              <Text style={[styles.icon, { color: config.iconColor }]}>
                {config.icon}
              </Text>
            </View>
            
            <View style={styles.textContainer}>
              <Text style={styles.title}>{title}</Text>
              <Text style={styles.message}>{message}</Text>
            </View>
            
            <TouchableOpacity
              style={styles.dismissButton}
              onPress={hideBanner}
            >
              <Text style={styles.dismissIcon}>✕</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </BlurView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    paddingTop: 50, // Account for status bar
  },
  banner: {
    margin: 15,
    borderRadius: 15,
    overflow: 'hidden',
  },
  gradient: {
    padding: 15,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  icon: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  message: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.9,
    lineHeight: 18,
  },
  dismissButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  dismissIcon: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
});
