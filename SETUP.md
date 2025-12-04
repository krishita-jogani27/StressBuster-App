# StressBuster App - Complete Setup Guide

Welcome to the StressBuster mental health application! This guide will walk you through setting up the entire application step by step.

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Database Setup](#database-setup)
3. [Backend API Setup](#backend-api-setup)
4. [Mobile App Setup](#mobile-app-setup)
5. [Admin Dashboard Setup](#admin-dashboard-setup)
6. [Running the Application](#running-the-application)
7. [Troubleshooting](#troubleshooting)

---

## 🔧 Prerequisites

Before you begin, ensure you have the following installed:

### Required Software

- **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- **MySQL** (v8.0 or higher) - [Download](https://dev.mysql.com/downloads/)
- **React Native CLI** - Install with: `npm install -g react-native-cli`
- **Android Studio** (for Android development) - [Download](https://developer.android.com/studio)
- **Xcode** (for iOS development, Mac only) - [Download from App Store](https://apps.apple.com/us/app/xcode/id497799835)

### Optional

- **OpenAI API Key** (for enhanced chatbot) - [Get API Key](https://platform.openai.com/)

---

## 💾 Database Setup

### Step 1: Start MySQL Server

Ensure your MySQL server is running. You can start it using:

**Windows:**
```bash
net start MySQL80
```

**Mac/Linux:**
```bash
sudo systemctl start mysql
```

### Step 2: Create Database and Import Schema

1. Open MySQL command line or MySQL Workbench

2. Run the schema file:
```bash
mysql -u root -p < "C:\Users\krish\OneDrive\Desktop\StressBuster App\database\schema.sql"
```

3. Import seed data (dummy data for testing):
```bash
mysql -u root -p < "C:\Users\krish\OneDrive\Desktop\StressBuster App\database\seed.sql"
```

### Step 3: Verify Database Creation

```sql
USE stress_buster;
SHOW TABLES;
```

You should see 11 tables created successfully.

---

## 🚀 Backend API Setup

### Step 1: Navigate to Backend Directory

```bash
cd "C:\Users\krish\OneDrive\Desktop\StressBuster App\backend"
```

### Step 2: Install Dependencies

```bash
npm install
```

This will install all required packages including:
- Express.js
- MySQL2
- JWT
- Bcrypt
- CORS
- And more...

### Step 3: Configure Environment Variables

1. Copy the example environment file:
```bash
copy .env.example .env
```

2. Edit the `.env` file with your actual values:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password_here
DB_NAME=stress_buster

# Server Configuration
PORT=5000
NODE_ENV=development

# JWT Secret (change this to a random string)
JWT_SECRET=your_super_secret_jwt_key_12345

# Optional: OpenAI API Key
OPENAI_API_KEY=your_openai_api_key_here
```

**Important:** Replace `your_mysql_password_here` with your actual MySQL password!

### Step 4: Start the Backend Server

```bash
npm start
```

Or for development with auto-reload:
```bash
npm run dev
```

You should see:
```
✅ Database connected successfully!
🚀 StressBuster Backend API Server
📡 Server running on port: 5000
```

### Step 5: Test the API

Open your browser and visit: `http://localhost:5000/api/health`

You should see:
```json
{
  "status": "success",
  "message": "StressBuster API is running"
}
```

---

## 📱 Mobile App Setup

### Step 1: Navigate to Mobile Directory

```bash
cd "C:\Users\krish\OneDrive\Desktop\StressBuster App\mobile"
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Configure API URL

Edit `mobile/src/services/api.js` and update the API URL if your backend is running on a different address:

```javascript
const API_BASE_URL = 'http://localhost:5000/api';
// For Android emulator, use: 'http://10.0.2.2:5000/api'
// For real device, use your computer's IP: 'http://192.168.1.X:5000/api'
```

### Step 4: Install iOS Dependencies (Mac only)

```bash
cd ios
pod install
cd ..
```

### Step 5: Run the Mobile App

**For Android:**
1. Start Android emulator or connect Android device
2. Run:
```bash
npm run android
```

**For iOS (Mac only):**
1. Start iOS simulator or connect iPhone
2. Run:
```bash
npm run ios
```

The app should launch on your device/emulator!

---

## 🖥️ Admin Dashboard Setup

### Step 1: Navigate to Admin Dashboard Directory

```bash
cd "C:\Users\krish\OneDrive\Desktop\StressBuster App\admin-dashboard"
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Start the Dashboard

```bash
npm start
```

The dashboard will open in your browser at `http://localhost:3000`

### Step 4: Login to Dashboard

Use the default admin credentials from seed data:
- **Email:** `admin@stressbuster.com`
- **Password:** `Admin@123`

---

## ▶️ Running the Application

To run the complete application, you need to start all three components:

### Terminal 1: Backend API
```bash
cd backend
npm run dev
```

### Terminal 2: Mobile App
```bash
cd mobile
npm run android
# or
npm run ios
```

### Terminal 3: Admin Dashboard
```bash
cd admin-dashboard
npm start
```

---

## 🔍 Troubleshooting

### Database Connection Issues

**Problem:** `Database connection failed`

**Solution:**
1. Verify MySQL is running
2. Check your `.env` file has correct credentials
3. Ensure database `stress_buster` exists
4. Test connection: `mysql -u root -p`

### Backend Port Already in Use

**Problem:** `Port 5000 is already in use`

**Solution:**
1. Change `PORT` in `.env` file to another port (e.g., 5001)
2. Update mobile app API URL accordingly

### React Native Build Errors

**Problem:** Build fails on Android/iOS

**Solution:**
1. Clean build:
   ```bash
   cd android
   ./gradlew clean
   cd ..
   ```
2. Clear cache:
   ```bash
   npm start -- --reset-cache
   ```
3. Reinstall dependencies:
   ```bash
   rm -rf node_modules
   npm install
   ```

### Metro Bundler Issues

**Problem:** Metro bundler not starting

**Solution:**
```bash
npm start -- --reset-cache
```

### Admin Dashboard Not Loading

**Problem:** Dashboard shows blank page

**Solution:**
1. Check browser console for errors
2. Verify backend is running
3. Check CORS settings in backend

---

## 📝 Default Test Accounts

### Regular Users
- **Email:** `john@example.com`
- **Password:** `Test@123`

### Admin Users
- **Email:** `admin@stressbuster.com`
- **Password:** `Admin@123`

---

## 🎮 Testing the Features

### 1. Test Chatbot
1. Open mobile app
2. Navigate to "Chat" tab
3. Send a message like "I'm feeling stressed"
4. Bot should respond with coping strategies

### 2. Test Appointment Booking
1. Navigate to "Appointments" tab
2. Select a counselor
3. Choose a date and time
4. Book appointment

### 3. Test Games
1. Navigate to "Games" tab
2. Try each game:
   - Breathing Exercise
   - Tap to Relax
   - Memory Puzzle

### 4. Test Admin Dashboard
1. Login to admin dashboard
2. View analytics
3. Check chatbot queries
4. Review booking trends

---

## 📊 Database Connection String

If you need to connect to the database from other tools:

```
Host: localhost
Port: 3306
Database: stress_buster
Username: root
Password: [your password]
```

---

## 🔐 Security Notes

1. **Change default passwords** before deploying to production
2. **Update JWT_SECRET** to a strong random string
3. **Enable HTTPS** for production deployment
4. **Secure your database** with proper user permissions
5. **Never commit `.env` files** to version control

---

## 📞 Support

If you encounter any issues:

1. Check the console logs for error messages
2. Verify all prerequisites are installed
3. Ensure all services are running
4. Check firewall settings

---

## 🎉 Success!

If everything is set up correctly, you should now have:

✅ Backend API running on `http://localhost:5000`
✅ Mobile app running on your device/emulator
✅ Admin dashboard accessible at `http://localhost:3000`
✅ Database with sample data ready to use

Enjoy using StressBuster! 🌟
