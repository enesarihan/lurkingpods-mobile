import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  Dimensions,
} from 'react-native';
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

interface CategoryScreenProps {
  category: Category;
  podcasts: Podcast[];
  onPodcastPress: (podcast: Podcast) => void;
  onRefresh: () => Promise<void>;
  loading: boolean;
}

export default function CategoryScreen({
  category,
  podcasts,
  onPodcastPress,
  onRefresh,
  loading,
}: CategoryScreenProps) {
  const [selectedLanguage, setSelectedLanguage] = useState<'en' | 'tr'>('en');
  const [filteredPodcasts, setFilteredPodcasts] = useState<Podcast[]>([]);

  useEffect(() => {
    const filtered = podcasts.filter(podcast => podcast.language === selectedLanguage);
    setFilteredPodcasts(filtered);
  }, [podcasts, selectedLanguage]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getCategoryIcon = (categoryName: string): string => {
    const icons: Record<string, string> = {
      sports: '⚽',
      finance: '💰',
      current_affairs: '📰',
      technology: '💻',
      entertainment: '🎬',
      health: '🏥',
    };
    return icons[categoryName] || '📁';
  };

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
        <BlurView style={styles.header} tint="dark" intensity={50}>
          <View style={styles.headerContent}>
            <View style={styles.categoryInfo}>
              <Text style={[styles.categoryIcon, { color: category.color_hex }]}>
                {getCategoryIcon(category.name)}
              </Text>
              <View style={styles.categoryDetails}>
                <Text style={styles.categoryName}>{category.display_name}</Text>
                <Text style={styles.categoryDescription}>{category.description}</Text>
              </View>
            </View>
            
            <View style={styles.languageSelector}>
              <TouchableOpacity
                style={[
                  styles.languageButton,
                  selectedLanguage === 'en' && styles.languageButtonActive
                ]}
                onPress={() => setSelectedLanguage('en')}
              >
                <Text style={[
                  styles.languageButtonText,
                  selectedLanguage === 'en' && styles.languageButtonTextActive
                ]}>
                  EN
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.languageButton,
                  selectedLanguage === 'tr' && styles.languageButtonActive
                ]}
                onPress={() => setSelectedLanguage('tr')}
              >
                <Text style={[
                  styles.languageButtonText,
                  selectedLanguage === 'tr' && styles.languageButtonTextActive
                ]}>
                  TR
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </BlurView>

        {/* Podcasts List */}
        <View style={styles.podcastsSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              {filteredPodcasts.length} Podcast{filteredPodcasts.length !== 1 ? 's' : ''}
            </Text>
            <Text style={styles.sectionSubtitle}>
              {selectedLanguage === 'en' ? 'English' : 'Turkish'} content
            </Text>
          </View>

          {filteredPodcasts.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>🎧</Text>
              <Text style={styles.emptyTitle}>No podcasts yet</Text>
              <Text style={styles.emptyDescription}>
                New content is generated daily at 00:00 UTC
              </Text>
            </View>
          ) : (
            filteredPodcasts.map((podcast, index) => (
              <TouchableOpacity
                key={podcast.id}
                style={[
                  styles.podcastCard,
                  index === 0 && styles.podcastCardFirst
                ]}
                onPress={() => onPodcastPress(podcast)}
              >
                <LinearGradient
                  colors={[
                    category.color_hex + '20',
                    category.color_hex + '10',
                    'transparent'
                  ]}
                  style={styles.podcastGradient}
                >
                  <View style={styles.podcastContent}>
                    <View style={styles.podcastInfo}>
                      <Text style={styles.podcastTitle}>{podcast.title}</Text>
                      <Text style={styles.podcastDescription} numberOfLines={2}>
                        {podcast.description}
                      </Text>
                      
                      <View style={styles.podcastMeta}>
                        <View style={styles.metaItem}>
                          <Text style={styles.metaIcon}>⏱️</Text>
                          <Text style={styles.metaText}>
                            {Math.floor(podcast.audio_duration / 60)}:{(podcast.audio_duration % 60).toString().padStart(2, '0')}
                          </Text>
                        </View>
                        
                        <View style={styles.metaItem}>
                          <Text style={styles.metaIcon}>👁️</Text>
                          <Text style={styles.metaText}>{podcast.play_count} plays</Text>
                        </View>
                        
                        <View style={styles.metaItem}>
                          <Text style={styles.metaIcon}>📅</Text>
                          <Text style={styles.metaText}>{formatDate(podcast.created_at)}</Text>
                        </View>
                      </View>
                    </View>
                    
                    <View style={styles.podcastActions}>
                      <View style={[styles.playButton, { backgroundColor: category.color_hex }]}>
                        <Text style={styles.playIcon}>▶</Text>
                      </View>
                      
                      {podcast.is_featured && (
                        <View style={styles.featuredBadge}>
                          <Text style={styles.featuredBadgeText}>FEATURED</Text>
                        </View>
                      )}
                    </View>
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            ))
          )}
        </View>

        {/* Archive Info */}
        <View style={styles.archiveInfo}>
          <Text style={styles.archiveTitle}>📚 Archive</Text>
          <Text style={styles.archiveDescription}>
            Podcasts are kept for 7 days, then automatically deleted to save space.
            New content is generated daily at 00:00 UTC.
          </Text>
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
    margin: 20,
    borderRadius: 20,
    overflow: 'hidden',
  },
  headerContent: {
    padding: 20,
  },
  categoryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  categoryIcon: {
    fontSize: 40,
    marginRight: 15,
  },
  categoryDetails: {
    flex: 1,
  },
  categoryName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 5,
  },
  categoryDescription: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.8,
  },
  languageSelector: {
    flexDirection: 'row',
    gap: 10,
  },
  languageButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
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
    fontSize: 14,
    fontWeight: 'bold',
  },
  languageButtonTextActive: {
    color: '#AE8EFF',
  },
  podcastsSection: {
    padding: 20,
    paddingTop: 0,
  },
  sectionHeader: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 5,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.6,
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 20,
    marginTop: 20,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 15,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.6,
    textAlign: 'center',
  },
  podcastCard: {
    borderRadius: 15,
    marginBottom: 15,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  podcastCardFirst: {
    borderColor: '#AE8EFF',
    borderWidth: 2,
  },
  podcastGradient: {
    padding: 20,
  },
  podcastContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  podcastInfo: {
    flex: 1,
    marginRight: 15,
  },
  podcastTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 5,
  },
  podcastDescription: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.8,
    marginBottom: 10,
  },
  podcastMeta: {
    flexDirection: 'row',
    gap: 15,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  metaIcon: {
    fontSize: 12,
  },
  metaText: {
    fontSize: 12,
    color: '#FFFFFF',
    opacity: 0.7,
  },
  podcastActions: {
    alignItems: 'center',
    gap: 10,
  },
  playButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playIcon: {
    color: '#FFFFFF',
    fontSize: 16,
    marginLeft: 2,
  },
  featuredBadge: {
    backgroundColor: '#AE8EFF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  featuredBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#000000',
  },
  archiveInfo: {
    margin: 20,
    padding: 15,
    backgroundColor: 'rgba(174, 142, 255, 0.1)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(174, 142, 255, 0.3)',
  },
  archiveTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#AE8EFF',
    marginBottom: 5,
  },
  archiveDescription: {
    fontSize: 12,
    color: '#FFFFFF',
    opacity: 0.8,
    lineHeight: 16,
  },
});
