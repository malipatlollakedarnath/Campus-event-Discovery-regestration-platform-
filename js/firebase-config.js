// Firebase Configuration
// Instructions to set up Firebase:
// 1. Go to https://firebase.google.com/
// 2. Click "Get started"
// 3. Create a new project
// 4. Add a web app to your project
// 5. Copy your Firebase config from the settings
// 6. Replace the config object below with your settings:
// 7. Enable Firestore Database and Authentication in Firebase Console
// 8. Enable Email/Password authentication in Firebase Console

// Replace this with your Firebase config
const firebaseConfig = {
    apiKey: "AIzaSyDxxxxxxxxxxxxxxxxxxxxxxxxx",
    authDomain: "campus-events-xxxxx.firebaseapp.com",
    projectId: "campus-events-xxxxx",
    storageBucket: "campus-events-xxxxx.appspot.com",
    messagingSenderId: "xxxxxxxxx",
    appId: "1:xxxxxxxxx:web:xxxxxxxxxxxxxxx"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Get Firebase services
const auth = firebase.auth();
const db = firebase.firestore();

// Helper function to show messages
function showMessage(message, type = 'info', elementId = 'message') {
    const msgElement = document.getElementById(elementId);
    if (msgElement) {
        msgElement.textContent = message;
        msgElement.className = `message show ${type}`;
        setTimeout(() => {
            msgElement.className = 'message';
        }, 5000);
    }
}

// Check if user is admin (based on email domain)
function isAdmin(email) {
    return email.includes('@admin') || email.includes('admin@college');
}

// Logout function
function logout() {
    auth.signOut().then(() => {
        window.location.href = 'index.html';
    }).catch((error) => {
        console.error('Logout error:', error);
    });
}
