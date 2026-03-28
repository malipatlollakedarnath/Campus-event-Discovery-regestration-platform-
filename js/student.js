// Student Dashboard Functions - Updated for REST API

let currentUser = null;
let allEvents = [];

// Initialize student dashboard
document.addEventListener('DOMContentLoaded', async () => {
    // Check if user is logged in as student
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
    if (loadingMessage) loadingMessage.style.display = 'block';

    try {
        const events = await api.getAllEvents();
        if (loadingMessage) loadingMessage.style.display = 'none';
        allEvents = events;

        if (allEvents.length === 0) {
            eventsGrid.innerHTML = '<p style="text-align: center; grid-column: 1/-1; padding: 2rem;">No events found. Check back soon!</p>';
            return;
        }

        displayEvents(allEvents);
    } catch (error) {
        if (loadingMessage) loadingMessage.style.display = 'none';
        eventsGrid.innerHTML = '<p style="text-align: center; grid-column: 1/-1; color: #d32f2f;">Failed to load events</p>';
        console.error('Error loading events:', error);
    }
}

// Display events in grid
function displayEvents(events) {
    const eventsGrid = document.getElementById('eventsGrid');
    eventsGrid.innerHTML = '';

    if (events.length === 0) {
        eventsGrid.innerHTML = '<p style="text-align: center; grid-column: 1/-1; padding: 2rem;">No events match your filter.</p>';
        return;
    }

    events.forEach((event) => {
        const eventCard = createEventCard(event);
        eventsGrid.appendChild(eventCard);
    });
}

// Create event card element
function createEventCard(event) {
    const card = document.createElement('div');
    card.className = 'event-card';

    const eventDate = new Date(event.date);
    const dateStr = eventDate.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });

    const isFull = event.registrationCount >= event.capacity;

    card.innerHTML = `
        <div class="event-header">
            <span class="event-category">${event.category}</span>
            <div class="event-title">${event.title}</div>
            <div style="font-size: 0.9rem; opacity: 0.9;">${dateStr} at ${event.time}</div>
        </div>
        <div class="event-body">
            <div class="event-meta">
                <span>📍 ${event.venue}</span>
                <span>👤 ${event.organizer}</span>
            </div>
            <div class="event-description">${event.description}</div>
            <div class="event-footer">
                <button class="btn btn-view" onclick="showEventDetails('${event._id}')">View Details</button>
                <button class="btn ${isFull ? 'btn-registered' : 'btn-register'}" 
                        id="register-${event._id}" 
                        onclick="registerForEvent('${event._id}')"
                        ${isFull ? 'disabled' : ''}>
                    ${isFull ? 'Event Full' : 'Register'}
                </button>
            </div>
        </div>
    `;

    return card;
}

// Show event details
async function showEventDetails(eventId) {
    try {
        const event = await api.getEventDetails(eventId);
        const modal = document.getElementById('eventModal');
        const detailsDiv = document.getElementById('eventDetails');

        const eventDate = new Date(event.date);
        const dateStr = eventDate.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        const isFull = event.registrationCount >= event.capacity;

        let registerBtn = '';
        if (!isFull) {
            registerBtn = `<button class="btn btn-primary" style="width: 100%; margin-bottom: 0.5rem;" onclick="registerForEvent('${eventId}'); closeEventModal();">Register Now</button>`;
        } else {
            registerBtn = `<button class="btn btn-registered" disabled style="width: 100%; margin-bottom: 0.5rem;">Event Full</button>`;
        }

        detailsDiv.innerHTML = `
            <div class="detail-group">
                <div class="detail-label">Event Title</div>
                <div class="detail-value">${event.title}</div>
            </div>
            <div class="detail-group">
                <div class="detail-label">Category</div>
                <div class="detail-value">${event.category}</div>
            </div>
            <div class="detail-group">
                <div class="detail-label">Description</div>
                <div class="detail-value">${event.description}</div>
            </div>
            <div class="detail-group">
                <div class="detail-label">Date & Time</div>
                <div class="detail-value">${dateStr} at ${event.time}</div>
            </div>
            <div class="detail-group">
                <div class="detail-label">Venue</div>
                <div class="detail-value">${event.venue}</div>
            </div>
            <div class="detail-group">
                <div class="detail-label">Organizer</div>
                <div class="detail-value">${event.organizer}</div>
            </div>
            <div class="detail-group">
                <div class="detail-label">Registrations</div>
                <div class="detail-value">${event.registrationCount || 0} / ${event.capacity}</div>
            </div>
            <div class="modal-buttons">
                ${registerBtn}
                <button class="btn btn-secondary" onclick="closeEventModal()">Close</button>
            </div>
        `;

        modal.style.display = 'flex';
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
        closeEventModal();
    } catch (error) {
        showMessage('Registration failed: ' + error.message, 'error');
    }
}

// Filter events
function filterEvents() {
    const category = document.getElementById('categoryFilter').value;

    if (!category) {
        displayEvents(allEvents);
    } else {
        const filtered = allEvents.filter(event => event.category === category);
        displayEvents(filtered);
    }
}

// View my registrations
async function viewMyRegistrations() {
    const modal = document.getElementById('eventModal');
    const detailsDiv = document.getElementById('eventDetails');

    detailsDiv.innerHTML = '<div class="loading">Loading your registrations...</div>';
    modal.style.display = 'flex';

    try {
        const registrations = await api.getMyRegistrations();

        if (registrations.length === 0) {
            detailsDiv.innerHTML = `
                <h2>My Registrations</h2>
                <p style="text-align: center; padding: 2rem;">You haven't registered for any events yet.</p>
                <button class="btn btn-primary" style="width: 100%;" onclick="closeEventModal()">Browse Events</button>
            `;
            return;
        }

        let html = '<h2>My Registrations</h2><div class="registrations-list">';

        registrations.forEach((reg) => {
            const regDate = new Date(reg.registeredAt).toLocaleDateString();
            html += `
                <div class="registration-item">
                    <div>
                        <div class="registration-name">${reg.eventTitle}</div>
                        <div class="registration-email">Registered on ${regDate}</div>
                    </div>
                    <button class="btn btn-danger btn-small" onclick="cancelRegistration('${reg._id}')">Cancel</button>
                </div>
            `;
        });

        html += '</div><button class="btn btn-secondary" style="width: 100%; margin-top: 1rem;" onclick="closeEventModal()">Close</button>';
        detailsDiv.innerHTML = html;
    } catch (error) {
        showMessage('Error loading registrations: ' + error.message, 'error');
    }
}

// Cancel registration
async function cancelRegistration(registrationId) {
    if (confirm('Are you sure you want to cancel this registration?')) {
        try {
            await api.cancelRegistration(registrationId);
            showMessage('Registration cancelled', 'success');
            viewMyRegistrations();
            loadEvents();
        } catch (error) {
            showMessage('Error cancelling registration: ' + error.message, 'error');
        }
    }
}

// Close event modal
function closeEventModal() {
    document.getElementById('eventModal').style.display = 'none';
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('eventModal');
    if (event.target == modal) {
        modal.style.display = 'none';
    }
}

// Logout
function logout() {
    api.clearAuth();
    window.location.href = 'login.html';
}

// Show message
function showMessage(message, type = 'info') {
    const messageEl = document.getElementById('message');
    if (messageEl) {
        messageEl.textContent = message;
        messageEl.className = `message ${type}`;
        messageEl.style.display = 'block';
        setTimeout(() => {
            messageEl.style.display = 'none';
        }, 3000);
    } else {
        console.log(`${type.toUpperCase()}: ${message}`);
    }
}
