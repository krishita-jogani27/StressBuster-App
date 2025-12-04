# StressBuster App - Complete Flow & Connection Guide

## 🎯 Overview - How Everything Connects

```
┌─────────────────────────────────────────────────────────────────┐
│                     YOUR STRESSBUSTER APP                        │
└─────────────────────────────────────────────────────────────────┘

    📱 Mobile App (Expo)          🖥️ Backend API          💾 Database
    ┌──────────────┐             ┌──────────────┐        ┌──────────┐
    │              │             │              │        │          │
    │  React       │────HTTP────▶│  Express.js  │───SQL──▶│  MySQL   │
    │  Native      │◀───JSON─────│  Node.js     │◀──Data──│          │
    │              │             │              │        │          │
    └──────────────┘             └──────────────┘        └──────────┘
         ↓                              ↓                      ↓
    Expo Go App                   Port 5000              Port 3306
    (Your Phone)                  localhost              localhost
```

---

## 📊 Complete Data Flow

### When You Use the App:

```
1. USER ACTION (Mobile App)
   ↓
   User taps "Chat" and types "I'm stressed"
   ↓
2. API REQUEST (Mobile → Backend)
   ↓
   POST http://192.168.1.X:5000/api/chatbot/message
   Body: { message: "I'm stressed", sessionId: "session_123" }
   ↓
3. BACKEND PROCESSING (Node.js)
   ↓
   - Receives request
   - Detects intent (stress)
   - Generates response
   ↓
4. DATABASE SAVE (Backend → MySQL)
   ↓
   INSERT INTO chatbot_conversations (user_id, message, sender, intent)
   VALUES (1, "I'm stressed", "user", "stress")
   ↓
5. RESPONSE SENT (Backend → Mobile)
   ↓
   JSON: { message: "Here are stress relief tips...", intent: "stress" }
   ↓
6. UI UPDATE (Mobile App)
   ↓
   Display bot response in chat bubble
```

---

## 🗄️ PART 1: Database Setup (Step-by-Step)

### Step 1: Check if MySQL is Installed

Open Command Prompt:
```bash
mysql --version
```

**✅ If you see:** `mysql  Ver 8.0.x`
→ MySQL is installed, proceed to Step 2

**❌ If you see:** `'mysql' is not recognized`
→ Install MySQL:
1. Download from: https://dev.mysql.com/downloads/installer/
2. Run installer
3. Choose "Developer Default"
4. Set root password (remember this!)
5. Complete installation

### Step 2: Start MySQL Service

```bash
# Open Command Prompt as Administrator
net start MySQL80
```

**Expected Output:**
```
The MySQL80 service is starting.
The MySQL80 service was started successfully.
```

### Step 3: Login to MySQL

```bash
mysql -u root -p
```

