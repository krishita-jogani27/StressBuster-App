# StressBuster Expo

React Native Expo version of the StressBuster mental health app.

## 🚀 Quick Start

### 1. Install Expo Go on your phone
- **Android**: [Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)
- **iOS**: [App Store](https://apps.apple.com/app/expo-go/id982107779)

### 2. Install dependencies
```bash
npm install
```

### 3. Start backend API (in another terminal)
```bash
cd ../backend
npm start
```

### 4. Update API URL
Edit `src/services/api.js` and change `localhost` to your computer's IP address.

Find your IP:
```bash
ipconfig  # Windows
```

### 5. Start Expo
```bash
npx expo start
```

### 6. Scan QR code with Expo Go app

That's it! The app will load on your phone.

## 📖 Full Guide

See [EXPO_GUIDE.md](./EXPO_GUIDE.md) for detailed instructions and troubleshooting.

## ✨ Features

All features from the main app:
- ✅ AI Chatbot
- ✅ Appointment Booking
- ✅ Resource Hub
- ✅ 3 Stress-Buster Games
- ✅ User Profiles

## 🔧 Requirements

- Node.js 16+
- Expo Go app on your phone
- Backend API running
- Same WiFi network

## 📱 Expo vs React Native CLI

**Expo Advantages:**
- ✅ No Android Studio needed
- ✅ Scan QR code to run
- ✅ Instant reload
- ✅ Easier to test

**React Native CLI Advantages:**
- ✅ More native control
- ✅ Smaller app size
- ✅ All libraries supported

## 🐛 Troubleshooting

**Can't connect to backend?**
- Update API URL in `src/services/api.js`
- Use your computer's IP, not `localhost`
- Ensure same WiFi network

**QR code not working?**
- Try tunnel mode: `npx expo start --tunnel`
- Or enter URL manually in Expo Go

See [EXPO_GUIDE.md](./EXPO_GUIDE.md) for more help.
