import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
} from 'react-native';
import TrackPlayer, { State, useTrackPlayerEvents, Event } from 'react-native-track-player';
import { LinearGradient } from 'expo-linear-gradient';

interface AudioPlayerProps {
  podcast: {
    id: string;
    title: string;
    audio_file_url: string;
    audio_duration: number;
  };
  onClose: () => void;
  onNext?: () => void;
  onPrevious?: () => void;
}

export default function AudioPlayer({
  podcast,
  onClose,
  onNext,
  onPrevious,
}: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(podcast.audio_duration);
  const [isLoading, setIsLoading] = useState(false);

  const progressAnimation = useRef(new Animated.Value(0)).current;
  const waveformAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    setupTrackPlayer();
    
    const interval = setInterval(() => {
      updateProgress();
    }, 1000);

    return () => {
      clearInterval(interval);
      TrackPlayer.stop();
    };
  }, []);

  useEffect(() => {
    if (isPlaying) {
      startWaveformAnimation();
    } else {
      stopWaveformAnimation();
    }
  }, [isPlaying]);

  const setupTrackPlayer = async () => {
    try {
      setIsLoading(true);
      await TrackPlayer.setupPlayer();
      await TrackPlayer.add({
        id: podcast.id,
        url: podcast.audio_file_url,
        title: podcast.title,
        artist: 'LurkingPods',
        duration: podcast.audio_duration,
      });
      setDuration(podcast.audio_duration);
    } catch (error) {
      console.error('TrackPlayer setup error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const togglePlayPause = async () => {
    try {
      if (isPlaying) {
        await TrackPlayer.pause();
        setIsPlaying(false);
      } else {
        await TrackPlayer.play();
        setIsPlaying(true);
      }
    } catch (error) {
      console.error('Playback error:', error);
    }
  };

  const seekTo = async (position: number) => {
    try {
      await TrackPlayer.seekTo(position);
      setCurrentTime(position);
    } catch (error) {
      console.error('Seek error:', error);
    }
  };

  const updateProgress = async () => {
    try {
      const position = await TrackPlayer.getPosition();
      setCurrentTime(position);
      
      const progress = duration > 0 ? position / duration : 0;
      progressAnimation.setValue(progress);
    } catch (error) {
      console.error('Progress update error:', error);
    }
  };

  const startWaveformAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(waveformAnimation, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(waveformAnimation, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const stopWaveformAnimation = () => {
    waveformAnimation.stopAnimation();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = duration > 0 ? currentTime / duration : 0;

  return (
    <LinearGradient
      colors={['#000000', '#1a1a1a']}
      style={styles.container}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Text style={styles.closeIcon}>✕</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Now Playing</Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Podcast Info */}
      <View style={styles.podcastInfo}>
        <Text style={styles.podcastTitle}>{podcast.title}</Text>
        <Text style={styles.podcastArtist}>LurkingPods</Text>
      </View>

      {/* Waveform Visualization */}
      <View style={styles.waveformContainer}>
        <View style={styles.waveform}>
          {Array.from({ length: 50 }, (_, index) => (
            <Animated.View
              key={index}
              style={[
                styles.waveformBar,
                {
                  height: isPlaying ? 20 + Math.random() * 30 : 10,
                  opacity: isPlaying ? 0.8 : 0.3,
                  transform: [
                    {
                      scaleY: waveformAnimation.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0.5, 1.5],
                      }),
                    },
                  ],
                },
              ]}
            />
          ))}
        </View>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <Text style={styles.progressTime}>{formatTime(currentTime)}</Text>
        <View style={styles.progressBar}>
          <Animated.View
            style={[
              styles.progressFill,
              {
                width: progressAnimation.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0%', '100%'],
                }),
              },
            ]}
          />
          <TouchableOpacity
            style={[styles.progressThumb, { left: `${progress * 100}%` }]}
            onPress={() => seekTo(currentTime)}
          />
        </View>
        <Text style={styles.progressTime}>{formatTime(duration)}</Text>
      </View>

      {/* Controls */}
      <View style={styles.controls}>
        <TouchableOpacity
          style={styles.controlButton}
          onPress={onPrevious}
          disabled={!onPrevious}
        >
          <Text style={styles.controlIcon}>⏮</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.playButton, { backgroundColor: isPlaying ? '#FF6B6B' : '#AE8EFF' }]}
          onPress={togglePlayPause}
          disabled={isLoading}
        >
          <Text style={styles.playIcon}>
            {isLoading ? '⏳' : (isPlaying ? '⏸' : '▶')}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.controlButton}
          onPress={onNext}
          disabled={!onNext}
        >
          <Text style={styles.controlIcon}>⏭</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  closeButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeIcon: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  headerSpacer: {
    width: 30,
  },
  podcastInfo: {
    alignItems: 'center',
    marginBottom: 40,
  },
  podcastTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 5,
  },
  podcastArtist: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.7,
  },
  waveformContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  waveform: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 60,
    gap: 2,
  },
  waveformBar: {
    width: 3,
    backgroundColor: '#AE8EFF',
    borderRadius: 2,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 40,
    gap: 15,
  },
  progressTime: {
    fontSize: 12,
    color: '#FFFFFF',
    minWidth: 40,
    textAlign: 'center',
  },
  progressBar: {
    flex: 1,
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 2,
    position: 'relative',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#AE8EFF',
    borderRadius: 2,
  },
  progressThumb: {
    position: 'absolute',
    top: -6,
    width: 16,
    height: 16,
    backgroundColor: '#AE8EFF',
    borderRadius: 8,
    marginLeft: -8,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 30,
  },
  controlButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  controlIcon: {
    color: '#FFFFFF',
    fontSize: 20,
  },
  playButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playIcon: {
    color: '#FFFFFF',
    fontSize: 24,
  },
});
