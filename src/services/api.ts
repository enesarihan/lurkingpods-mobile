// API Service - HTTP Client
import { API_URL, API_CONFIG, handleApiError } from '../config/api';

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  headers?: Record<string, string>;
  body?: any;
  token?: string;
}

class ApiService {
  private baseUrl: string;
  private defaultHeaders: Record<string, string>;

  constructor() {
    this.baseUrl = API_URL;
    this.defaultHeaders = API_CONFIG.headers;
  }

  private async request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const { method = 'GET', headers = {}, body, token } = options;

    const config: RequestInit = {
      method,
      headers: {
        ...this.defaultHeaders,
        ...headers,
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    };

    if (body) {
      config.body = JSON.stringify(body);
    }

    try {
      console.log('API Request:', method, `${this.baseUrl}${endpoint}`);
      
      const response = await fetch(`${this.baseUrl}${endpoint}`, config);
      
      console.log('API Response:', response.status, response.statusText);
      
      if (!response.ok) {
        const error = await response.json().catch(() => ({ error: response.statusText }));
        console.error('API Error:', error);
        throw new Error(error.error || `HTTP ${response.status}`);
      }

      const data = await response.json();
      console.log('API Success:', data);
      return data;
    } catch (error: any) {
      console.error('API Exception:', error);
      if (error.message === 'Network request failed') {
        throw new Error('Internet bağlantınızı kontrol edin. API\'ye erişilemiyor.');
      }
      throw new Error(handleApiError(error));
    }
  }

  // Auth endpoints
  async register(email: string, password: string, languagePreference: 'en' | 'tr') {
    return this.request('/auth/register', {
      method: 'POST',
      body: { email, password, language_preference: languagePreference },
    });
  }

  async login(email: string, password: string) {
    return this.request('/auth/login', {
      method: 'POST',
      body: { email, password },
    });
  }

  async logout(token: string) {
    return this.request('/auth/logout', {
      method: 'POST',
      token,
    });
  }

  async getMe(token: string) {
    return this.request('/auth/me', {
      method: 'GET',
      token,
    });
  }

  // Content endpoints
  async getDailyMix(language: 'en' | 'tr', token?: string) {
    return this.request(`/content/daily-mix?language=${language}`, {
      method: 'GET',
      token,
    });
  }

  async getCategories(language: 'en' | 'tr', token?: string) {
    return this.request(`/content/categories?language=${language}`, {
      method: 'GET',
      token,
    });
  }

  async getCategoryPodcasts(categoryId: string, language: 'en' | 'tr', token?: string) {
    return this.request(`/content/categories/${categoryId}/podcasts?language=${language}`, {
      method: 'GET',
      token,
    });
  }

  async getPodcast(podcastId: string, token?: string) {
    return this.request(`/content/podcasts/${podcastId}`, {
      method: 'GET',
      token,
    });
  }

  async recordPlay(podcastId: string, token: string) {
    return this.request(`/content/podcasts/${podcastId}/play`, {
      method: 'POST',
      token,
    });
  }

  // Subscription endpoints
  async getSubscriptionStatus(token: string) {
    return this.request('/subscription/status', {
      method: 'GET',
      token,
    });
  }

  async getSubscriptionPlans() {
    return this.request('/subscription/plans', {
      method: 'GET',
    });
  }

  async purchaseSubscription(token: string, platform: 'ios' | 'android', receiptData: string) {
    return this.request('/subscription/purchase', {
      method: 'POST',
      token,
      body: { platform, receipt_data: receiptData },
    });
  }

  async cancelSubscription(token: string) {
    return this.request('/subscription/cancel', {
      method: 'POST',
      token,
    });
  }

  async restoreSubscription(token: string, platform: 'ios' | 'android', receiptData: string) {
    return this.request('/subscription/restore', {
      method: 'POST',
      token,
      body: { platform, receipt_data: receiptData },
    });
  }

  // User preferences endpoints
  async getPreferences(token: string) {
    return this.request('/user/preferences', {
      method: 'GET',
      token,
    });
  }

  async updatePreferences(token: string, preferences: any) {
    return this.request('/user/preferences', {
      method: 'PUT',
      token,
      body: preferences,
    });
  }

  // Notifications endpoints
  async getNotifications(token: string) {
    return this.request('/user/notifications', {
      method: 'GET',
      token,
    });
  }

  async markNotificationRead(token: string, notificationId: string) {
    return this.request(`/user/notifications/${notificationId}`, {
      method: 'PUT',
      token,
      body: { is_read: true },
    });
  }
}

export default new ApiService();
