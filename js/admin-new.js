// Admin Dashboard Functions - Updated for REST API

let currentAdmin = null;
let allAdminEvents = [];

// Initialize admin dashboard
document.addEventListener('DOMContentLoaded', async () => {
    // Check if user is logged in as admin
    if (!api.isAuthenticated() || !api.isAdmin()) {
        window.location.href = 'login.html?type=admin';
        return;
    }

    // Load admin email from token
    const token = localStorage.getItem('authToken');
    if (token) {
        const decoded = JSON.parse(atob(token.split('.')[1]));
        document.getElementById('adminEmail').textContent = decoded.email;
    }

    // Load events
    loadAdminEvents();
});

// Load all events for admin
async function loadAdminEvents() {
    try {
        const events = await api.getAdminEvents();
        allAdminEvents = events;
        displayAdminEvents(events);
    } catch (error) {
        console.error('Error loading events:', error);
        showMessage('Failed to load events', 'error');
    }
}

// Display admin events
function displayAdminEvents(events) {
    const eventsContainer = document.getElementById('adminEventsContainer');
    if (!eventsContainer) return;

    eventsContainer.innerHTML = '';

    if (events.length === 0) {
        eventsContainer.innerHTML = '<p style="text-align: center; padding: 2rem;">No events created yet.</p>';
        return;
    }

    events.forEach((event) => {
        const eventDate = new Date(event.date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });

        const eventDiv = document.createElement('div');
        eventDiv.className = 'event-card';
        eventDiv.innerHTML = `
            <div class="event-header">
                <h3>${event.title}</h3>
                <span class="event-category">${event.category}</span>
            </div>
            <p><strong>Date:</strong> ${eventDate} at ${event.time}</p>
            <p><strong>Venue:</strong> ${event.venue}</p>
            <p><strong>Capacity:</strong> ${event.registrationCount}/${event.capacity}</p>
            <div style="display: flex; gap: 0.5rem; margin-top: 1rem;">
                <button class="btn btn-secondary" onclick="viewRegistrations('${event._id}')">View Registrations</button>
                <button class="btn btn-secondary" onclick="openEditModal('${event._id}')">Edit</button>
                <button class="btn btn-danger" onclick="deleteEvent('${event._id}')">Delete</button>
            </div>
        `;
        eventsContainer.appendChild(eventDiv);
    });
}

// Create event
async function createEvent() {
    const title = document.getElementById('eventTitle').value.trim();
    const description = document.getElementById('eventDescription').value.trim();
    const date = document.getElementById('eventDate').value;
    const time = document.getElementById('eventTime').value;
    const venue = document.getElementById('eventVenue').value.trim();
    const category = document.getElementById('eventCategory').value;
    const capacity = parseInt(document.getElementById('eventCapacity').value);
    const organizer = document.getElementById('eventOrganizer').value.trim();

    if (!title || !description || !date || !time || !venue || !category || !organizer || !capacity) {
        showMessage('All fields are required', 'error');
        return;
    }

    try {
        await api.createEvent({
            title,
            description,
            date,
            time,
            venue,
            category,
            capacity,
            organizer,
        });

        showMessage('Event created successfully!', 'success');
        
        // Clear form
        document.getElementById('eventTitle').value = '';
        document.getElementById('eventDescription').value = '';
        document.getElementById('eventDate').value = '';
        document.getElementById('eventTime').value = '';
        document.getElementById('eventVenue').value = '';
        document.getElementById('eventCategory').value = '';
        document.getElementById('eventCapacity').value = '50';
        document.getElementById('eventOrganizer').value = '';

        loadAdminEvents();
    } catch (error) {
        showMessage('Failed to create event: ' + error.message, 'error');
    }
}

// Open edit modal
async function openEditModal(eventId) {
    try {
        const event = await api.getEventDetails(eventId);
        
        document.getElementById('editEventId').value = event._id;
        document.getElementById('editEventTitle').value = event.title;
        document.getElementById('editEventDescription').value = event.description;
        document.getElementById('editEventDate').value = event.date.split('T')[0];
        document.getElementById('editEventTime').value = event.time;
        document.getElementById('editEventVenue').value = event.venue;
        document.getElementById('editEventCategory').value = event.category;
        document.getElementById('editEventCapacity').value = event.capacity;
        document.getElementById('editEventOrganizer').value = event.organizer;
        
        document.getElementById('editEventModal').style.display = 'block';
    } catch (error) {
        showMessage('Failed to load event details', 'error');
    }
}

