# Campus Events Backend - Quick Reference

## 🚀 Quick Start (2 minutes)

```bash
# 1. Install dependencies
npm install

# 2. Make sure MongoDB is running
mongosh  # Test connection

# 3. Start backend
npm start

# 4. In another terminal, start frontend
python -m http.server 8000

# 5. Open http://localhost:8000 in browser
```

## 📋 File Structure Cheat Sheet

| File | Purpose |
|------|---------|
| `server.js` | Express server entry point |
| `models.js` | MongoDB schemas |
| `auth-routes.js` | Login/Register/Admin endpoints |
| `events-routes.js` | Get all/single event |
| `student-routes.js` | My registrations, register, cancel |
| `admin-routes.js` | Create/Edit/Delete events, view registrations |
| `js/api-client.js` | Frontend API wrapper (use `api.` prefix) |

## 🧪 Testing API Endpoints

### Using cURL or Postman

**Register Student:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Student",
    "email": "test@college.com",
    "password": "test123456"
  }'
```

**Get All Events:**
```bash
curl http://localhost:5000/api/events
```

**Admin Login:**
```bash
curl -X POST http://localhost:5000/api/auth/admin-login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@admin.com",
    "password": "admin123456"
  }'
```

## 🔐 Admin Accounts

Admin emails MUST contain `@admin` or end with `admin@college`

Examples:
- ✅ `admin@admin.com`
- ✅ `organizer@admin.college`
- ✅ `event@admin.com`
- ❌ `admin@college.com` (wrong format)

## 🗄️ MongoDB Commands

```bash
# Connect to MongoDB
mongosh

# Switch to campus-events database
use campus-events

# List all collections
show collections

# View students
db.students.find()

# View events
db.events.find()

# View registrations
db.registrations.find()

# Count registrations for an event
db.registrations.countDocuments({eventId: ObjectId("...")})

# Clear all data (CAUTION!)
db.students.deleteMany({})
db.events.deleteMany({})
db.registrations.deleteMany({})
```

## 🔄 Frontend API Usage

All frontend files use the `api` object:

```javascript
// Authentication
api.registerStudent(name, email, password)
api.loginStudent(email, password)
api.loginAdmin(email, password)

// Events
api.getAllEvents()
api.getEventDetails(eventId)

// Student functions
api.getMyRegistrations()
api.registerForEvent(eventId)
api.cancelRegistration(registrationId)

// Admin functions
api.createEvent({title, description, date, time, venue, category, capacity, organizer})
api.updateEvent(eventId, eventData)
api.deleteEvent(eventId)
api.getAdminEvents()
api.getEventRegistrations(eventId)

// Status checks
api.isAuthenticated()
api.isAdmin()
api.isStudent()
api.clearAuth()
```

## 🐛 Common Errors & Fixes

| Error | Solution |
|-------|----------|
| "MongoDB connection error" | Start MongoDB: `mongosh` test |
| "Port 5000 already in use" | Change PORT in `.env` or kill process |
| "Cannot GET /api/events" | Ensure server is running with `npm start` |
| "Authentication failed" | Check JWT_SECRET in `.env`, re-login |
| "CORS error in browser" | Ensure API_BASE_URL is correct in `api-client.js` |
| "Event not found (404)" | Verify eventId is correct MongoDB ObjectId |

## 📱 Frontend Pages

| Page | URL | Purpose |
|------|-----|---------|
| Landing | `/` → `index.html` | Home page |
| Login | `/login.html` | Student/Admin login |
| Student Dashboard | `/student-dashboard.html` | Browse & register events |
| Admin Dashboard | `/admin-dashboard.html` | Manage events |

## 🔑 Environment Variables

```env
MONGODB_URI=mongodb://localhost:27017/campus-events  # Local MongoDB
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/campus-events  # MongoDB Atlas
JWT_SECRET=change_this_to_secure_string
PORT=5000
NODE_ENV=development
```

## 📊 Test Data Creation Flow

```
1. Register Student
   ↓
2. Admin: Create Event
   ↓
3. Student: Register for Event
   ↓
4. Admin: View Registrations
   ↓
5. Student: View My Registrations
   ↓
6. Student: Cancel Registration
   ↓
7. Admin: Delete Event
```

## 🚀 Performance Tips

- Keep MongoDB connection persistent
- Reuse API client instance (`api` global object)
- Cache event list locally when possible
- Use Bearer token format: `Authorization: Bearer <token>`
- Token expires in 7 days (re-login after expiration)

## 📚 API Response Format

**Success (200, 201):**
```json
{
  "message": "Operation successful",
  "data": {...}
}
```

**Error (400, 401, 500):**
```json
{
  "message": "Error description"
}
```

## 🎯 Key Validations

| Field | Rules |
|-------|-------|
| Email | Valid format, unique |
| Password | Min 6 characters |
| Admin Email | Must contain `@admin` |
| Event Capacity | Min 1, not less than registrations |
| Event Date | Must be valid date |
| Duplicate Registration | Prevented at database level |

---

**Need help? Check BACKEND_SETUP.md for detailed documentation.**
