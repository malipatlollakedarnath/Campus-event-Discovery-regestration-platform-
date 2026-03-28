// Student Dashboard Functions - Updated for REST API

let currentUser = null;
let allEvents = [];

// Initialize student dashboard
document.addEventListener('DOMContentLoaded', async () => {
    // Check if user is logged in
    if (!api.isAuthenticated() || !api.isStudent()) {
        window.location.href = 'login.html';
        return;
    }

    // Load user email from token
    const token = localStorage.getItem('authToken');
    if (token) {
        const decoded = JSON.parse(atob(token.split('.')[1]));
        document.getElementById('userEmail').textContent = decoded.email;
    }

    // Load events
    loadEvents();
});

// Load events
async function loadEvents() {
    const eventsGrid = document.getElementById('eventsGrid');
    const loadingMessage = document.getElementById('loadingMessage');

    eventsGrid.innerHTML = '';
    loadingMessage.style.display = 'block';

    try {
        const events = await api.getAllEvents();
        loadingMessage.style.display = 'none';
        allEvents = events;

        if (allEvents.length === 0) {
            eventsGrid.innerHTML = '<p style="text-align: center; grid-column: 1/-1; padding: 2rem;">No events found. Check back soon!</p>';
            return;
        }

        displayEvents(allEvents);
    } catch (error) {
        loadingMessage.style.display = 'none';
        eventsGrid.innerHTML = '<p style="text-align: center; grid-column: 1/-1; color: #d32f2f;">Failed to load events</p>';
        console.error('Error loading events:', error);
    }
}

// Display events in grid
function displayEvents(events) {
    const eventsGrid = document.getElementById('eventsGrid');
    eventsGrid.innerHTML = '';

    events.forEach((event) => {
        const eventCard = document.createElement('div');
        eventCard.className = 'event-card';
        
        const eventDate = new Date(event.date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });

        const isFull = event.registrationCount >= event.capacity;

        eventCard.innerHTML = `
            <div class="event-header">
                <h3>${event.title}</h3>
                <span class="event-category">${event.category}</span>
            </div>
            <p><strong>Date:</strong> ${eventDate}</p>
            <p><strong>Time:</strong> ${event.time}</p>
            <p><strong>Venue:</strong> ${event.venue}</p>
            <p><strong>Organizer:</strong> ${event.organizer}</p>
            <p><strong>Capacity:</strong> ${event.registrationCount}/${event.capacity}</p>
            <div style="margin-top: 1rem;">
                <button class="btn btn-secondary" onclick="viewEventDetails('${event._id}')">View Details</button>
                <button class="btn ${isFull ? 'btn-disabled' : 'btn-primary'}" 
                        onclick="registerForEvent('${event._id}')" 
                        ${isFull ? 'disabled' : ''}>
                    ${isFull ? 'Event Full' : 'Register'}
                </button>
            </div>
        `;
        eventsGrid.appendChild(eventCard);
    });
}

// View event details
async function viewEventDetails(eventId) {
    try {
        const event = await api.getEventDetails(eventId);
        
        const modalContent = document.getElementById('eventDetailContent');
        const eventDate = new Date(event.date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
        const isFull = event.registrationCount >= event.capacity;

        modalContent.innerHTML = `
            <h3>${event.title}</h3>
            <p><strong>Category:</strong> ${event.category}</p>
            <p><strong>Date:</strong> ${eventDate}</p>
            <p><strong>Time:</strong> ${event.time}</p>
            <p><strong>Venue:</strong> ${event.venue}</p>
            <p><strong>Organizer:</strong> ${event.organizer}</p>
            <p><strong>Description:</strong></p>
            <p>${event.description}</p>
            <p><strong>Capacity:</strong> ${event.registrationCount}/${event.capacity}</p>
            <button class="btn ${isFull ? 'btn-disabled' : 'btn-primary'}" 
                    onclick="registerForEvent('${event._id}')"
                    ${isFull ? 'disabled' : ''}>
                ${isFull ? 'Event Full' : 'Register Now'}
            </button>
        `;
        
        document.getElementById('eventDetailModal').style.display = 'block';
    } catch (error) {
        showMessage('Failed to load event details', 'error');
    }
}

// Register for event
async function registerForEvent(eventId) {
    try {
        await api.registerForEvent(eventId);
        showMessage('Successfully registered for event!', 'success');
        loadEvents();
        closeEventDetailModal();
    } catch (error) {
        showMessage('Registration failed: ' + error.message, 'error');
    }
}

// Filter events by category
function filterByCategory() {
    const categoryFilter = document.getElementById('categoryFilter').value;

    if (categoryFilter === 'all') {
        displayEvents(allEvents);
    } else {
        const filtered = allEvents.filter((event) => event.category === categoryFilter);
        displayEvents(filtered);
    }
}

// Load registrations
async function loadRegistrations() {
    const registrationsContainer = document.getElementById('registrationsContainer');
    registrationsContainer.innerHTML = '<p>Loading your registrations...</p>';

    try {
        const registrations = await api.getMyRegistrations();

        if (registrations.length === 0) {
            registrationsContainer.innerHTML = '<p>You have not registered for any events yet.</p>';
            return;
        }

        let html = '<div style="display: grid; gap: 1rem;">';
        for (const reg of registrations) {
            const event = await api.getEventDetails(reg.eventId);
            const eventDate = new Date(reg.registeredAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
            });

            html += `
                <div class="event-card">
                    <div class="event-header">
                        <h3>${reg.eventTitle}</h3>
                    </div>
                    <p><strong>Registered on:</strong> ${eventDate}</p>
                    <button class="btn btn-danger" onclick="cancelRegistration('${reg._id}')">
                        Cancel Registration
                    </button>
                </div>
            `;
        }
        html += '</div>';
        registrationsContainer.innerHTML = html;
    } catch (error) {
        registrationsContainer.innerHTML = '<p style="color: #d32f2f;">Failed to load registrations</p>';
        console.error('Error loading registrations:', error);
    }
}

// Cancel registration
async function cancelRegistration(registrationId) {
    if (!confirm('Are you sure you want to cancel this registration?')) {
        return;
    }

    try {
        await api.cancelRegistration(registrationId);
        showMessage('Registration cancelled successfully', 'success');
        loadRegistrations();
    } catch (error) {
        showMessage('Failed to cancel registration: ' + error.message, 'error');
    }
}

// Close event detail modal
function closeEventDetailModal() {
    document.getElementById('eventDetailModal').style.display = 'none';
}

// Logout
function logout() {
    api.clearAuth();
    window.location.href = 'login.html';
}

// Show message
function showMessage(message, type = 'info') {
    // Implementation depends on your HTML structure
    console.log(`${type.toUpperCase()}: ${message}`);
}
