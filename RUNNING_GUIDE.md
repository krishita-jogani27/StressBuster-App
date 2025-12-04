# StressBuster App - Step-by-Step Execution Guide

This guide will walk you through running the entire application and seeing the output at each step.

---

## 📋 Prerequisites Check

Before starting, verify you have everything installed:

### 1. Check Node.js
```bash
node --version
```
**Expected Output:** `v16.x.x` or higher

### 2. Check MySQL
```bash
mysql --version
```
**Expected Output:** `mysql  Ver 8.0.x`

---

## 💾 PART 1: Database Setup (MySQL)

### Step 1: Start MySQL Server

**On Windows:**
```bash
# Open Command Prompt as Administrator
net start MySQL80
```

**Expected Output:**
```
The MySQL80 service is starting.
The MySQL80 service was started successfully.
```

### Step 2: Login to MySQL

```bash
mysql -u root -p
```

**It will ask for password** - Enter your MySQL root password

**Expected Output:**
```
Welcome to the MySQL monitor.
mysql>
```

### Step 3: Create Database

While in MySQL prompt, run:

```sql
SOURCE C:\Users\krish\OneDrive\Desktop\StressBuster App\database\schema.sql
```

**Expected Output:**
```
Query OK, 1 row affected
Database changed
Query OK, 0 rows affected
Query OK, 0 rows affected
...
+------------------------------------------+
| Status                                   |
+------------------------------------------+
| Database schema created successfully!    |
+------------------------------------------+
```

### Step 4: Import Seed Data

```sql
SOURCE C:\Users\krish\OneDrive\Desktop\StressBuster App\database\seed.sql
```

**Expected Output:**
```
Query OK, 5 rows affected
Query OK, 5 rows affected
...
+--------------------------------------+
| Status                               |
+--------------------------------------+
| Seed data inserted successfully!     |
+--------------------------------------+
+--------------+
| total_users  |
+--------------+
|            5 |
+--------------+
```

### Step 5: Verify Database

Check if all tables are created:

```sql
USE stress_buster;
SHOW TABLES;
```

**Expected Output:**
```
+---------------------------+
| Tables_in_stress_buster |
+---------------------------+
| admin_users               |
| appointments              |
| chatbot_conversations     |
| counselors                |
| feedback                  |
| game_sessions             |
| helpline_numbers          |
| notifications             |
| resource_categories       |
| resources                 |
| users                     |
+---------------------------+
11 rows in set
```

### Step 6: View Sample Data

Check users table:
```sql
SELECT id, username, email, full_name FROM users;
```

**Expected Output:**
```
+----+----------------+---------------------+----------------+
| id | username       | email               | full_name      |
+----+----------------+---------------------+----------------+
|  1 | john_doe       | john@example.com    | John Doe       |
|  2 | jane_smith     | jane@example.com    | Jane Smith     |
|  3 | anonymous_user | anon@example.com    | Anonymous User |
|  4 | raj_kumar      | raj@example.com     | Raj Kumar      |
|  5 | priya_sharma   | priya@example.com   | Priya Sharma   |
+----+----------------+---------------------+----------------+
```

Check counselors:
```sql
SELECT id, name, specialization, rating FROM counselors;
```

**Expected Output:**
```
+----+-------------------+---------------------------+--------+
| id | name              | specialization            | rating |
+----+-------------------+---------------------------+--------+
|  1 | Dr. Sarah Johnson | Anxiety & Depression      |   4.80 |
|  2 | Dr. Michael Chen  | Stress Management         |   4.60 |
|  3 | Dr. Anita Desai   | Relationship Counseling   |   4.90 |
|  4 | Dr. Rahul Mehta   | Youth & Student Counseling|   4.70 |
|  5 | Dr. Kavita Patel  | Trauma & PTSD             |   4.90 |
+----+-------------------+---------------------------+--------+
```

You can now exit MySQL:
```sql
EXIT;
```

---

## 🚀 PART 2: Backend API Setup

### Step 1: Open New Terminal/Command Prompt

Navigate to backend folder:
```bash
cd "C:\Users\krish\OneDrive\Desktop\StressBuster App\backend"
```

