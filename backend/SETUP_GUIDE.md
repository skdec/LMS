# Backend Setup Guide

## ✅ What's Fixed
- ✅ Dependencies installed (`npm install` completed)
- ✅ Environment variables configured (`.env` file created)
- ✅ Server can start successfully

## 🔧 What You Need to Configure

### 1. MongoDB Database Setup (Required)

**Option A: MongoDB Atlas (Recommended - Free)**
1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas/database)
2. Create a free account
3. Create a new cluster (choose free tier)
4. Create a database user with password
5. Get your connection string from "Connect" → "Connect your application"
6. Update `MONGO_URI` in `.env` file with your connection string

**Option B: Local MongoDB**
- Install MongoDB locally
- Update `MONGO_URI` to: `mongodb://localhost:27017/lms_database`

### 2. Email Configuration (Optional - for password reset)
If you want password reset functionality:
1. Use Gmail with App Password (recommended)
2. Update `EMAIL_FROM` and `EMAIL_PASS` in `.env`

### 3. Security (Important for Production)
- Change `JWT_SECRET` to a strong, unique secret key
- Never commit `.env` to version control

## 🚀 How to Start the Server

```bash
cd backend
npm start
```

## 🧪 Test the Setup
Once configured, the server should start without errors and show:
```
🚀 Server running on port 3001
🔗 http://localhost:3001
MongoDB connected
```

## ⚠️ Current Status
The server is ready to run but needs a valid MongoDB connection string in the `.env` file.