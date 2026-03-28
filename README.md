# Campus Event Discovery and Registration Platform

A centralized web platform for college students to discover, register, and track campus events. Admins can create, manage, and monitor event registrations.

## 🎯 Features

### Student Features
- ✅ Register and login with email/password
- ✅ Browse all upcoming events with filters
- ✅ View detailed event information
- ✅ Register for events (prevents duplicate registrations)
- ✅ View and manage registered events
- ✅ Cancel event registrations

### Admin Features
- ✅ Secure admin login
- ✅ Create new events with all details
- ✅ Edit existing events
- ✅ Delete events
- ✅ View all registrations for each event
- ✅ Monitor event capacity

## 🛠️ Tech Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Backend**: Firebase (Firestore + Authentication)
- **Hosting**: Can be deployed to Firebase Hosting or any static host

## 📋 Prerequisites

- Google account (for Firebase)
- Web browser (Chrome, Firefox, Safari, Edge)
- No backend server needed (Firebase handles it all)

## 🚀 Setup Instructions

### Step 1: Create Firebase Project

1. Go to [Firebase Console](https://firebase.google.com/)
2. Click "Get started"
3. Create a new project named "campus-events"
4. Accept default settings and create the project

### Step 2: Enable Firebase Services

1. **Enable Firestore Database**:
   - In Firebase Console, go to "Firestore Database"
   - Click "Create Database"
   - Start in **test mode** (for development)
   - Select a region (closest to you)

2. **Enable Authentication**:
   - Go to "Authentication"
   - Click "Get started"
   - Enable "Email/Password" authentication

### Step 3: Get Firebase Config

1. In Firebase Console, click the gear icon → Project Settings
2. Scroll to "Your apps" section
3. Click the web icon `</>` to register your app
4. Copy the Firebase config object

### Step 4: Update Configuration

1. Open `js/firebase-config.js`
2. Replace the `firebaseConfig` object with your copied configuration:

```javascript
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "your-project.firebaseapp.com",
    projectId: "your-project-id",
    storageBucket: "your-project.appspot.com",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};
```

### Step 5: Add Firebase SDK

The project uses Firebase SDK from CDN. Make sure your internet connection is active when running the app.

## 📁 Project Structure

```
project-2/
├── index.html              # Landing page
├── login.html              # Login/Register page
├── student-dashboard.html  # Student main page
├── admin-dashboard.html    # Admin main page
├── css/
│   └── style.css          # All styling
├── js/
│   ├── firebase-config.js # Firebase configuration
│   ├── auth.js            # Authentication logic
│   ├── student.js         # Student functions
│   └── admin.js           # Admin functions
└── README.md              # This file
```

## ▶️ Running the Application

### Local Development

1. Open `index.html` in your web browser
2. For best experience, use a local server:

```bash
# Using Python 3
python -m http.server 8000

# Using Node.js
npx http-server

# Using Live Server (VS Code extension)
# Right-click index.html → Open with Live Server
```

Then visit: `http://localhost:8000`

### Production Deployment

Deploy to Firebase Hosting (free):

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase in your project
firebase init hosting

# Deploy
firebase deploy
```

## 👥 Using the Platform

### For Students

1. **Registration**:
   - Click "Login as Student"
   - Click "Register here"
   - Enter name, email, and password
   - Click "Register"

2. **Browsing Events**:
   - After login, see all upcoming events
   - Use category filter to narrow down
   - Click "View Details" to see full information

3. **Registering for Events**:
   - Click "Register" button on event card
   - Or click "View Details" then "Register Now"
   - You'll see "Already Registered" if registered

4. **Managing Registrations**:
   - Click "My Registrations" to see all registered events
   - Click "Cancel" to remove registration

### For Admins

1. **Admin Login**:
   - Click "Login as Admin"
   - Use admin email (any email ending with `@admin` or `admin@college`)
   - Enter password and login

2. **Creating Events**:
   - Go to "Create Event" tab
   - Fill in all event details
   - Click "Create Event"

3. **Managing Events**:
   - "All Events" tab shows all created events
   - Click "View" to see registrations
   - Click "Edit" to modify event details
   - Click "Delete" to remove event

4. **Viewing Registrations**:
   - Click "View" button next to any event
   - See all registered students and registration dates

## 🔐 Security Notes

- **Test Mode Firestore**: Make sure to configure security rules before production
- **Admin Emails**: Currently, any email with `@admin` or `admin@college` is treated as admin
- **Password**: Must be at least 6 characters
- **Data Validation**: All inputs are validated on client and server side

## 📱 Responsive Design

The application is fully responsive and works on:
- 📱 Mobile phones
- 📱 Tablets
- 💻 Laptops
- 🖥️ Desktop computers

## 🐛 Troubleshooting

### Problem: "Project config not found"
**Solution**: Make sure you updated `js/firebase-config.js` with your Firebase credentials

### Problem: Login doesn't work
**Solution**:
- Check that Authentication is enabled in Firebase Console
- Verify Email/Password provider is enabled
- Check browser console for error messages (F12)

### Problem: Events not loading
**Solution**:
- Check that Firestore Database is enabled
- Verify your internet connection
- Check browser console for error messages

### Problem: Can't register for events
**Solution**:
- Make sure you're logged in as a student
- Check that the event capacity isn't full
- Try refreshing the page

## 📊 Database Schema

### Collections

**events**
- `title` (string)
- `description` (string)
- `date` (date)
- `time` (time)
- `venue` (string)
- `category` (string)
- `capacity` (number)
- `organizer` (string)
- `registrationCount` (number)
- `createdAt` (timestamp)

**students**
- `uid` (string)
- `name` (string)
- `email` (string)
- `createdAt` (timestamp)

**registrations**
- `studentId` (string)
- `studentEmail` (string)
- `eventId` (string)
- `eventTitle` (string)
- `registeredAt` (timestamp)

## 🎓 Learning Points

This project demonstrates:
- Firebase real-time database operations
- Authentication with Firebase
- CRUD operations in Firestore
- Responsive web design
- DOM manipulation with vanilla JavaScript
- Event handling and delegation
- Modal windows and user interactions

## 📝 Sample Test Data

To test the admin features, create an admin account:
- **Email**: admin@admin.com (or any email with @admin)
- **Password**: Any password (minimum 6 characters)

Create test events to see student registration functionality.

## 🤝 Contributing

Feel free to extend this project with:
- Event editing by students before date
- Email notifications for registrations
- QR code check-in at events
- Event ratings and reviews
- Calendar view for events
- Export registrations as CSV
- Event attendance tracking

## 📄 License

This project is free to use and modify for educational purposes.

## 📞 Support

For issues or questions:
1. Check Firestore rules are set to test mode
2. Verify Firebase config is correct
3. Check browser console (F12) for error messages
4. Review Firebase documentation at firebase.google.com

---

**Happy Event Planning! 🎉**