// Close edit modal
function closeEditModal() {
    document.getElementById('editEventModal').style.display = 'none';
}

// Update event
async function updateEvent() {
    const eventId = document.getElementById('editEventId').value;
    const title = document.getElementById('editEventTitle').value.trim();
    const description = document.getElementById('editEventDescription').value.trim();
    const date = document.getElementById('editEventDate').value;
    const time = document.getElementById('editEventTime').value;
    const venue = document.getElementById('editEventVenue').value.trim();
    const category = document.getElementById('editEventCategory').value;
    const capacity = parseInt(document.getElementById('editEventCapacity').value);
    const organizer = document.getElementById('editEventOrganizer').value.trim();

    if (!title || !description || !date || !time || !venue || !category || !organizer || !capacity) {
        showMessage('All fields are required', 'error');
        return;
    }

    try {
        await api.updateEvent(eventId, {
            title,
            description,
            date,
            time,
            venue,
            category,
            capacity,
            organizer,
        });

        showMessage('Event updated successfully!', 'success');
        closeEditModal();
        loadAdminEvents();
    } catch (error) {
        showMessage('Failed to update event: ' + error.message, 'error');
    }
}

// Delete event
async function deleteEvent(eventId) {
    if (!confirm('Are you sure you want to delete this event? All registrations will be cancelled.')) {
        return;
    }

    try {
        await api.deleteEvent(eventId);
        showMessage('Event deleted successfully!', 'success');
        loadAdminEvents();
    } catch (error) {
        showMessage('Failed to delete event: ' + error.message, 'error');
    }
}

// View registrations
async function viewRegistrations(eventId) {
    try {
        const registrations = await api.getEventRegistrations(eventId);
        const event = await api.getEventDetails(eventId);
        
        const registrationsContainer = document.getElementById('registrationsListContainer');
        registrationsContainer.innerHTML = '';

        let html = `<h3>${event.title} - Registrations (${registrations.length})</h3>`;
        
        if (registrations.length === 0) {
            html += '<p>No registrations yet.</p>';
        } else {
            html += `
                <table style="width: 100%; border-collapse: collapse;">
                    <thead>
                        <tr style="background-color: #f5f5f5;">
                            <th style="padding: 0.5rem; border: 1px solid #ddd; text-align: left;">Email</th>
                            <th style="padding: 0.5rem; border: 1px solid #ddd; text-align: left;">Registered At</th>
                        </tr>
                    </thead>
                    <tbody>
            `;

            registrations.forEach((reg) => {
                const regDate = new Date(reg.registeredAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                });

                html += `
                    <tr>
                        <td style="padding: 0.5rem; border: 1px solid #ddd;">${reg.studentEmail}</td>
                        <td style="padding: 0.5rem; border: 1px solid #ddd;">${regDate}</td>
                    </tr>
                `;
            });

            html += `
                    </tbody>
                </table>
            `;
        }

        registrationsContainer.innerHTML = html;
        document.getElementById('registrationsModal').style.display = 'block';
    } catch (error) {
        showMessage('Failed to load registrations: ' + error.message, 'error');
    }
}

// Close registrations modal
function closeRegistrationsModal() {
    document.getElementById('registrationsModal').style.display = 'none';
}

// Switch tabs
function switchAdminTab(tab) {
    document.querySelectorAll('.admin-tab-content').forEach(el => {
        el.classList.remove('active');
    });
    document.querySelectorAll('.admin-tab-btn').forEach(el => {
        el.classList.remove('active');
    });

    document.getElementById(tab + '-tab').classList.add('active');
    event.target.classList.add('active');
}

// Logout
function adminLogout() {
    api.clearAuth();
    window.location.href = 'login.html';
}

// Show message
function showMessage(message, type = 'info') {
    console.log(`${type.toUpperCase()}: ${message}`);
}
