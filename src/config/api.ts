// API Configuration
const ENV = process.env.NODE_ENV || 'development';

const API_URLS = {
  development: 'https://lurkingpods-api.vercel.app', // Expo Go için production API kullanıyoruz
  production: 'https://lurkingpods-api.vercel.app',
};

export const API_URL = API_URLS[ENV as keyof typeof API_URLS] || API_URLS.production;

// API Endpoints
export const ENDPOINTS = {
  // Auth
  AUTH_REGISTER: '/auth/register',
  AUTH_LOGIN: '/auth/login',
  AUTH_LOGOUT: '/auth/logout',
  AUTH_ME: '/auth/me',
  
  // Content
  CONTENT_DAILY_MIX: '/content/daily-mix',
  CONTENT_CATEGORIES: '/content/categories',
  CONTENT_CATEGORY_PODCASTS: (categoryId: string) => `/content/categories/${categoryId}/podcasts`,
  CONTENT_PODCAST: (podcastId: string) => `/content/podcasts/${podcastId}`,
  CONTENT_PODCAST_PLAY: (podcastId: string) => `/content/podcasts/${podcastId}/play`,
  
  // Subscription
  SUBSCRIPTION_STATUS: '/subscription/status',
  SUBSCRIPTION_PLANS: '/subscription/plans',
  SUBSCRIPTION_PURCHASE: '/subscription/purchase',
  SUBSCRIPTION_CANCEL: '/subscription/cancel',
  SUBSCRIPTION_RESTORE: '/subscription/restore',
  
  // User
  USER_PREFERENCES: '/user/preferences',
  USER_NOTIFICATIONS: '/user/notifications',
  USER_NOTIFICATION_UPDATE: (notificationId: string) => `/user/notifications/${notificationId}`,
};

// API Client Configuration
export const API_CONFIG = {
  timeout: 30000, // 30 seconds
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
};

// Helper function to build full URL
export const buildUrl = (endpoint: string, params?: Record<string, string>): string => {
  let url = `${API_URL}${endpoint}`;
  
  if (params) {
    const queryString = Object.entries(params)
      .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
      .join('&');
    url += `?${queryString}`;
  }
  
  return url;
};

// Helper function to handle API errors
export const handleApiError = (error: any): string => {
  if (error.response) {
    // Server responded with error
    return error.response.data?.error || error.response.statusText || 'Server error occurred';
  } else if (error.request) {
    // Request made but no response
    return 'Network error. Please check your connection.';
  } else {
    // Something else happened
    return error.message || 'An unexpected error occurred';
  }
};

export default {
  API_URL,
  ENDPOINTS,
  API_CONFIG,
  buildUrl,
  handleApiError,
};
