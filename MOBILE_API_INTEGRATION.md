# Mobile API Integration Guide

## 🎯 Production API Entegrasyonu Tamamlandı!

### API Configuration

Production API URL: **https://lurkingpods-api.vercel.app**

## 📁 Oluşturulan Dosyalar

### 1. `src/config/api.ts`
- API URL konfigürasyonu (development & production)
- Tüm endpoint tanımlamaları
- URL builder ve error handler fonksiyonları

### 2. `src/services/api.ts`
- HTTP client servisi
- Tüm API endpoint'leri için hazır methodlar
- Auth, Content, Subscription, User servisleri

### 3. Updated Stores
- `src/store/useAuthStore.ts` - Production API'ye bağlandı
- `src/store/useContentStore.ts` - ApiService import'u eklendi

## 🚀 Kullanım Örnekleri

### Authentication

```typescript
import { useAuthStore } from './src/store/useAuthStore';

// Login
const { login } = useAuthStore();
await login('user@example.com', 'password123');

// Register
const { register } = useAuthStore();
await register('user@example.com', 'password123', 'en');

// Logout
const { logout } = useAuthStore();
logout();
```

### Content Loading

```typescript
import ApiService from './src/services/api';

// Get daily mix
const dailyMix = await ApiService.getDailyMix('en');

// Get categories
const categories = await ApiService.getCategories('en');

// Get category podcasts
const podcasts = await ApiService.getCategoryPodcasts('category-id', 'en');
```

### Subscription Management

```typescript
// Check subscription status
const status = await ApiService.getSubscriptionStatus(token);

// Get subscription plans
const plans = await ApiService.getSubscriptionPlans();

// Purchase subscription
await ApiService.purchaseSubscription(token, 'ios', receiptData);
```

## 🔧 Environment Configuration

### Development
```typescript
// Local API server
API_URL: 'http://localhost:3000'
```

### Production
```typescript
// Vercel deployment
API_URL: 'https://lurkingpods-api.vercel.app'
```

NODE_ENV otomatik olarak algılanır ve uygun URL kullanılır.

## 📱 Test Etme

### 1. Expo Development Server'ı Başlatın
```bash
cd mobile
npm start
```

### 2. API Bağlantısını Test Edin

Mobile app açıldığında:
- Health check otomatik yapılır
- Network tab'ında API isteklerini görebilirsiniz
- Error handling devrede olacak

### 3. Manuel Test

```typescript
// App.tsx veya test component'inde
import ApiService from './src/services/api';

useEffect(() => {
  const testAPI = async () => {
    try {
      const dailyMix = await ApiService.getDailyMix('en');
      console.log('Daily Mix:', dailyMix);
    } catch (error) {
      console.error('API Error:', error);
    }
  };
  
  testAPI();
}, []);
```

## 🔐 Token Management

### JWT Token Storage

```typescript
// useAuthStore otomatik olarak token'ı saklar
const { user, isAuthenticated } = useAuthStore();

// Token kullanımı
if (isAuthenticated && user?.token) {
  await ApiService.getMe(user.token);
}
```

### Token Refresh (Gelecek Özellik)

```typescript
// TODO: Implement token refresh mechanism
// - Check token expiry
// - Auto-refresh before expiry
// - Handle refresh failures
```

## 🌐 Network Error Handling

```typescript
try {
  await ApiService.login(email, password);
} catch (error) {
  // handleApiError otomatik olarak kullanıcı dostu mesaj döner
  console.error(error.message);
  // Örnek mesajlar:
  // - "Network error. Please check your connection."
  // - "Server error occurred"
  // - API'den gelen özel error mesajı
}
```

## 📊 API Response Format

### Successful Response
```typescript
{
  user: { ...userData },
  session: { token: "..." },
  trial_info: { ... }
}
```

### Error Response
```typescript
{
  error: "Error message here"
}
```

## 🔄 API Endpoints

### Auth
- `POST /auth/register` - Kullanıcı kaydı
- `POST /auth/login` - Giriş
- `POST /auth/logout` - Çıkış
- `GET /auth/me` - Mevcut kullanıcı bilgisi

### Content
- `GET /content/daily-mix?language=en` - Günlük karışım
- `GET /content/categories?language=en` - Kategoriler
- `GET /content/categories/{id}/podcasts` - Kategori podcast'leri
- `GET /content/podcasts/{id}` - Podcast detayı
- `POST /content/podcasts/{id}/play` - Play kaydı

### Subscription
- `GET /subscription/status` - Abonelik durumu
- `GET /subscription/plans` - Abonelik planları
- `POST /subscription/purchase` - Satın alma
- `POST /subscription/cancel` - İptal
- `POST /subscription/restore` - Geri yükleme

### User
- `GET /user/preferences` - Kullanıcı tercihleri
- `PUT /user/preferences` - Tercih güncelleme
- `GET /user/notifications` - Bildirimler
- `PUT /user/notifications/{id}` - Bildirim güncelleme

## ⚠️ Bilinen Kısıtlamalar

1. **Rate Limiting**: 
   - Her IP için 15 dakikada 100 istek
   - Auth endpoints: 15 dakikada 5 istek
   
2. **Timeout**:
   - Default: 30 saniye
   - Uzun işlemler için artırılabilir

3. **File Size**:
   - Max request size: 10MB

## 🐛 Debugging

### Network Inspector
```typescript
// Fetch requests otomatik olarak React Native debugger'da görünür
// Chrome DevTools → Network tab
```

### Console Logs
```typescript
// ApiService her istek için console log atar
// Error'lar otomatik olarak yakalanır ve loglanır
```

### Proxy Kullanımı (Opsiyonel)
```bash
# Charles Proxy veya Proxyman ile API isteklerini izleyin
# iOS: Settings → WiFi → HTTP Proxy
# Android: WiFi settings → Advanced → Proxy
```

## 🎯 Next Steps

- [ ] Token refresh mechanism ekle
- [ ] Offline support ekle (AsyncStorage cache)
- [ ] Retry mechanism ekle (network errors için)
- [ ] Request queue ekle (offline → online geçişte)
- [ ] Analytics tracking ekle
- [ ] Performance monitoring ekle

## 📚 Kaynaklar

- [React Native Networking](https://reactnative.dev/docs/network)
- [Zustand Documentation](https://github.com/pmndrs/zustand)
- [Expo Fetch API](https://docs.expo.dev/versions/latest/sdk/fetch/)
