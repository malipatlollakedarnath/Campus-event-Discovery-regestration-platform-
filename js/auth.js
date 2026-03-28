// Authentication Handler - Updated for REST API

// Show message function
function showMessage(message, type = 'info') {
    const messageEl = document.getElementById('message');
    if (messageEl) {
        messageEl.textContent = message;
        messageEl.className = `message ${type}`;
        messageEl.style.display = 'block';
        if (type === 'error') {
            setTimeout(() => {
                messageEl.style.display = 'none';
            }, 5000);
        }
    } else {
        console.log(`${type.toUpperCase()}: ${message}`);
    }
}

// Switch between tabs
function switchTab(tab) {
    // Hide all tabs
    document.getElementById('student-tab').classList.remove('active');
    document.getElementById('admin-tab').classList.remove('active');

    // Remove active class from buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    // Show selected tab
    if (tab === 'student') {
        document.getElementById('student-tab').classList.add('active');
        document.querySelectorAll('.tab-btn')[0].classList.add('active');
    } else {
        document.getElementById('admin-tab').classList.add('active');
        document.querySelectorAll('.tab-btn')[1].classList.add('active');
    }
}

// Toggle between login and register
function showRegister() {
    document.getElementById('studentLoginForm').style.display = 'none';
    document.getElementById('studentRegisterForm').style.display = 'block';
}

function showLogin() {
    document.getElementById('studentLoginForm').style.display = 'block';
    document.getElementById('studentRegisterForm').style.display = 'none';
}

// Ensure forms exist before adding event listeners
document.addEventListener('DOMContentLoaded', () => {
    // Student Login Form
    const studentLoginForm = document.getElementById('studentLoginForm');
    if (studentLoginForm) {
        studentLoginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('studentEmail').value.trim();
            const password = document.getElementById('studentPassword').value;

            if (!email || !password) {
                showMessage('Please fill in all fields', 'error');
                return;
            }

            try {
                const result = await api.loginStudent(email, password);
                showMessage('Login successful!', 'success');
                // Redirect immediately without delay
                window.location.href = 'student-dashboard.html';
            } catch (error) {
                showMessage('Login failed: ' + error.message, 'error');
            }
        });
    }

    // Student Register Form
    const studentRegisterForm = document.getElementById('studentRegisterForm');
    if (studentRegisterForm) {
        studentRegisterForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const name = document.getElementById('studentRegName').value.trim();
            const email = document.getElementById('studentRegEmail').value.trim();
            const password = document.getElementById('studentRegPassword').value;

            if (!name || !email || !password) {
                showMessage('Please fill in all fields', 'error');
                return;
            }

            if (password.length < 6) {
                showMessage('Password must be at least 6 characters', 'error');
                return;
            }

            // Check if using admin email
            if (email.toLowerCase().includes('@admin')) {
                showMessage('Cannot register as student with admin email', 'error');
                return;
            }

            try {
                const result = await api.registerStudent(name, email, password);
                showMessage('Registration successful!', 'success');
                // Redirect immediately to dashboard
                window.location.href = 'student-dashboard.html';
            } catch (error) {
                showMessage('Registration failed: ' + error.message, 'error');
            }
        });
    }

    // Admin Login Form
    const adminLoginForm = document.getElementById('adminLoginForm');
    if (adminLoginForm) {
        adminLoginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('adminEmail').value.trim();
            const password = document.getElementById('adminPassword').value;

            if (!email || !password) {
                showMessage('Please fill in all fields', 'error');
                return;
            }

            // Check if email is admin email
            if (!email.toLowerCase().includes('@admin')) {
                showMessage('Invalid admin email (must contain @admin)', 'error');
                return;
            }

            try {
                const result = await api.loginAdmin(email, password);
                showMessage('Admin login successful!', 'success');
                // Redirect immediately to admin dashboard
                window.location.href = 'admin-dashboard.html';
            } catch (error) {
                showMessage('Admin login failed: ' + error.message, 'error');
            }
        });
    }
});

// Check URL params for login type
document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const type = params.get('type');
    if (type === 'admin') {
        switchTab('admin');
    }
});