### Step 2: Install Dependencies

```bash
npm install
```

**Expected Output:**
```
added 150 packages, and audited 151 packages in 15s

20 packages are looking for funding
  run `npm fund` for details

found 0 vulnerabilities
```

This will take 1-2 minutes. You'll see packages being installed.

### Step 3: Create .env File

```bash
copy .env.example .env
```

**Expected Output:**
```
        1 file(s) copied.
```

### Step 4: Edit .env File

Open `.env` file in notepad:
```bash
notepad .env
```

**Update this line with YOUR MySQL password:**
```env
DB_PASSWORD=your_actual_mysql_password_here
```

For example, if your MySQL password is `mypass123`, change it to:
```env
DB_PASSWORD=mypass123
```

**Save and close** the file (Ctrl+S, then close)

### Step 5: Start Backend Server

```bash
npm start
```

**Expected Output:**
```
> stressbuster-backend@1.0.0 start
> node server.js

✅ Database connected successfully!
📊 Connected to database: stress_buster
==================================================
🚀 StressBuster Backend API Server
==================================================
📡 Server running on port: 5000
🌍 Environment: development
🔗 API URL: http://localhost:5000/api
💚 Health check: http://localhost:5000/api/health
==================================================
Available endpoints:
  - POST   /api/auth/register
  - POST   /api/auth/login
  - GET    /api/chatbot/conversation/:sessionId
  - POST   /api/chatbot/message
  - GET    /api/appointments
  - POST   /api/appointments
  - GET    /api/resources
  - GET    /api/games/sessions
  - POST   /api/games/sessions
  - GET    /api/admin/analytics
  - GET    /api/helplines
==================================================
```

**✅ SUCCESS!** If you see this, your backend is running!

### Step 6: Test Backend in Browser

**Keep the backend running** and open your browser.

Visit: `http://localhost:5000/api/health`

**Expected Output in Browser:**
```json
{
  "status": "success",
  "message": "StressBuster API is running",
  "timestamp": "2025-12-02T14:41:01.000Z",
  "environment": "development"
}
```

### Step 7: Test More Endpoints

**Get Helplines:**
Visit: `http://localhost:5000/api/helplines`

**Expected Output:**
```json
{
  "status": "success",
  "message": "Helpline numbers retrieved successfully",
  "data": [
    {
      "id": 1,
      "name": "National Mental Health Helpline",
      "phone": "1800-599-0019",
      "description": "Free mental health support and counseling",
      "category": "mental_health",
      "available_hours": "24/7",
      "language_support": "English, Hindi, Tamil, Telugu",
      "is_toll_free": 1,
      "country_code": "+91"
    },
    ...
  ]
}
```

**Get Counselors:**
Visit: `http://localhost:5000/api/appointments/counselors`

You should see the list of 5 counselors!

---

## 📱 PART 3: Mobile App Setup

### Step 1: Open NEW Terminal (Keep Backend Running!)

**Important:** Don't close the backend terminal. Open a NEW terminal.

Navigate to mobile folder:
```bash
cd "C:\Users\krish\OneDrive\Desktop\StressBuster App\mobile"
```

### Step 2: Install Dependencies

```bash
npm install
```

**Expected Output:**
```
added 800+ packages in 2m

100 packages are looking for funding
```

This will take 3-5 minutes as React Native has many dependencies.

### Step 3: Update API URL (Important for Android Emulator)

Open `mobile\src\services\api.js` and find this line:

```javascript
const API_BASE_URL = 'http://localhost:5000/api';
```

**If using Android Emulator**, change to:
```javascript
const API_BASE_URL = 'http://10.0.2.2:5000/api';
```

**If using Real Android Device**, change to your computer's IP:
```javascript
const API_BASE_URL = 'http://192.168.1.X:5000/api';  // Replace X with your IP
```

To find your IP on Windows:
```bash
ipconfig
```
Look for "IPv4 Address" under your WiFi adapter.

### Step 4: Start Metro Bundler

```bash
npm start
```

