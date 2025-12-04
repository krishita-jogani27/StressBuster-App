# StressBuster Expo - Quick Start Guide

## 📱 Run with Expo Go (Easiest Method!)

### Step 1: Install Expo Go App on Your Phone

**Android:**
- Open Google Play Store
- Search for "Expo Go"
- Install the app

**iPhone:**
- Open App Store
- Search for "Expo Go"
- Install the app

### Step 2: Install Dependencies

Open terminal and run:

```bash
cd "C:\Users\krish\OneDrive\Desktop\StressBuster App\mobile-expo"
npm install
```

**Expected Output:**
```
added 800+ packages in 2-3 minutes
```

### Step 3: Start Backend API (Required!)

**Open a NEW terminal** and run:

```bash
cd "C:\Users\krish\OneDrive\Desktop\StressBuster App\backend"
npm start
```

**Make sure you see:**
```
✅ Database connected successfully!
📡 Server running on port: 5000
```

### Step 4: Update API URL for Your Network

Find your computer's IP address:

```bash
ipconfig
```

Look for "IPv4 Address" (e.g., `192.168.1.5`)

Edit `mobile-expo\src\services\api.js`:

```javascript
// Change this line:
const API_BASE_URL = 'http://localhost:5000/api';

// To your computer's IP:
const API_BASE_URL = 'http://192.168.1.5:5000/api';  // Use YOUR IP!
```

**Important:** Your phone and computer must be on the SAME WiFi network!

### Step 5: Start Expo

```bash
cd "C:\Users\krish\OneDrive\Desktop\StressBuster App\mobile-expo"
npx expo start
```

**Expected Output:**
```
Starting Metro Bundler

› Metro waiting on exp://192.168.1.5:8081
› Scan the QR code above with Expo Go (Android) or the Camera app (iOS)

› Press a │ open Android
› Press i │ open iOS simulator
› Press w │ open web

› Press r │ reload app
› Press m │ toggle menu
```

### Step 6: Scan QR Code with Expo Go

1. **Open Expo Go app** on your phone
2. **Tap "Scan QR Code"**
3. **Point camera at the QR code** in your terminal
4. **Wait for app to load** (30-60 seconds first time)

**The app will open on your phone!** 🎉

---

## 🎮 Testing the App

### What You Should See:

1. **Home Screen** with:
   - Purple header "Welcome to StressBuster"
   - 4 colorful quick access cards
   - Emergency helplines
   - Featured resources

2. **Bottom Navigation** with 5 tabs:
   - Home 🏠
   - Chat 💬
   - Appointments 📅
   - Resources 📚
   - Games 🎮

### Try These Features:

**1. Chatbot:**
- Tap "Chat" tab
- Type: "I'm feeling stressed"
- Bot responds with coping strategies

**2. Games:**
- Tap "Games" tab
- Try "Breathing Exercise"
- Watch the animated circle
- Follow breathing instructions

**3. Appointments:**
- Tap "Appointments" tab
- See list of counselors
- Select one to view time slots

**4. Resources:**
- Tap "Resources" tab
- Browse educational content
- Filter by category

---

## 🔄 Making Changes

When you edit code:

1. **Save the file**
2. **Shake your phone** or press `r` in terminal
3. **App reloads automatically!**

---

## 🐛 Troubleshooting

### QR Code Not Working

**Solution 1:** Type your phone's IP manually in Expo Go
- In Expo Go, tap "Enter URL manually"
- Type: `exp://192.168.1.5:8081` (use YOUR computer's IP)

**Solution 2:** Use tunnel mode
```bash
npx expo start --tunnel
```

### "Network Request Failed"

**Problem:** App can't connect to backend

**Solution:**
1. Check backend is running (Terminal 1)
2. Verify API URL in `api.js` has your computer's IP
3. Make sure phone and computer are on same WiFi
4. Turn off firewall temporarily

### "Unable to Resolve Module"

**Solution:**
```bash
# Clear cache
npx expo start -c

# Or reinstall
rm -rf node_modules
npm install
```

### App Crashes on Startup

**Solution:**
1. Check terminal for error messages
2. Make sure all dependencies installed
3. Try clearing cache: `npx expo start -c`

---

## 📊 Viewing Data

While app is running, you can check database:

```bash
mysql -u root -p
USE stress_buster;

-- See chatbot messages
SELECT * FROM chatbot_conversations ORDER BY created_at DESC LIMIT 10;

-- See game sessions
SELECT * FROM game_sessions ORDER BY created_at DESC LIMIT 10;
```

---

## 🎯 Quick Commands

```bash
# Start Expo
npx expo start

# Start with clear cache
npx expo start -c

# Start in tunnel mode (if same WiFi not working)
npx expo start --tunnel

# Stop Expo
Ctrl + C
```

---

## ✅ Success Checklist

- [x] Expo Go installed on phone
- [x] Dependencies installed (`npm install`)
- [x] Backend API running on port 5000
- [x] API URL updated with computer's IP
- [x] Phone and computer on same WiFi
- [x] QR code scanned
- [x] App loaded on phone

---

## 🌟 Advantages of Expo

✅ **No Android Studio needed**
✅ **Instant reload** - see changes immediately
✅ **Easy sharing** - send QR code to friends
✅ **Works on both** Android and iPhone
✅ **Faster development** - no build time

---

## 📱 What's Different from React Native CLI?

| Feature | React Native CLI | Expo |
|---------|-----------------|------|
| Setup | Complex | Simple |
| Run on Phone | Build APK or USB | Scan QR code |
| Reload | Manual | Automatic |
| Icons | react-native-vector-icons | @expo/vector-icons |
| Build Time | 5-10 minutes | Instant |

---

## 🚀 Next Steps

1. **Test all features** on your phone
2. **Make changes** to code and see instant updates
3. **Share with friends** - they can scan the same QR code!
4. **Build standalone app** when ready:
   ```bash
   eas build --platform android
   ```

---

## 💡 Pro Tips

1. **Shake phone** to open developer menu
2. **Enable Fast Refresh** for instant updates
3. **Use Expo Go** for quick testing
4. **Build APK** for sharing with non-developers

---

## 🆘 Need Help?

If something doesn't work:

1. Check both terminals are running (backend + expo)
2. Verify you're on same WiFi
3. Check API URL has correct IP
4. Try clearing cache: `npx expo start -c`
5. Restart Expo: Ctrl+C, then `npx expo start`

Enjoy your StressBuster app on your phone! 📱✨
