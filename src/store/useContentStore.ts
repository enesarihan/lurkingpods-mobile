import { create } from 'zustand';
import ApiService from '../services/api';

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

interface ContentState {
  podcasts: Podcast[];
  categories: Category[];
  dailyMix: Podcast[];
  currentPodcast: Podcast | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  isLoading: boolean;
  error: string | null;
  nextUpdate: Date | null;
}

interface ContentActions {
  setPodcasts: (podcasts: Podcast[]) => void;
  setCategories: (categories: Category[]) => void;
  setDailyMix: (podcasts: Podcast[]) => void;
  setCurrentPodcast: (podcast: Podcast | null) => void;
  setPlaying: (playing: boolean) => void;
  setCurrentTime: (time: number) => void;
  setDuration: (duration: number) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setNextUpdate: (date: Date) => void;
  addPodcast: (podcast: Podcast) => void;
  updatePodcast: (id: string, updates: Partial<Podcast>) => void;
  removePodcast: (id: string) => void;
  clearError: () => void;
  fetchDailyMix: () => Promise<void>;
  fetchCategories: () => Promise<void>;
  fetchPodcastsByCategory: (categoryId: string, language?: 'en' | 'tr') => Promise<void>;
}

type ContentStore = ContentState & ContentActions;

export const useContentStore = create<ContentStore>((set, get) => ({
  // State
  podcasts: [],
  categories: [],
  dailyMix: [],
  currentPodcast: null,
  isPlaying: false,
  currentTime: 0,
  duration: 0,
  isLoading: false,
  error: null,
  nextUpdate: null,

  // Actions
  setPodcasts: (podcasts: Podcast[]) => {
    set({ podcasts });
  },

  setCategories: (categories: Category[]) => {
    set({ categories });
  },

  setDailyMix: (podcasts: Podcast[]) => {
    set({ dailyMix: podcasts });
  },

  setCurrentPodcast: (podcast: Podcast | null) => {
    set({ currentPodcast: podcast });
  },

  setPlaying: (playing: boolean) => {
    set({ isPlaying: playing });
  },

  setCurrentTime: (time: number) => {
    set({ currentTime: time });
  },

  setDuration: (duration: number) => {
    set({ duration });
  },

  setLoading: (loading: boolean) => {
    set({ isLoading: loading });
  },

  setError: (error: string | null) => {
    set({ error });
  },

  setNextUpdate: (date: Date) => {
    set({ nextUpdate: date });
  },

  addPodcast: (podcast: Podcast) => {
    const { podcasts } = get();
    set({ podcasts: [...podcasts, podcast] });
  },

  updatePodcast: (id: string, updates: Partial<Podcast>) => {
    const { podcasts } = get();
    const updatedPodcasts = podcasts.map(podcast =>
      podcast.id === id ? { ...podcast, ...updates } : podcast
    );
    set({ podcasts: updatedPodcasts });
  },

  removePodcast: (id: string) => {
    const { podcasts } = get();
    const filteredPodcasts = podcasts.filter(podcast => podcast.id !== id);
    set({ podcasts: filteredPodcasts });
  },

  clearError: () => {
    set({ error: null });
  },

  fetchDailyMix: async () => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await fetch('/api/content/daily-mix?language=en');
      
      if (!response.ok) {
        throw new Error('Failed to fetch daily mix');
      }

      const data = await response.json();
      
      set({
        dailyMix: data.podcasts,
        nextUpdate: new Date(data.next_update),
        isLoading: false,
      });
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch daily mix',
      });
    }
  },

  fetchCategories: async () => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await fetch('/api/content/categories?language=en');
      
      if (!response.ok) {
        throw new Error('Failed to fetch categories');
      }

      const data = await response.json();
      
      set({
        categories: data,
        isLoading: false,
      });
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch categories',
      });
    }
  },

  fetchPodcastsByCategory: async (categoryId: string, language: 'en' | 'tr' = 'en') => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await fetch(`/api/content/category/${categoryId}?language=${language}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch category podcasts');
      }

      const data = await response.json();
      
      set({
        podcasts: data.podcasts,
        isLoading: false,
      });
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch category podcasts',
      });
    }
  },
}));