**Expected Output:**
```
                ######                ######
              ###     ####        ####     ###
            ##          ###    ###          ##
            ##             ####             ##
            ##             ####             ##
            ##           ##    ##           ##
            ##         ###      ###         ##
              ###     ####        ####     ###
                ######                ######

               Welcome to React Native!

To reload the app press "r"
To open developer menu press "d"

BUNDLE  ./index.js

LOG  Running "StressBusterMobile" with {"rootTag":1}
```

### Step 5: Run on Android (in another NEW terminal)

**Open another NEW terminal** (3rd terminal total):

```bash
cd "C:\Users\krish\OneDrive\Desktop\StressBuster App\mobile"
npm run android
```

**Expected Output:**
```
info Launching emulator...
info Successfully launched emulator.
info Installing the app...

> Task :app:installDebug
Installing APK 'app-debug.apk' on 'Pixel_5_API_30'

BUILD SUCCESSFUL in 45s
```

**The app will launch on your Android emulator/device!**

### What You Should See in the App:

1. **Home Screen** with:
   - "Welcome to StressBuster" header
   - 4 quick access cards (AI Chat, Book Counseling, Stress Games, Resources)
   - Emergency helplines section
   - Featured resources
   - Daily wellness tip

2. **Bottom Navigation** with 5 tabs:
   - Home
   - Chat
   - Appointments
   - Resources
   - Games

### Step 6: Test Features

**Test Chatbot:**
1. Tap "Chat" tab
2. Type: "I'm feeling stressed"
3. Bot should respond with stress management tips

**Test Appointments:**
1. Tap "Appointments" tab
2. You should see 5 counselors
3. Tap on "Dr. Sarah Johnson"
4. You should see available time slots

**Test Games:**
1. Tap "Games" tab
2. Tap "Breathing Exercise"
3. Tap "Start" button
4. You should see animated breathing circle

---

## 🖥️ PART 4: Admin Dashboard

### Step 1: Open NEW Terminal (4th terminal)

Navigate to admin dashboard:
```bash
cd "C:\Users\krish\OneDrive\Desktop\StressBuster App\admin-dashboard"
```

### Step 2: Install Dependencies

```bash
npm install
```

**Expected Output:**
```
added 1500+ packages in 3m
```

### Step 3: Start Dashboard

```bash
npm start
```

**Expected Output:**
```
Compiled successfully!

You can now view stressbuster-admin in the browser.

  Local:            http://localhost:3000
  On Your Network:  http://192.168.1.X:3000

Note that the development build is not optimized.
To create a production build, use npm run build.

webpack compiled successfully
```

**Browser will automatically open** at `http://localhost:3000`

### Step 4: Login to Dashboard

**Login Credentials:**
- Email: `admin@stressbuster.com`
- Password: `Admin@123`

**After login, you should see:**

1. **4 Stat Cards:**
   - Active Users: 5
   - Today's Chat Queries: 8
   - Confirmed Appointments: 6
   - Today's Game Sessions: 8

2. **Line Chart:** Chatbot Queries (Last 7 Days)

3. **Bar Chart:** Game Engagement

4. **Table:** Popular Resources with view counts

---

## 📊 Summary - All Running Services

You should now have **4 terminals running**:

### Terminal 1: Backend API
```
📡 Server running on port: 5000
```

### Terminal 2: Metro Bundler (Mobile)
```
Welcome to React Native!
```

### Terminal 3: Android Build (Mobile)
```
BUILD SUCCESSFUL
```

### Terminal 4: Admin Dashboard
```
webpack compiled successfully
```

**And 2 applications open:**
- Mobile app on Android emulator/device
- Admin dashboard in browser at `http://localhost:3000`

---

## 🧪 Testing Complete Flow

### Test 1: Register New User (Mobile App)

1. In mobile app, tap "Profile" icon (if visible) or navigate to register
2. Fill in:
   - Username: `testuser`
   - Email: `test@example.com`
   - Password: `Test@123`
3. Tap "Register"
4. You should be logged in!

### Test 2: Use Chatbot

