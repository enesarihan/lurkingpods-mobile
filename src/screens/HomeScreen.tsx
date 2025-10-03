import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  Dimensions,
  Image,
  ActivityIndicator,
} from 'react-native';
import ApiService from '../services/api';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';

interface Podcast {
  id: string;
  title: string;
  description: string;
  audio_file_url: string;
  audio_duration: number;
  category_id: string;
  language: 'en' | 'tr';
  created_at: string;
  play_count: number;
  is_featured: boolean;
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

interface HomeScreenProps {
  podcasts: Podcast[];
  categories: Category[];
  nextUpdate: Date;
  onRefresh: () => Promise<void>;
  onPodcastPress: (podcast: Podcast) => void;
  onCategoryPress: (category: Category) => void;
  loading: boolean;
}

export default function HomeScreen(props?: Partial<HomeScreenProps>) {
  const podcasts = props?.podcasts ?? [];
  const categories = props?.categories ?? [];
  const nextUpdate: Date = props?.nextUpdate ? new Date(props.nextUpdate) : new Date(Date.now() + 60 * 60 * 1000);
  const onRefresh = props?.onRefresh ?? (async () => {});
  const onPodcastPress = props?.onPodcastPress ?? (() => {});
  const onCategoryPress = props?.onCategoryPress ?? (() => {});
  const loading = props?.loading ?? false;
  const [timeUntilUpdate, setTimeUntilUpdate] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generateStatus, setGenerateStatus] = useState<string | null>(null);

