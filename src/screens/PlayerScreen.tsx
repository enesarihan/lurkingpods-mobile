import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import TrackPlayer, { State, useTrackPlayerEvents, Event } from 'react-native-track-player';

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

interface PlayerScreenProps {
  podcast: Podcast;
  onClose: () => void;
  onNext?: () => void;
  onPrevious?: () => void;
}

export default function PlayerScreen({
  podcast,
  onClose,
  onNext,
  onPrevious,
}: PlayerScreenProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(podcast.audio_duration);
  const [currentSpeaker, setCurrentSpeaker] = useState<'speaker1' | 'speaker2' | null>(null);
  const [scriptSegments, setScriptSegments] = useState<Array<{
    text: string;
    speaker: 'speaker1' | 'speaker2';
    startTime: number;
    endTime: number;
  }>>([]);

  const progressAnimation = useRef(new Animated.Value(0)).current;
  const waveformAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Parse script content to extract speaker segments
    parseScriptContent();
    
    // Setup track player
    setupTrackPlayer();

    return () => {
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

  const parseScriptContent = () => {
    const lines = podcast.script_content.split('\n').filter(line => line.trim());
    const segments: Array<{
      text: string;
      speaker: 'speaker1' | 'speaker2';
      startTime: number;
      endTime: number;
    }> = [];

    let currentTime = 0;
    const timePerLine = duration / lines.length;

    lines.forEach((line, index) => {
      if (line.startsWith('Speaker 1:')) {
        segments.push({
          text: line.replace('Speaker 1:', '').trim(),
          speaker: 'speaker1',
          startTime: currentTime,
          endTime: currentTime + timePerLine,
        });
      } else if (line.startsWith('Speaker 2:')) {
        segments.push({
          text: line.replace('Speaker 2:', '').trim(),
          speaker: 'speaker2',
          startTime: currentTime,
          endTime: currentTime + timePerLine,
        });
      }
      currentTime += timePerLine;
    });

    setScriptSegments(segments);
  };

  const setupTrackPlayer = async () => {
    try {
      await TrackPlayer.setupPlayer();
      await TrackPlayer.add({
        id: podcast.id,
        url: podcast.audio_file_url,
        title: podcast.title,
        artist: 'LurkingPods',
        duration: podcast.audio_duration,
      });
    } catch (error) {
      console.error('TrackPlayer setup error:', error);
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

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
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

  const getCurrentSpeaker = () => {
    const currentSegment = scriptSegments.find(
      segment => currentTime >= segment.startTime && currentTime <= segment.endTime
    );
    return currentSegment?.speaker || null;
  };

  const getSpeakerName = (speaker: 'speaker1' | 'speaker2') => {
    return speaker === 'speaker1' ? 'Speaker 1' : 'Speaker 2';
  };

  const getSpeakerColor = (speaker: 'speaker1' | 'speaker2') => {
    return speaker === 'speaker1' ? '#AE8EFF' : '#FF6B6B';
  };

  const progress = duration > 0 ? currentTime / duration : 0;

  return (
    <LinearGradient
      colors={['#000000', '#1a1a1a']}
      style={styles.container}
    >
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeIcon}>✕</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Now Playing</Text>
          <View style={styles.headerSpacer} />
        </View>

        {/* Podcast Info */}
        <BlurView style={styles.podcastInfo} tint="dark" intensity={50}>
          <View style={styles.podcastContent}>
            <Text style={styles.podcastTitle}>{podcast.title}</Text>
            <Text style={styles.podcastDescription}>{podcast.description}</Text>
            
            <View style={styles.podcastMeta}>
              <Text style={styles.metaText}>
                {formatTime(currentTime)} / {formatTime(duration)}
              </Text>
              <Text style={styles.metaText}>
                {podcast.language.toUpperCase()}
              </Text>
            </View>
          </View>
        </BlurView>

        {/* Waveform Visualization */}
        <View style={styles.waveformContainer}>
          <Text style={styles.waveformTitle}>Audio Waveform</Text>
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

        {/* Current Speaker */}
        {getCurrentSpeaker() && (
          <BlurView style={styles.speakerContainer} tint="dark" intensity={50}>
            <View style={styles.speakerContent}>
              <View style={styles.speakerInfo}>
                <View style={[
                  styles.speakerAvatar,
                  { backgroundColor: getSpeakerColor(getCurrentSpeaker()!) }
                ]}>
                  <Text style={styles.speakerAvatarText}>
                    {getCurrentSpeaker() === 'speaker1' ? '1' : '2'}
                  </Text>
                </View>
                <View style={styles.speakerDetails}>
                  <Text style={styles.speakerName}>
                    {getSpeakerName(getCurrentSpeaker()!)}
                  </Text>
                  <Text style={styles.speakerStatus}>Speaking now</Text>
                </View>
              </View>
            </View>
          </BlurView>
        )}

        {/* Script Content */}
        <View style={styles.scriptContainer}>
          <Text style={styles.scriptTitle}>Dialogue Script</Text>
          <ScrollView style={styles.scriptContent} nestedScrollEnabled>
            {scriptSegments.map((segment, index) => (
              <View
                key={index}
                style={[
                  styles.scriptSegment,
                  currentTime >= segment.startTime && currentTime <= segment.endTime && styles.scriptSegmentActive
                ]}
              >
                <Text style={[
                  styles.scriptSpeaker,
                  { color: getSpeakerColor(segment.speaker) }
                ]}>
                  {getSpeakerName(segment.speaker)}:
                </Text>
                <Text style={styles.scriptText}>{segment.text}</Text>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <Text style={styles.progressTime}>{formatTime(currentTime)}</Text>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
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
          >
            <Text style={styles.playIcon}>
              {isPlaying ? '⏸' : '▶'}
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
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
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
    margin: 20,
    borderRadius: 20,
    overflow: 'hidden',
  },
  podcastContent: {
    padding: 20,
  },
  podcastTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  podcastDescription: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.8,
    marginBottom: 15,
  },
  podcastMeta: {
    flexDirection: 'row',
    gap: 20,
  },
  metaText: {
    fontSize: 12,
    color: '#AE8EFF',
  },
  waveformContainer: {
    margin: 20,
    marginTop: 0,
  },
  waveformTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 10,
  },
  waveform: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 40,
    gap: 2,
  },
  waveformBar: {
    width: 3,
    backgroundColor: '#AE8EFF',
    borderRadius: 2,
  },
  speakerContainer: {
    margin: 20,
    marginTop: 0,
    borderRadius: 15,
    overflow: 'hidden',
  },
  speakerContent: {
    padding: 15,
  },
  speakerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  speakerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  speakerAvatarText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  speakerDetails: {
    flex: 1,
  },
  speakerName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  speakerStatus: {
    fontSize: 12,
    color: '#FFFFFF',
    opacity: 0.7,
  },
  scriptContainer: {
    margin: 20,
    marginTop: 0,
  },
  scriptTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 10,
  },
  scriptContent: {
    maxHeight: 200,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 15,
  },
  scriptSegment: {
    marginBottom: 10,
    padding: 10,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  scriptSegmentActive: {
    backgroundColor: 'rgba(174, 142, 255, 0.2)',
    borderWidth: 1,
    borderColor: '#AE8EFF',
  },
  scriptSpeaker: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  scriptText: {
    fontSize: 14,
    color: '#FFFFFF',
    lineHeight: 20,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
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
    padding: 20,
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