1. Go to "Chat" tab
2. Send messages:
   - "I'm anxious"
   - "I need help"
   - "Can I talk to someone?"
3. Bot should respond with appropriate support

### Test 3: Book Appointment

1. Go to "Appointments" tab
2. Select a counselor
3. Choose tomorrow's date
4. Select a time slot
5. Tap "Book Appointment"
6. You should see success message

### Test 4: Play Games

**Breathing Game:**
1. Go to "Games" tab
2. Tap "Breathing Exercise"
3. Tap "Start"
4. Watch the circle expand and contract
5. Follow the breathing instructions

**Tap to Relax:**
1. Tap "Tap to Relax"
2. Tap "Start Game"
3. Tap the circle as many times as possible in 60 seconds
4. See your score

**Memory Puzzle:**
1. Tap "Memory Puzzle"
2. Tap "Start Game"
3. Tap cards to match pairs
4. Complete the puzzle

### Test 5: View in Database

Go back to MySQL:
```bash
mysql -u root -p
USE stress_buster;
```

**Check new user:**
```sql
SELECT * FROM users WHERE email = 'test@example.com';
```

**Check chatbot conversations:**
```sql
SELECT * FROM chatbot_conversations ORDER BY created_at DESC LIMIT 5;
```

**Check appointments:**
```sql
SELECT a.*, c.name as counselor_name 
FROM appointments a 
JOIN counselors c ON a.counselor_id = c.id 
ORDER BY a.created_at DESC LIMIT 5;
```

**Check game sessions:**
```sql
SELECT * FROM game_sessions ORDER BY created_at DESC LIMIT 5;
```

### Test 6: View in Admin Dashboard

1. Refresh admin dashboard (F5)
2. Stats should update with new data
3. Charts should show new activity

---

## 🔍 Troubleshooting

### Backend won't start
**Error:** `Database connection failed`
- Check MySQL is running: `net start MySQL80`
- Check password in `.env` file
- Verify database exists: `SHOW DATABASES;` in MySQL

### Mobile app won't connect to API
**Error:** `Network request failed`
- Check backend is running (Terminal 1)
- Update API URL in `api.js` to `http://10.0.2.2:5000/api` for Android emulator
- Check firewall isn't blocking port 5000

### Android build fails
**Error:** `SDK location not found`
- Install Android Studio
- Set ANDROID_HOME environment variable

### Admin dashboard shows no data
- Check backend is running
- Check browser console for errors (F12)
- Verify you're logged in

---

## 🎉 Success Checklist

✅ MySQL database created with 11 tables
✅ Backend API running on port 5000
✅ Mobile app running on Android
✅ Admin dashboard accessible in browser
✅ Can register/login users
✅ Chatbot responds to messages
✅ Can book appointments
✅ Games are playable
✅ Admin can view analytics
✅ Data is stored in database

---

## 📸 What You Should See

### Mobile App Home Screen:
- Purple header with "Welcome to StressBuster"
- 4 colorful quick access cards
- Emergency helplines with phone numbers
- Featured resources section
- Daily tip card at bottom

### Chatbot Screen:
- Messages in chat bubbles
- User messages on right (purple)
- Bot messages on left (white)
- Input field at bottom with send button

### Games Screen:
- 3 game cards with icons
- Breathing Exercise (blue)
- Tap to Relax (pink)
- Memory Puzzle (green)

### Admin Dashboard:
- Clean white interface
- Purple header
- 4 stat cards with numbers
- Line chart showing trends
- Bar chart for games
- Table with resource data

---

## 💡 Tips

1. **Keep all terminals open** while testing
2. **Use Ctrl+C** to stop any server
3. **Check backend terminal** for API logs
4. **Use browser DevTools (F12)** to debug admin dashboard
5. **Use React Native Debugger** for mobile app debugging

---

## 🆘 Need Help?

If something doesn't work:
1. Check all 4 terminals are running
2. Verify MySQL is running
3. Check `.env` file has correct password
4. Restart backend: Ctrl+C, then `npm start`
5. Restart mobile: Ctrl+C in Metro terminal, then `npm start`

Enjoy testing your StressBuster app! 🌟
