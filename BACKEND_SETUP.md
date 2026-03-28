# Campus Events Backend - Setup & Installation Guide

## 📋 Overview

Your campus events platform now has a complete **Node.js + Express + MongoDB** backend that replaces Firebase. The frontend has been fully updated to use REST API calls.

## 🚀 Prerequisites

Make sure you have installed:
- **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
- **MongoDB** (local or Atlas) - [MongoDB Community](https://www.mongodb.com/try/download/community) or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)

## 📁 Project Structure

```
project-2/
├── server.js              # Main Express server
├── package.json           # Node.js dependencies
├── .env                   # Environment variables
├── models.js              # MongoDB schemas (Student, Event, Registration, Admin)
├── auth-routes.js         # Authentication endpoints
├── events-routes.js       # Public events endpoints
├── student-routes.js      # Student-specific endpoints
├── admin-routes.js        # Admin-specific endpoints
├── js/
│   ├── api-client.js      # Frontend API client (NEW)
│   ├── auth.js            # Updated for REST API
│   ├── student.js         # Updated for REST API
│   └── admin.js           # Updated for REST API
└── [HTML, CSS files]
```

## 🔧 Installation Steps

### Step 1: Install Dependencies

Navigate to your project directory and run:

```bash
cd "c:\Users\malip\OneDrive\Documents\Desktop\project-2"
npm install
```

This installs:
- `express` - Web framework
- `mongoose` - MongoDB ODM
- `bcryptjs` - Password hashing
- `jsonwebtoken` - JWT authentication
- `dotenv` - Environment variables
- `cors` - Cross-Origin Resource Sharing

### Step 2: Set Up MongoDB

#### Option A: Local MongoDB (Recommended for Development)

1. **Install MongoDB Community Edition** from [mongodb.com](https://www.mongodb.com/try/download/community)

2. **Start MongoDB service:**
   - **Windows**: MongoDB should start automatically or use Services panel
   - **Mac**: `brew services start mongodb-community`
   - **Linux**: `sudo systemctl start mongod`

3. **Verify MongoDB is running:**
   ```bash
   mongosh
   # or
   mongo
   ```

#### Option B: MongoDB Atlas (Cloud)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create free account and cluster
3. Get connection string: `mongodb+srv://username:password@cluster.mongodb.net/campus-events`
4. Update `.env` file with this connection string

### Step 3: Configure Environment Variables

Edit `.env` file with your MongoDB connection:

```env
MONGODB_URI=mongodb://localhost:27017/campus-events
JWT_SECRET=your_jwt_secret_key_change_this_in_production
PORT=5000
NODE_ENV=development
```

**For MongoDB Atlas:**
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/campus-events?retryWrites=true&w=majority
JWT_SECRET=your_jwt_secret_key_change_this_in_production
PORT=5000
NODE_ENV=development
```

### Step 4: Start the Server

```bash
npm start
```

You should see:
```
✓ MongoDB connected
🚀 Campus Events API running on http://localhost:5000
```

### Step 5: Test the Backend

Open your browser and test endpoints:

1. **Test API is running**: http://localhost:5000
2. **Check student registration**: `POST http://localhost:5000/api/auth/register`
3. **Get all events**: `GET http://localhost:5000/api/events`

## 📖 API Endpoints

### Authentication (`/api/auth`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/register` | Register as student |
| POST | `/auth/login` | Student login |
| POST | `/auth/admin-login` | Admin login |
| GET | `/auth/verify` | Verify JWT token |

**Register Student:**
```json
POST /api/auth/register
{
  "name": "John Doe",
  "email": "john@college.com",
  "password": "password123"
}
```

**Student Login:**
```json
POST /api/auth/login
{
  "email": "john@college.com",
  "password": "password123"
}
```

**Admin Login (email must contain @admin):**
```json
POST /api/auth/admin-login
{
  "email": "admin@admin.com",
  "password": "password123"
}
```

### Events (`/api/events`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/events` | Get all events |
| GET | `/events/:id` | Get event details |

### Student Endpoints (`/api/student`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/student/registrations` | Get my registrations |
| POST | `/student/register` | Register for event |
| DELETE | `/student/registrations/:id` | Cancel registration |

**Register for Event:**
```json
POST /api/student/register
Authorization: Bearer <token>
{
  "eventId": "mongodb_event_id"
}
```

### Admin Endpoints (`/api/admin`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/admin/events` | Create event |
| GET | `/admin/events` | Get all events |
| PUT | `/admin/events/:id` | Update event |
| DELETE | `/admin/events/:id` | Delete event |
| GET | `/admin/events/:id/registrations` | Get event registrations |

**Create Event:**
```json
POST /api/admin/events
Authorization: Bearer <admin_token>
{
  "title": "Tech Hackathon",
  "description": "3-hour coding competition",
  "date": "2024-04-15",
  "time": "10:00 AM",
  "venue": "Auditorium",
  "category": "Technical",
  "capacity": 100,
  "organizer": "CS Club"
}
```

## 🔐 Authentication

- JWT tokens expire in **7 days**
- Passwords are hashed with **bcryptjs**
- Admin emails must contain `@admin`
- Tokens are stored in localStorage (frontend)

## 🌐 Frontend Configuration

The frontend is pre-configured to call:
- **API Base URL**: `http://localhost:5000/api`
- **Token Storage**: localStorage (`authToken`)
- **Auto Token Refresh**: On every request

## 🧪 Testing Workflow

### 1. Start Backend
```bash
npm start
```

### 2. Open Frontend
```bash
python -m http.server 8000
# or
npx http-server
```
Then visit: http://localhost:8000

### 3. Test Student Flow
1. Click "Login as Student"
2. Register: `test@student.com` / `password123`
3. View events
4. Register for an event
5. Check "My Registrations"

### 4. Test Admin Flow
1. Click "Login as Admin"
2. Login: `admin@admin.com` / `password123` (auto-creates account on first login)
3. Create new event
4. View registrations
5. Edit/Delete events

## 🐛 Troubleshooting

### "MongoDB connection error"
- Ensure MongoDB is running: `mongosh` or check Services
- Check connection string in `.env`
- For Atlas: Check IP whitelist and credentials

### "Port 5000 already in use"
```bash
# Find process using port 5000
netstat -ano | findstr :5000

# Kill process (replace PID with number from above)
taskkill /PID <PID> /F

# Or use different port - edit .env and server.js
```

### "CORS errors"
- Backend already has CORS enabled
- Ensure frontend is on http://localhost:8000 (not 3000)
- Check API_BASE_URL in `js/api-client.js`

### "Login not working"
- Check browser console (F12) for errors
- Verify MongoDB has collections (use `mongosh`)
- Check JWT_SECRET in `.env`

### "No events showing"
- Create an event as admin first
- Check that backend is running
- Verify network tab in browser DevTools

## 📊 Database Collections

**Students**
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (hashed),
  createdAt: Date
}
```

**Events**
```javascript
{
  _id: ObjectId,
  title: String,
  description: String,
  date: Date,
  time: String,
  venue: String,
  category: String,
  capacity: Number,
  organizer: String,
  registrationCount: Number,
  createdBy: ObjectId,
  createdAt: Date
}
```

**Registrations**
```javascript
{
  _id: ObjectId,
  studentId: ObjectId (ref: Student),
  studentEmail: String,
  eventId: ObjectId (ref: Event),
  eventTitle: String,
  registeredAt: Date
}
```

**Admins**
```javascript
{
  _id: ObjectId,
  email: String (unique, contains @admin),
  password: String (hashed),
  createdAt: Date
}
```

## 🚢 Deployment

### Deploy Backend to Heroku

```bash
# Install Heroku CLI
# Create Heroku app
heroku create campus-events-api

# Set environment variables
heroku config:set MONGODB_URI=your_atlas_connection_string
heroku config:set JWT_SECRET=your_secret_key

# Deploy
git push heroku main
```

### Deploy Frontend

- Firebase Hosting, Netlify, Vercel, or GitHub Pages
- Update `API_BASE_URL` in `js/api-client.js` to your backend URL

## 📝 Next Steps

1. ✅ Install dependencies: `npm install`
2. ✅ Set up MongoDB
3. ✅ Configure `.env`
4. ✅ Start server: `npm start`
5. ✅ Test with frontend
6. ✅ Customize as needed

## 🎓 Learning Resources

- [Express.js Guide](https://expressjs.com/)
- [Mongoose Documentation](https://mongoosejs.com/)
- [JWT Authentication](https://jwt.io/)
- [MongoDB Documentation](https://docs.mongodb.com/)

## 📞 Support

Check the following if issues arise:
1. Backend logs (terminal output)
2. Browser console (F12)
3. Network tab in DevTools (check API calls)
4. MongoDB shell: `mongosh` to verify data

---

**Your backend is now ready! Start with `npm start` and test the application.**