**It will prompt:** `Enter password:`
→ Type your MySQL root password (won't show while typing)

**Expected Output:**
```
Welcome to the MySQL monitor.  Commands end with ; or \g.
Your MySQL connection id is 8
Server version: 8.0.x

mysql>
```

**✅ You're now inside MySQL!**

### Step 4: Create Database

Copy and paste this command:

```sql
SOURCE C:\Users\krish\OneDrive\Desktop\StressBuster App\database\schema.sql
```

**What happens:**
1. Creates database `stress_buster`
2. Creates 11 tables
3. Sets up relationships

**Expected Output:**
```
Query OK, 1 row affected (0.01 sec)
Database changed
Query OK, 0 rows affected (0.05 sec)
Query OK, 0 rows affected (0.04 sec)
...
+------------------------------------------+
| Status                                   |
+------------------------------------------+
| Database schema created successfully!    |
+------------------------------------------+
```

### Step 5: Add Sample Data

```sql
SOURCE C:\Users\krish\OneDrive\Desktop\StressBuster App\database\seed.sql
```

**What happens:**
1. Adds 5 test users
2. Adds 5 counselors
3. Adds resources, helplines, etc.

**Expected Output:**
```
Query OK, 5 rows affected (0.02 sec)
Query OK, 5 rows affected (0.01 sec)
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

### Step 6: Verify Database is Ready

```sql
-- Check database exists
SHOW DATABASES;
```

**You should see:**
```
+--------------------+
| Database           |
+--------------------+
| stress_buster    |
| ...                |
+--------------------+
```

```sql
-- Use the database
USE stress_buster;

-- Check tables
SHOW TABLES;
```

**You should see 11 tables:**
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
```

### Step 7: View Sample Data

```sql
-- See users
SELECT id, username, email, full_name FROM users;
```

**Output:**
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

```sql
-- See counselors
SELECT id, name, specialization FROM counselors;
```

**Output:**
```
+----+-------------------+---------------------------+
| id | name              | specialization            |
+----+-------------------+---------------------------+
|  1 | Dr. Sarah Johnson | Anxiety & Depression      |
|  2 | Dr. Michael Chen  | Stress Management         |
|  3 | Dr. Anita Desai   | Relationship Counseling   |
|  4 | Dr. Rahul Mehta   | Youth & Student Counseling|
|  5 | Dr. Kavita Patel  | Trauma & PTSD             |
+----+-------------------+---------------------------+
```

**✅ Database is ready!** You can keep this MySQL window open or type `EXIT;` to close.

---

## 🔌 PART 2: Connecting Backend to Database

### Step 1: Open Backend Folder

```bash
cd "C:\Users\krish\OneDrive\Desktop\StressBuster App\backend"
```

### Step 2: Install Dependencies

```bash
npm install
```

**What this installs:**
- `express` - Web server
- `mysql2` - Database connector
- `bcrypt` - Password encryption
- `jsonwebtoken` - Authentication
- And more...

**Expected Output:**
```
added 150 packages in 30s
```

### Step 3: Configure Database Connection

Create `.env` file:
```bash
copy .env.example .env
```

Open `.env` in notepad:
```bash
notepad .env
```

**Edit these lines:**
```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=YOUR_MYSQL_PASSWORD_HERE    ← Change this!
DB_NAME=stress_buster
```

**Example:** If your MySQL password is `mypass123`:
```env
DB_PASSWORD=mypass123
```

**Save and close** (Ctrl+S, then close notepad)

### Step 4: How the Connection Works

The backend connects to MySQL using this file:
`backend/config/database.js`

**What it does:**
```javascript
// Creates connection pool
const pool = mysql.createPool({
  host: 'localhost',      // Where MySQL is running
  port: 3306,             // MySQL port
  user: 'root',           // MySQL username
  password: 'your_pass',  // From .env file
  database: 'stress_buster'  // Database name
});

// Test connection
const connection = await pool.getConnection();
console.log('✅ Database connected!');
```

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
```

**✅ Backend is connected to database!**

### Step 6: Test the Connection

Open browser and visit:
```
http://localhost:5000/api/health
```

**You should see:**
```json
{
  "status": "success",
  "message": "StressBuster API is running",
  "timestamp": "2025-12-03T11:58:05.000Z",
  "environment": "development"
}
```

**Test database query:**
```
http://localhost:5000/api/helplines
```

**You should see helpline data from database!**

---

## 📱 PART 3: Connecting Mobile App to Backend

### Step 1: Open Mobile Folder

**Open NEW terminal** (keep backend running!)

```bash
cd "C:\Users\krish\OneDrive\Desktop\StressBuster App\mobile"
```

### Step 2: Install Dependencies

```bash
npm install
```

**Expected Output:**
```
added 800+ packages in 2-3 minutes
```

### Step 3: Find Your Computer's IP Address

```bash
ipconfig
```

**Look for:**
```
Wireless LAN adapter Wi-Fi:
   IPv4 Address. . . . . . . . . . . : 192.168.1.5    ← This is your IP!
```

**Write down this IP address!**

### Step 4: Configure API Connection

Open `mobile/src/services/api.js` in notepad:

**Find this line:**
```javascript
const API_BASE_URL = 'http://localhost:5000/api';
```

**Change to your IP:**
```javascript
const API_BASE_URL = 'http://192.168.1.5:5000/api';  // Use YOUR IP!
```

**Why?**
- `localhost` only works on the same device
- Your phone is a different device
- Need to use computer's IP address
- Both must be on same WiFi network

**Save the file!**

### Step 5: How Mobile App Connects

**The flow:**
```
Mobile App (Your Phone)
    ↓
Uses axios to make HTTP requests
    ↓
Sends to: http://192.168.1.5:5000/api/chatbot/message
    ↓
Backend receives request
    ↓
Backend queries MySQL database
    ↓
Backend sends JSON response
    ↓
Mobile app displays data
```

**Example API call in code:**
```javascript
// In mobile app
const response = await chatbotAPI.sendMessage("I'm stressed", "session_123");

// This sends HTTP POST to:
// http://192.168.1.5:5000/api/chatbot/message

// Backend receives it and:
// 1. Saves to database
// 2. Generates response
// 3. Sends back JSON
```

### Step 6: Start Mobile App

```bash
npx expo start
```

**Expected Output:**
```
Starting Metro Bundler

› Metro waiting on exp://192.168.1.5:8081
› Scan the QR code above with Expo Go (Android) or Camera (iOS)

› Press a │ open Android
› Press w │ open web
```

**You'll see a QR code!**

### Step 7: Run on Your Phone

1. **Install Expo Go** app from Play Store/App Store
2. **Open Expo Go**
3. **Tap "Scan QR Code"**
4. **Point camera at QR code in terminal**
5. **Wait 30-60 seconds** for app to load

**✅ App opens on your phone!**

---

## 🔄 Complete Flow Example

Let's trace what happens when you use the chatbot:

### 1. User Types Message

```
📱 Mobile App
User types: "I'm feeling anxious"
Taps send button
```

### 2. Mobile App Sends Request

```javascript
// mobile/src/screens/ChatbotScreen.js
const response = await chatbotAPI.sendMessage(
  "I'm feeling anxious",
  "session_12345"
);
```

**HTTP Request:**
```
POST http://192.168.1.5:5000/api/chatbot/message
Headers: {
  "Content-Type": "application/json"
}
Body: {
  "message": "I'm feeling anxious",
  "sessionId": "session_12345"
}
```

### 3. Backend Receives Request

```javascript
// backend/routes/chatbot.js
router.post('/message', async (req, res) => {
  const { message, sessionId } = req.body;
  
  // Detect intent
  const intent = detectIntent(message);  // Returns "anxiety"
  
  // Save to database
  await insert(
    'INSERT INTO chatbot_conversations ...',
    [userId, sessionId, message, 'user', 'anxiety']
  );
```

### 4. Database Saves Data

```sql
-- MySQL executes:
INSERT INTO chatbot_conversations 
  (user_id, session_id, message, sender, intent, sentiment)
VALUES 
  (1, 'session_12345', 'I\'m feeling anxious', 'user', 'anxiety', 'negative');
```

**Database now has:**
```
+----+---------+--------------+---------------------+--------+---------+----------+
| id | user_id | session_id   | message             | sender | intent  | sentiment|
+----+---------+--------------+---------------------+--------+---------+----------+
| 1  | 1       | session_12345| I'm feeling anxious | user   | anxiety | negative |
+----+---------+--------------+---------------------+--------+---------+----------+
```

### 5. Backend Generates Response

```javascript
// backend/routes/chatbot.js
const botResponse = generateResponse('anxiety');
// Returns: "Try the 5-4-3-2-1 grounding technique..."

// Save bot response to database
await insert(
  'INSERT INTO chatbot_conversations ...',
  [userId, sessionId, botResponse, 'bot', 'coping_strategy']
);
```

### 6. Backend Sends Response

```javascript
// backend/routes/chatbot.js
return res.json({
  status: 'success',
  data: {
    message: "Try the 5-4-3-2-1 grounding technique...",
    intent: "anxiety",
    sentiment: "negative"
  }
});
```

**HTTP Response:**
```json
{
  "status": "success",
  "data": {
    "message": "Try the 5-4-3-2-1 grounding technique: Name 5 things you see...",
    "intent": "anxiety",
    "sentiment": "negative"
  }
}
```

### 7. Mobile App Displays Response

```javascript
// mobile/src/screens/ChatbotScreen.js
const response = await chatbotAPI.sendMessage(...);
addMessage(response.data.message, 'bot');
// Adds bot message to chat UI
```

**User sees:**
```
┌─────────────────────────────┐
│ I'm feeling anxious    [You]│
│                             │
│[Bot] Try the 5-4-3-2-1     │
│      grounding technique... │
└─────────────────────────────┘
```

### 8. View in Database

You can see this conversation in MySQL:

```sql
SELECT * FROM chatbot_conversations 
WHERE session_id = 'session_12345'
ORDER BY created_at;
```

**Output:**
```
+----+---------------------+--------+---------+
| id | message             | sender | intent  |
+----+---------------------+--------+---------+
| 1  | I'm feeling anxious | user   | anxiety |
| 2  | Try the 5-4-3-2-1...| bot    | coping  |
+----+---------------------+--------+---------+
```

---

## 🎯 Quick Reference

### Starting Everything:

**Terminal 1 - Database:**
```bash
# Already running if you set it up
# To check: mysql -u root -p
```

**Terminal 2 - Backend:**
```bash
cd "C:\Users\krish\OneDrive\Desktop\StressBuster App\backend"
npm start
```

**Terminal 3 - Mobile:**
```bash
cd "C:\Users\krish\OneDrive\Desktop\StressBuster App\mobile"
npx expo start
```

### Checking Database:

```bash
mysql -u root -p
```

```sql
USE stress_buster;

-- See all tables
SHOW TABLES;

-- See recent chats
SELECT * FROM chatbot_conversations ORDER BY created_at DESC LIMIT 10;

-- See appointments
SELECT * FROM appointments;

-- See game sessions
SELECT * FROM game_sessions ORDER BY created_at DESC LIMIT 10;

-- See users
SELECT * FROM users;
```

### Testing API:

**In browser:**
- Health: `http://localhost:5000/api/health`
- Helplines: `http://localhost:5000/api/helplines`
- Counselors: `http://localhost:5000/api/appointments/counselors`

---

## 🔍 Troubleshooting

### "Database connection failed"

**Check:**
1. MySQL is running: `net start MySQL80`
2. Password in `.env` is correct
3. Database exists: `SHOW DATABASES;` in MySQL

### "Network request failed" in mobile app

**Check:**
1. Backend is running (Terminal 2)
2. API URL in `api.js` has your computer's IP
3. Phone and computer on same WiFi
4. Firewall not blocking port 5000

### Can't see data in database

**Run:**
```sql
USE stress_buster;
SELECT * FROM chatbot_conversations;
```

If empty, use the app and check again!

---

## ✅ Success Checklist

- [ ] MySQL installed and running
- [ ] Database `stress_buster` created
- [ ] 11 tables visible in `SHOW TABLES;`
- [ ] Sample data loaded (5 users, 5 counselors)
- [ ] Backend `.env` file configured with MySQL password
- [ ] Backend starts with "✅ Database connected!"
- [ ] Mobile `api.js` has computer's IP address
- [ ] Expo starts and shows QR code
- [ ] App loads on phone via Expo Go
- [ ] Can send chat messages
- [ ] Messages appear in database

---

## 🎉 You're All Set!

Now you understand:
- ✅ How database stores data
- ✅ How backend connects to database
- ✅ How mobile app connects to backend
- ✅ Complete flow from user action to database
- ✅ How to view data in MySQL
- ✅ How everything works together

Enjoy building with StressBuster! 🌟