  useEffect(() => {
    const updateTimer = () => {
      const now = new Date();
      const diff = nextUpdate.getTime() - now.getTime();
      
      if (diff > 0) {
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        setTimeUntilUpdate(`${hours}h ${minutes}m`);
      } else {
        setTimeUntilUpdate('Soon');
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [nextUpdate]);

  const featuredPodcast = podcasts.find(p => p.is_featured);
  const otherPodcasts = podcasts.filter(p => !p.is_featured);

  return (
    <LinearGradient
      colors={['#000000', '#1a1a1a']}
      style={styles.container}
    >
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={onRefresh}
            tintColor="#AE8EFF"
          />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Daily Mix</Text>
          <View style={styles.updateInfo}>
            <Text style={styles.updateLabel}>Next update in:</Text>
            <Text style={styles.updateTime}>{timeUntilUpdate}</Text>
          </View>
        </View>

        {/* Generate Today Button (test) */}
        <View style={{ paddingHorizontal: 20, marginBottom: 10 }}>
          <TouchableOpacity
            style={{
              backgroundColor: '#AE8EFF',
              paddingVertical: 12,
              borderRadius: 10,
              alignItems: 'center',
            }}
            disabled={isGenerating}
            onPress={async () => {
              try {
                setIsGenerating(true);
                setGenerateStatus('İçerik hazırlanıyor (Gemini)...');
                const res = await fetch('https://lurkingpods-api.vercel.app/content/generate-today', { method: 'POST' });
                setGenerateStatus('Ses oluşturuluyor (ElevenLabs)...');
                const data = await res.json();
                if (!res.ok) throw new Error(data?.error || 'Generate failed');
                setGenerateStatus('Supabase Storage’a yükleniyor...');
                // Endpoint zaten upload yapıyor; kullanıcıya bilgi ver
                alert('Oluşturuldu! URL: ' + (data.audioUrl || '—'));
              } catch (e: any) {
                alert('Oluşturma hatası: ' + e.message);
              }
              finally {
                setIsGenerating(false);
                setGenerateStatus(null);
              }
            }}
          >
            {isGenerating ? (
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <ActivityIndicator color="#000" />
                <Text style={{ color: '#000', fontWeight: 'bold' }}>Oluşturuluyor...</Text>
              </View>
            ) : (
              <Text style={{ color: '#000', fontWeight: 'bold' }}>Bugünün Podcastini Oluştur</Text>
            )}
          </TouchableOpacity>
          {generateStatus && (
            <Text style={{ color: '#AE8EFF', marginTop: 8 }}>{generateStatus}</Text>
          )}
        </View>

        {/* Featured Podcast */}
        {featuredPodcast && (
          <BlurView style={styles.featuredContainer} tint="dark" intensity={50}>
            <View style={styles.featuredContent}>
              <View style={styles.featuredHeader}>
                <Text style={styles.featuredTitle}>Today's Featured</Text>
                <View style={styles.featuredBadge}>
                  <Text style={styles.featuredBadgeText}>NEW</Text>
                </View>
              </View>
              
              <TouchableOpacity
                style={styles.featuredPodcast}
                onPress={() => onPodcastPress(featuredPodcast)}
              >
                <View style={styles.featuredInfo}>
                  <Text style={styles.featuredPodcastTitle}>{featuredPodcast.title}</Text>
                  <Text style={styles.featuredPodcastDescription} numberOfLines={2}>
                    {featuredPodcast.description}
                  </Text>
                  <View style={styles.featuredMeta}>
                    <Text style={styles.featuredDuration}>
                      {Math.floor(featuredPodcast.audio_duration / 60)}:{(featuredPodcast.audio_duration % 60).toString().padStart(2, '0')}
                    </Text>
                    <Text style={styles.featuredPlays}>
                      {featuredPodcast.play_count} plays
                    </Text>
                  </View>
                </View>
                
                <View style={styles.playButton}>
                  <Image
                    source={require('../../assets/icon.png')}
                    style={styles.playAnimation}
                    resizeMode="contain"
                  />
                </View>
              </TouchableOpacity>
            </View>
          </BlurView>
        )}

        {/* Categories */}
        <View style={styles.categoriesSection}>
          <Text style={styles.sectionTitle}>Categories</Text>
          <View style={styles.categoriesGrid}>
            {categories.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={[styles.categoryCard, { borderColor: category.color_hex }]}
                onPress={() => onCategoryPress(category)}
              >
                <LinearGradient
                  colors={[category.color_hex + '20', category.color_hex + '10']}
                  style={styles.categoryGradient}
                >
                  <View style={styles.categoryContent}>
                    <Text style={[styles.categoryIcon, { color: category.color_hex }]}>
                      {getCategoryIcon(category.name)}
                    </Text>
                    <Text style={styles.categoryName}>{category.display_name}</Text>
                    <Text style={styles.categoryDescription} numberOfLines={2}>
                      {category.description}
                    </Text>
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Recent Podcasts */}
        {otherPodcasts.length > 0 && (
          <View style={styles.recentSection}>
            <Text style={styles.sectionTitle}>Recent Podcasts</Text>
            {otherPodcasts.slice(0, 3).map((podcast) => (
              <TouchableOpacity
                key={podcast.id}
                style={styles.recentPodcast}
                onPress={() => onPodcastPress(podcast)}
              >
                <View style={styles.recentInfo}>
                  <Text style={styles.recentTitle}>{podcast.title}</Text>
                  <Text style={styles.recentDescription} numberOfLines={1}>
                    {podcast.description}
                  </Text>
                  <View style={styles.recentMeta}>
                    <Text style={styles.recentDuration}>
                      {Math.floor(podcast.audio_duration / 60)}:{(podcast.audio_duration % 60).toString().padStart(2, '0')}
                    </Text>
                    <Text style={styles.recentLanguage}>
                      {podcast.language.toUpperCase()}
                    </Text>
                  </View>
                </View>
                <View style={styles.recentPlayButton}>
                  <Text style={styles.recentPlayIcon}>▶</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
    </LinearGradient>
  );
}

function getCategoryIcon(categoryName: string): string {
  const icons: Record<string, string> = {
    sports: '⚽',
    finance: '💰',
    current_affairs: '📰',
    technology: '💻',
    entertainment: '🎬',
    health: '🏥',
  };
  return icons[categoryName] || '📁';
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
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  updateInfo: {
    alignItems: 'flex-end',
  },
  updateLabel: {
    fontSize: 12,
    color: '#FFFFFF',
    opacity: 0.6,
  },
  updateTime: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#AE8EFF',
  },
  featuredContainer: {
    margin: 20,
    borderRadius: 20,
    overflow: 'hidden',
  },
  featuredContent: {
    padding: 20,
  },
  featuredHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  featuredTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  featuredBadge: {
    backgroundColor: '#AE8EFF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  featuredBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#000000',
  },
  featuredPodcast: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  featuredInfo: {
    flex: 1,
    marginRight: 15,
  },
  featuredPodcastTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 5,
  },
  featuredPodcastDescription: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.8,
    marginBottom: 10,
  },
  featuredMeta: {
    flexDirection: 'row',
    gap: 15,
  },
  featuredDuration: {
    fontSize: 12,
    color: '#AE8EFF',
  },
  featuredPlays: {
    fontSize: 12,
    color: '#FFFFFF',
    opacity: 0.6,
  },
  playButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#AE8EFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playAnimation: {
    width: 30,
    height: 30,
  },
  categoriesSection: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 15,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 15,
  },
  categoryCard: {
    width: (Dimensions.get('window').width - 70) / 2,
    borderRadius: 15,
    borderWidth: 1,
    overflow: 'hidden',
  },
  categoryGradient: {
    padding: 20,
  },
  categoryContent: {
    alignItems: 'center',
  },
  categoryIcon: {
    fontSize: 32,
    marginBottom: 10,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 5,
    textAlign: 'center',
  },
  categoryDescription: {
    fontSize: 12,
    color: '#FFFFFF',
    opacity: 0.8,
    textAlign: 'center',
  },
  recentSection: {
    padding: 20,
    paddingTop: 0,
  },
  recentPodcast: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
  },
  recentInfo: {
    flex: 1,
  },
  recentTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 3,
  },
  recentDescription: {
    fontSize: 12,
    color: '#FFFFFF',
    opacity: 0.7,
    marginBottom: 5,
  },
  recentMeta: {
    flexDirection: 'row',
    gap: 10,
  },
  recentDuration: {
    fontSize: 10,
    color: '#AE8EFF',
  },
  recentLanguage: {
    fontSize: 10,
    color: '#FFFFFF',
    opacity: 0.6,
  },
  recentPlayButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(174, 142, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  recentPlayIcon: {
    color: '#AE8EFF',
    fontSize: 12,
  },
});
