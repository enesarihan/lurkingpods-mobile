# LurkingPods Mobile App

AI-powered podcast platform mobile app built with React Native and Expo.

## Features

- 🤖 AI-generated daily podcasts
- 🎵 High-quality audio playback
- 🌍 Bilingual support (English/Turkish)
- 📱 Native mobile experience
- 🔐 Secure authentication
- 💳 In-app subscriptions
- 🔔 Push notifications
- 🎨 Glassmorphic design

## Tech Stack

- **Framework**: React Native with Expo
- **Language**: TypeScript
- **Styling**: NativeWind (Tailwind CSS)
- **Navigation**: React Navigation
- **State Management**: Zustand
- **Audio**: React Native Track Player
- **Animations**: Lottie, Reanimated
- **Notifications**: Expo Notifications
- **Payments**: React Native IAP

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Expo CLI
- iOS Simulator (for iOS development)
- Android Studio (for Android development)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd lurkingpods-mobile
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Run on your preferred platform:
```bash
# iOS
npm run ios

# Android
npm run android

# Web
npm run web
```

## Project Structure

```
src/
├── components/          # Reusable components
│   ├── AudioPlayer.tsx
│   ├── SubscriptionModal.tsx
│   └── NotificationBanner.tsx
├── screens/            # Screen components
│   ├── AuthScreen.tsx
│   ├── HomeScreen.tsx
│   ├── CategoryScreen.tsx
│   ├── PlayerScreen.tsx
│   └── ProfileScreen.tsx
├── navigation/         # Navigation setup
│   └── AppNavigator.tsx
├── store/             # State management
│   ├── useAuthStore.ts
│   └── useContentStore.ts
├── services/          # API services
└── assets/            # Images, animations, etc.
```

## Key Features

### Authentication
- Email/password registration
- 2-day free trial
- Secure session management
- Language preference selection

### Content Discovery
- Daily AI-generated podcasts
- 6 content categories
- Bilingual content (EN/TR)
- Featured content highlighting

### Audio Player
- High-quality audio playback
- Real-time waveform visualization
- Speaker indicators
- Synchronized script display
- Playback controls

### Subscription System
- Monthly/Yearly plans
- In-app purchase integration
- Trial management
- Subscription status tracking

### Notifications
- Daily content notifications
- Trial expiry reminders
- Push notification support
- Customizable settings

## Design System

### Colors
- Primary: #AE8EFF (Purple)
- Background: #000000 (Black)
- Foreground: #FFFFFF (White)

### Typography
- Headers: Bold, large sizes
- Body: Regular, readable sizes
- Captions: Small, muted colors

### Components
- Glassmorphic cards with blur effects
- Gradient backgrounds
- Smooth animations
- Touch-friendly interactions

## Development

### Scripts

- `npm start` - Start Expo development server
- `npm run ios` - Run on iOS simulator
- `npm run android` - Run on Android emulator
- `npm run web` - Run on web browser
- `npm test` - Run tests
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues

### Environment Variables

Create a `.env` file in the root directory:

```env
# API Configuration
API_BASE_URL=https://your-api-url.com
API_VERSION=v1

# Feature Flags
ENABLE_ANALYTICS=true
ENABLE_CRASH_REPORTING=true
```

## Building for Production

### iOS

1. Configure app in Expo dashboard
2. Build with EAS:
```bash
eas build --platform ios
```

3. Submit to App Store:
```bash
eas submit --platform ios
```

### Android

1. Configure app in Expo dashboard
2. Build with EAS:
```bash
eas build --platform android
```

3. Submit to Google Play:
```bash
eas submit --platform android
```

## Testing

Run the test suite:
```bash
npm test
```

Run tests in watch mode:
```bash
npm run test:watch
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details
