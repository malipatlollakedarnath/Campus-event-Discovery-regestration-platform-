# Project Structure Guide - Campus Events Platform

## 📁 Complete Project Directory

```
project-2/
│
├── 📄 Documentation
│   ├── BACKEND_README.md           ← START HERE! Complete overview
│   ├── BACKEND_SETUP.md            ← Detailed setup instructions
│   ├── BACKEND_QUICK_REF.md        ← Quick reference cheat sheet
│   ├── INTEGRATION_COMPLETE.md     ← Final summary
│   ├── README.md                   ← Original project docs
│   └── SETUP_CHECKLIST.txt         ← Original setup checklist
│
├── 🔧 Backend Server Files
│   ├── server.js                   ← Main Express.js server (START HERE for backend)
│   ├── models.js                   ← MongoDB schemas (Student, Event, Registration, Admin)
│   ├── auth-routes.js              ← Auth endpoints (register, login, admin-login)
│   ├── events-routes.js            ← Public events endpoints
│   ├── student-routes.js           ← Student endpoints (my registrations, register, cancel)
│   ├── admin-routes.js             ← Admin endpoints (create/edit/delete events)
│   ├── package.json                ← Node.js dependencies
│   └── .env                        ← Environment configuration (EDIT THIS!)
│
├── 📱 Frontend HTML Pages
│   ├── index.html                  ← Landing page
│   ├── login.html                  ← Login/Register page (UPDATED)
│   ├── student-dashboard.html      ← Student event browser (UPDATED)
│   └── admin-dashboard.html        ← Admin event manager (UPDATED)
│
├── 🎨 CSS Styling
│   └── css/
│       └── style.css               ← Responsive styling (no changes needed)
│
├── 💻 JavaScript Files
│   └── js/
│       ├── api-client.js           ← NEW! Frontend API wrapper (use api.* in code)
│       ├── auth.js                 ← UPDATED! Uses REST API instead of Firebase
│       ├── student.js              ← UPDATED! Uses REST API instead of Firestore
│       ├── admin.js                ← UPDATED! Uses REST API instead of Firestore
│       └── firebase-config.js      ← OLD (kept for reference, not used anymore)
│
├── 🔐 Security & Rules
│   └── FIRESTORE_RULES.txt         ← OLD Firebase rules (not used anymore)
│
└── 📚 Quick Start Guide
    └── QUICKSTART.html             ← Interactive setup guide (outdated, use BACKEND_SETUP.md)
```

## 🚀 Where to Start

### To Run the Backend

1. **Install Dependencies** (Terminal 1)
   ```bash
   npm install
   ```

2. **Start MongoDB** (Terminal 2)
   ```bash
   mongosh
   ```

3. **Start Backend Server** (Terminal 1)
   ```bash
   npm start
   ```
   Expected output: `🚀 Campus Events API running on http://localhost:5000`

### To Run the Frontend

4. **Start Frontend Server** (Terminal 3)
   ```bash
   python -m http.server 8000
   ```
   Visit: http://localhost:8000

## 📖 Reading Order for Understanding

1. **First**: This file (you are here!)
2. **Second**: `BACKEND_README.md` - Overview of what's been built
3. **Third**: `BACKEND_SETUP.md` - Detailed setup instructions
4. **Fourth**: `BACKEND_QUICK_REF.md` - API reference while coding

## 🔄 Data Flow Architecture

```
User Browser
     ↓
http://localhost:8000
     ↓
[Frontend HTML/CSS/JS]
     ↓
js/api-client.js
(Sends HTTP requests)
     ↓
http://localhost:5000/api
     ↓
[Express.js Routes]
├─ auth-routes.js
├─ events-routes.js
├─ student-routes.js
└─ admin-routes.js
     ↓
models.js
(Mongoose schemas)
     ↓
MongoDB Database
(campus-events)
```

## 📊 Files by Function

