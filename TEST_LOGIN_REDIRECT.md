# 🧪 Quick Test Guide - Login Redirect Fix

## Prerequisites
- Backend running: `npm start` (port 5000)
- Frontend running: `python -m http.server 8000`
- MongoDB running

## Test 1: Student Registration ✅

**Steps**:
1. Open http://localhost:8000/login.html
2. Click "Register here" link
3. Fill in:
   - Name: `Test Student`
   - Email: `test@college.com` 
   - Password: `test123456`
4. Click "Register"

**Expected Result**:
- ✅ See "Registration successful!" message
- ✅ IMMEDIATE redirect to student-dashboard.html
- ✅ See student email at top
- ✅ See list of events loading

---

## Test 2: Student Login ✅

**Steps**:
1. Open http://localhost:8000/login.html
2. Enter:
   - Email: `test@college.com`
   - Password: `test123456`
3. Click "Login"

**Expected Result**:
- ✅ See "Login successful!" message
- ✅ IMMEDIATE redirect to student-dashboard.html
- ✅ See events list
- ✅ Can register for events

---

## Test 3: Admin Login ✅

**Steps**:
1. Open http://localhost:8000/login.html
2. Click "Admin" tab
3. Enter:
   - Email: `admin@admin.com`
   - Password: `admin123456` (any password)
4. Click "Admin Login"

**Expected Result**:
- ✅ See "Admin login successful!" message
- ✅ IMMEDIATE redirect to admin-dashboard.html
- ✅ See admin email at top
- ✅ Can create, edit, delete events

---

## Test 4: Error Handling ✅

**Wrong Password**:
1. Enter valid email but wrong password
2. Click "Login"
3. See error message (stays for 5 seconds)
4. Not redirected

**Wrong Email**:
1. Enter email that doesn't exist
2. Click "Login"
3. See error message
4. Not redirected

**Missing Fields**:
1. Leave email or password empty
2. Click "Login"
3. See "Please fill in all fields" error
4. Not redirected

---

## Test 5: Token Verification ✅

**After Login**:
1. Login successfully
2. After redirect, check browser console (F12)
3. Type: `localStorage.getItem('authToken')`
4. See JWT token (long string starting with `eyJ`)

---

## Troubleshooting

### Still redirecting to login page
→ Backend might not be running
→ Try: `npm start` in another terminal

### Seeing "invalid token" error
→ Delete localStorage and try again
→ In console: `localStorage.clear()` then reload

### Page loads but no events
→ MongoDB might not be running
→ Try: `mongosh` in another terminal

### Getting CORS error
→ Make sure backend is on port 5000
→ Check API_BASE_URL in api-client.js

---

## Success Checklist ✅

- [ ] Can register as student
- [ ] Can login as student
- [ ] Redirects immediately after login
- [ ] Can see "Login successful!" message
- [ ] Student dashboard loads
- [ ] Can register for events
- [ ] Can admin login
- [ ] Admin dashboard loads
- [ ] Can create events as admin

---

**All tests pass? 🎉 Login redirect is working!**
