# Vyapix Mobile App

Production-ready React Native mobile application for Vyapix, built with Expo.

## Features

- 📱 Native iOS and Android support
- 🔐 JWT authentication with secure token storage
- 🎨 Modern UI matching web app design
- 🔄 Auto-login functionality
- 📡 Backend integration with cooking-hard.onrender.com
- ⚡ Built with Expo for easy deployment

## Tech Stack

- React Native
- Expo (managed workflow)
- React Navigation
- Axios
- AsyncStorage

## Getting Started

### Prerequisites

- Node.js 16+ installed
- Expo CLI (`npm install -g expo-cli`)
- iOS Simulator (Mac) or Android Emulator

### Installation

```bash
# Install dependencies
npm install

# Start development server
npx expo start

# Run on iOS
npx expo start --ios

# Run on Android
npx expo start --android
```

## Project Structure

```
src/
├── api/              # API service layer
├── components/       # Reusable UI components
├── context/          # React Context (Auth)
├── navigation/       # Navigation setup
├── screens/          # App screens
├── theme/            # Theme configuration
└── utils/            # Utilities (storage, constants)
```

## Backend Integration

The app connects to the existing backend at:
- **Base URL**: `https://cooking-hard.onrender.com`
- **Authentication**: JWT with Bearer token
- **Token Storage**: AsyncStorage

## Building for Production

```bash
# Build for Android
eas build --platform android

# Build for iOS
eas build --platform ios
```

## License

Private - All rights reserved