### Backend Core (Must Understand These)

| File | Lines | Purpose |
|------|-------|---------|
| server.js | 45 | Express configuration & startup |
| models.js | 65 | Database schemas |
| auth-routes.js | 137 | Login/Register/Auth |
| events-routes.js | 35 | Get events |
| student-routes.js | 92 | Student registration |
| admin-routes.js | 115 | Event management |

### Frontend Integration (Must Understand These)

| File | Status | Purpose |
|------|--------|---------|
| js/api-client.js | NEW ✅ | API wrapper - USE THIS! |
| js/auth.js | UPDATED ✅ | Uses api.loginStudent, api.registerStudent |
| js/student.js | UPDATED ✅ | Uses api.getAllEvents, api.registerForEvent |
| js/admin.js | UPDATED ✅ | Uses api.createEvent, api.updateEvent |
| login.html | UPDATED ✅ | Includes api-client.js |

### Configuration

| File | Purpose |
|------|---------|
| package.json | Dependencies (npm install reads this) |
| .env | Server configuration (EDIT THIS!) |

## 🎯 Common Tasks

### How to Add a New API Endpoint

1. Add route to appropriate file (auth, events, student, or admin)
2. Add function to api-client.js
3. Call it from frontend: `api.functionName()`

### How to Add a New Database Field

1. Update schema in models.js
2. Update frontend form to include new field
3. Update API endpoint to accept new field

### How to Modify Student Registration

1. Edit api.registerForEvent() in js/api-client.js
2. Edit POST /api/student/register in student-routes.js
3. Edit registerForEvent() in js/student.js

### How to Deploy

1. Push code to GitHub
2. Deploy backend to Heroku/Railway/AWS
3. Update API_BASE_URL in api-client.js
4. Deploy frontend to Netlify/Vercel/GitHub Pages

## 🔗 Important Connections

### Frontend → Backend Connection

```javascript
// Frontend calls backend through API client
api.getAllEvents()
  ↓
Sends: GET http://localhost:5000/api/events
  ↓
Backend receives in events-routes.js
  ↓
Queries MongoDB through models.js
  ↓
Returns JSON to frontend
  ↓
Frontend displays events
```

### Database Relationships

```
Student (1) ─────→ (Many) Registrations
  ↓
  └─ Email, Name, Password

Event (1) ─────→ (Many) Registrations
  ↓
  └─ Title, Date, Category, Capacity

Registration
  ├─ studentId (references Student)
  ├─ eventId (references Event)
  └─ registeredAt (timestamp)

Admin
  ├─ Email (must contain @admin)
  └─ Password
```

## 🚨 Errors & Where to Check

| Error | Check This File |
|-------|-----------------|
| "Cannot connect to MongoDB" | .env, server.js line 15 |
| "Port 5000 in use" | server.js line 44 |
| "Login fails" | auth-routes.js, models.js |
| "Events not showing" | events-routes.js, api-client.js |
| "Frontend can't reach backend" | api-client.js line 2 |
| "Can't register for event" | student-routes.js |
| "Admin endpoints not working" | admin-routes.js |

## 📱 Frontend Pages Map

```
http://localhost:8000/
    ├─ index.html (Landing)
    │   └─ Links to login.html
    │
    ├─ login.html (Authentication)
    │   ├─ Uses: js/api-client.js
    │   ├─ Uses: js/auth.js
    │   └─ Routes to:
    │       ├─ student-dashboard.html (Student)
    │       └─ admin-dashboard.html (Admin)
    │
    ├─ student-dashboard.html
    │   ├─ Uses: js/api-client.js
    │   ├─ Uses: js/student.js
    │   ├─ Calls: api.getAllEvents()
    │   ├─ Calls: api.registerForEvent()
    │   └─ Calls: api.getMyRegistrations()
    │
    └─ admin-dashboard.html
        ├─ Uses: js/api-client.js
        ├─ Uses: js/admin.js
        ├─ Calls: api.createEvent()
        ├─ Calls: api.updateEvent()
        ├─ Calls: api.deleteEvent()
        └─ Calls: api.getEventRegistrations()
```

