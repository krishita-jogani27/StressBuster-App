# Quick Database Setup Guide

## ✅ Step 1: Login to MySQL

Open a NEW terminal (Command Prompt) and run:

```bash
mysql -u root -p
```

When prompted, enter your MySQL password: `root`

You should see:
```
mysql>
```

## ✅ Step 2: Run Schema (Create Database & Tables)

In the MySQL prompt, copy and paste this EXACT command:

```sql
SOURCE C:/Users/krish/OneDrive/Desktop/StressBuster App/database/schema.sql
```

**Note:** Use forward slashes `/` not backslashes `\`

You should see:
```
Database schema created successfully!
```

## ✅ Step 3: Run Seed Data (Add Sample Data)

Still in MySQL prompt, run:

```sql
SOURCE C:/Users/krish/OneDrive/Desktop/StressBuster App/database/seed.sql
```

You should see:
```
Seed data inserted successfully!
+--------------+
| total_users  |
+--------------+
|            5 |
+--------------+
```

## ✅ Step 4: Verify Database

```sql
USE stress_buster;
SHOW TABLES;
```

You should see 11 tables!

## ✅ Step 5: Exit MySQL

```sql
EXIT;
```

## 🎉 Done!

Your database is now ready. The backend should connect automatically.

---

## ⚠️ Common Mistakes:

❌ **DON'T** run: `node seed.sql` (SQL files don't run with Node!)
✅ **DO** run: `SOURCE path/to/file.sql` (inside MySQL)

❌ **DON'T** use backslashes: `C:\Users\...`
✅ **DO** use forward slashes: `C:/Users/...`

---

## 🔍 Check if Backend Connected:

Your backend is already running. Check the terminal where you ran `npm start`.

You should see:
```
✅ Database connected successfully!
📊 Connected to database: stress_buster
```

If you see this, everything is working! 🎉
