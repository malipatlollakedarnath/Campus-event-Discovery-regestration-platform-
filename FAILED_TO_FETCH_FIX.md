# 🔧 "Failed to Fetch" Error - Troubleshooting Guide

## ❌ What This Error Means

The frontend cannot connect to the backend API. This happens when:
- Backend is not running
- Backend is on wrong port
- MongoDB is not connected
- Backend crashed

## ✅ Fix Steps (In Order)

### Step 1: Ensure MongoDB is Running

**Windows**:
```bash
# Open a new terminal and run:
mongosh

# You should see:
# Current Mongosh Log ID: ...
# Connecting to: mongodb://localhost:27017/...
```

If MongoDB doesn't start:
1. Download from https://www.mongodb.com/try/download/community
2. Install it
3. Run `mongosh` again

---

### Step 2: Verify .env File

Open `.env` file and check:

```env
MONGODB_URI=mongodb://localhost:27017/campus-events
JWT_SECRET=your_jwt_secret_key_change_this_in_production
PORT=5000
NODE_ENV=development
```

⚠️ Make sure:
- [ ] `MONGODB_URI` matches your MongoDB connection
- [ ] `PORT=5000` (not 3000, not 8000)
- [ ] File exists in project root

---

### Step 3: Install Dependencies

```bash
cd "c:\Users\malip\OneDrive\Documents\Desktop\project-2"
npm install
```

Wait for completion (should see "added X packages").

---

### Step 4: Start Backend

**Terminal 1**:
```bash
npm start
```

**You should see**:
```
✓ MongoDB connected
🚀 Campus Events API running on http://localhost:5000
```

⚠️ If you see errors:
- **"MongoDB connection error"** → Start MongoDB (mongosh)
- **"Port 5000 already in use"** → Kill process or change PORT in .env
- **"Cannot find module"** → Run `npm install` again

---

### Step 5: Start Frontend

**Terminal 2** (while backend is running):
```bash
python -m http.server 8000
```

You should see:
```
Serving HTTP on 0.0.0.0 port 8000
```

---

### Step 6: Test API Directly

**Terminal 3** - Test if backend is accessible:

```bash
curl http://localhost:5000/api/events
```

Should return:
```json
[]
```

(or `{"message":"..."}` if there's an error)

If this fails → Backend is not running

---

## 🐛 Common Errors & Solutions

### Error: "Failed to fetch" on login page

**Check 1: Is backend running?**
```bash
# In a new terminal, check if port 5000 is listening
netstat -ano | findstr :5000
```

If nothing shows → Backend NOT running → Run `npm start`

---

### Error: "net::ERR_CONNECTION_REFUSED"

**Cause**: Backend not listening on port 5000

**Fix**:
1. Kill any process on port 5000:
   ```bash
   netstat -ano | findstr :5000
   # Note the PID number
   taskkill /PID <number> /F
   ```
2. Start backend again:
   ```bash
   npm start
   ```

---

### Error: "MongoDB connection error" in backend logs

**Cause**: MongoDB not running

**Fix**:
```bash
# Start MongoDB in new terminal
mongosh

# Should connect successfully
```

---

### Error: "Port 5000 already in use"

**Fix Option 1**: Kill process
```bash
netstat -ano | findstr :5000
taskkill /PID <PID_NUMBER> /F
npm start
```

**Fix Option 2**: Change PORT in .env
```env
PORT=5001  # Change from 5000
```

Then update api-client.js:
```javascript
const API_BASE_URL = 'http://localhost:5001/api';  // Update
```

---

## 📋 Checklist Before Testing

Complete checklist:

- [ ] MongoDB is running (`mongosh` works)
- [ ] Backend is running (`npm start` shows success)
- [ ] Frontend is running (`python -m http.server 8000`)
- [ ] 3 different terminals open
- [ ] No error messages in any terminal
- [ ] .env file exists with correct values
- [ ] `npm install` was completed

---

## 🧪 Test the Connection

### Test 1: Direct API Call
```bash
curl http://localhost:5000/api/events
```
Should return events (even if empty).

### Test 2: Browser Console Check
1. Open http://localhost:8000/login.html
2. Open DevTools (F12)
3. Open Console tab
4. Type: `api.getAllEvents()`
5. Should see response in console

### Test 3: Network Check
1. Open DevTools (F12)
2. Click Network tab
3. Try to login
4. See if requests show "http://localhost:5000/api"
5. Check status codes (should be 200, 400, or 401, NOT connection error)

---

## 🚀 Complete Fresh Start

If nothing works, do this:

**Terminal 1 - Stop everything**:
```bash
# Press Ctrl+C in all terminals
```

**Terminal 1 - MongoDB**:
```bash
mongosh
# Keep this running
```

**Terminal 2 - Backend**:
```bash
cd "c:\Users\malip\OneDrive\Documents\Desktop\project-2"
npm install
npm start
# Should show: 🚀 Campus Events API running on http://localhost:5000
```

**Terminal 3 - Frontend**:
```bash
cd "c:\Users\malip\OneDrive\Documents\Desktop\project-2"
python -m http.server 8000
```

**Terminal 4 - Test**:
```bash
# Test each endpoint
curl http://localhost:5000/api/events
curl http://localhost:5000/api/auth/verify
```

---

## 🆘 Still Not Working?

Check these logs:

### Backend Terminal (Terminal 2)
Look for error messages when you try to login:
- `MongoDB connection error` → Start MongoDB
- `Port 5000 already in use` → Kill process
- `Cannot find module 'express'` → Run `npm install`

### Browser Console (F12)
Look at Console tab:
- See what error message is shown
- Check Network tab for failed requests

### MongoDB Terminal (Terminal 1)
Should show:
```
Connecting to: mongodb://localhost:27017
```

If not:
- Make sure MongoDB is installed
- Try running `mongosh` manually

---

## 📞 Quick Diagnostic

Run this in terminal to check everything:

```bash
# Check Node.js
node --version

# Check npm
npm --version

# Check MongoDB
mongosh --version

# Check if port 5000 is free
netstat -ano | findstr :5000
```

All should return versions or nothing (if port is free).

---

## ✅ When It's Working

You'll see:

**Backend Terminal**:
```
✓ MongoDB connected
🚀 Campus Events API running on http://localhost:5000
```

**Frontend**:
- Login page loads
- Can type email/password
- See "Login successful!" message (not "Failed to fetch")
- Redirects to dashboard

**Browser Console**:
- No red errors about "fetch failed"
- Requests to `http://localhost:5000/api` return 200/401/400 status

---

**Follow these steps and your "Failed to Fetch" error will be fixed! 🚀**