## 📊 Backend Routes Map

```
http://localhost:5000/api/
    │
    ├─ /auth (auth-routes.js)
    │   ├─ POST /register
    │   ├─ POST /login
    │   ├─ POST /admin-login
    │   └─ GET /verify
    │
    ├─ /events (events-routes.js)
    │   ├─ GET / (all events)
    │   └─ GET /:id (single event)
    │
    ├─ /student (student-routes.js)
    │   ├─ GET /registrations
    │   ├─ POST /register
    │   └─ DELETE /registrations/:id
    │
    └─ /admin (admin-routes.js)
        ├─ POST /events
        ├─ GET /events
        ├─ PUT /events/:id
        ├─ DELETE /events/:id
        └─ GET /events/:id/registrations
```

## 🎓 How to Modify the Backend

### To Add Student Logout
```javascript
// Add to auth-routes.js
router.post('/logout', verifyToken, (req, res) => {
  // Frontend will just clear localStorage
  res.json({ message: 'Logged out' });
});

// Add to js/api-client.js
async logout() {
  this.clearAuth();
  return { message: 'Logged out' };
}

// Use in frontend
api.logout();
```

### To Add Event Search
```javascript
// Add to events-routes.js
router.get('/search/:query', async (req, res) => {
  const events = await Event.find({
    title: { $regex: req.params.query, $options: 'i' }
  });
  res.json(events);
});

// Add to js/api-client.js
async searchEvents(query) {
  return await this.request(`/events/search/${query}`, 'GET');
}

// Use: api.searchEvents('hackathon')
```

## 📝 Important Conventions

### API Response Format
```javascript
// Success
{
  "message": "Operation successful",
  "token": "jwt_token_here",
  "student": { "id": "...", "name": "..." }
}

// Error
{
  "message": "Error description"
}
```

### Database Field Naming
```javascript
// Always use camelCase
{
  studentId,       // ✅ Correct
  student_id,      // ❌ Wrong
  
  registrationCount,  // ✅ Correct
  registration_count  // ❌ Wrong
}
```

### Endpoint Naming
```
GET    /api/events              ✅ Get list
GET    /api/events/:id          ✅ Get one
POST   /api/admin/events        ✅ Create
PUT    /api/admin/events/:id    ✅ Update
DELETE /api/admin/events/:id    ✅ Delete
```

## 🔑 Key Files to Edit

### If you need to...

| Need | Edit This |
|------|-----------|
| Add new field to student | models.js line 3 + auth-routes.js |
| Change password requirements | auth-routes.js line 30 |
| Add email validation | models.js or auth-routes.js |
| Change JWT expiration | auth-routes.js line 16 |
| Change admin email format | admin-routes.js line 15 |
| Add new event category | student-dashboard.html line 25 |
| Change frontend colors | css/style.css |
| Add new endpoint | appropriate *-routes.js file |

## 📊 Quick Reference

### Start Backend
```bash
npm start
# Output: 🚀 Campus Events API running on http://localhost:5000
```

### Test Endpoints
```bash
# Get all events
curl http://localhost:5000/api/events

# Check MongoDB
mongosh
> use campus-events
> db.events.find()
```

### Check Frontend
```bash
python -m http.server 8000
# Visit: http://localhost:8000
```

### Stop Everything
```bash
# Ctrl+C in each terminal
```

---

## 🎉 You're All Set!

You now understand:
- ✅ Project structure
- ✅ Where each file is
- ✅ How they connect
- ✅ Where to make changes
- ✅ How to run everything

**Next Step**: Open BACKEND_SETUP.md and follow the setup instructions!

**Then**: Run `npm start` and enjoy your platform! 🚀
