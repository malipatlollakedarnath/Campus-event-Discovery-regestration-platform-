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

    // Set up form handlers
    setupFormHandlers();
});

// Set up form handlers
function setupFormHandlers() {
    // Create event form
    const createForm = document.getElementById('createEventForm');
    if (createForm) {
        createForm.addEventListener('submit', (e) => {
            e.preventDefault();
            createEvent();
        });
    }

    // Edit event form
    const editForm = document.getElementById('editEventForm');
    if (editForm) {
        editForm.addEventListener('submit', (e) => {
            e.preventDefault();
            updateEvent();
        });
    }
}

// Load all events for admin
async function loadAdminEvents() {
    try {
        const events = await api.getAdminEvents();
        allAdminEvents = events;
        displayAdminEvents(allAdminEvents);
    } catch (error) {
        showMessage('Error loading events: ' + error.message, 'error', 'message');
    }
}

// Display events in admin table
function displayAdminEvents(events) {
    const eventsTable = document.getElementById('eventsTable');

    if (events.length === 0) {
        eventsTable.innerHTML = '<p style="text-align: center; padding: 2rem;">No events yet. Create one to get started!</p>';
        return;
    }

    let html = `
        <table class="table">
            <thead>
                <tr>
                    <th>Title</th>
                    <th>Date & Time</th>
                    <th>Category</th>
                    <th>Registrations</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
    `;

    events.forEach((event) => {
        const eventDate = new Date(event.date);
        const dateStr = eventDate.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });

        const registrationCount = event.registrationCount || 0;

        html += `
            <tr>
                <td><strong>${event.title}</strong></td>
                <td>${dateStr} ${event.time}</td>
                <td><span class="event-category" style="display: inline-block;">${event.category}</span></td>
                <td>${registrationCount} / ${event.capacity}</td>
                <td>
                    <div class="table-actions">
                        <button class="btn btn-view-registrations btn-small" onclick="viewRegistrations('${event._id}')">View</button>
                        <button class="btn btn-edit btn-small" onclick="openEditModal('${event._id}')">Edit</button>
                        <button class="btn btn-delete btn-small" onclick="deleteEvent('${event._id}')">Delete</button>
                    </div>
                </td>
            </tr>
        `;
    });

    html += `
            </tbody>
        </table>
    `;

    eventsTable.innerHTML = html;
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

    if (!title || !description || !date || !time || !venue || !category || !capacity || !organizer) {
        showMessage('Please fill in all fields', 'error', 'message');
        return;
    }

    if (capacity < 1) {
        showMessage('Capacity must be at least 1', 'error', 'message');
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

        showMessage('Event created successfully!', 'success', 'message');
        document.getElementById('createEventForm').reset();
        loadAdminEvents();
        showSection('events');
    } catch (error) {
        showMessage('Error creating event: ' + error.message, 'error', 'message');
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
        
        document.getElementById('editModal').style.display = 'flex';
    } catch (error) {
        showMessage('Failed to load event details', 'error', 'message');
    }
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

    if (!title || !description || !date || !time || !venue || !category || !capacity || !organizer) {
        showMessage('Please fill in all fields', 'error', 'message');
        return;
    }

    const event = allAdminEvents.find(e => e._id === eventId);
    if (!event) return;

    const currentRegistrations = event.registrationCount || 0;
    if (capacity < currentRegistrations) {
        showMessage(`Cannot reduce capacity below current registrations (${currentRegistrations})`, 'error', 'message');
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

        showMessage('Event updated successfully!', 'success', 'message');
        closeEditModal();
        loadAdminEvents();
    } catch (error) {
        showMessage('Error updating event: ' + error.message, 'error', 'message');
    }
}

// Delete event
async function deleteEvent(eventId) {
    if (!confirm('Are you sure you want to delete this event? All registrations will be deleted.')) {
        return;
    }

    try {
        await api.deleteEvent(eventId);
        showMessage('Event deleted successfully!', 'success', 'message');
        loadAdminEvents();
    } catch (error) {
        showMessage('Error deleting event: ' + error.message, 'error', 'message');
    }
}

// View registrations for an event
async function viewRegistrations(eventId) {
    const event = allAdminEvents.find(e => e._id === eventId);
    if (!event) return;

    const modal = document.getElementById('registrationsModal');
    const listDiv = document.getElementById('registrationsList');

    listDiv.innerHTML = '<div class="loading">Loading registrations...</div>';
    modal.style.display = 'flex';

    try {
        const registrations = await api.getEventRegistrations(eventId);

        if (registrations.length === 0) {
            listDiv.innerHTML = `
                <h3>${event.title}</h3>
                <p style="text-align: center; padding: 2rem;">No registrations yet.</p>
            `;
            return;
        }

        let html = `
            <h3>${event.title}</h3>
            <p style="color: #666; margin-bottom: 1rem;">Total: ${registrations.length} registrations</p>
            <ul class="registrations-list">
        `;

        registrations.forEach((reg) => {
            const regDate = new Date(reg.registeredAt).toLocaleDateString();
            html += `
                <li class="registration-item">
                    <div>
                        <div class="registration-name">${reg.studentEmail || 'Unknown'}</div>
                        <div class="registration-time">Registered on ${regDate}</div>
                    </div>
                </li>
            `;
        });

        html += '</ul>';
        listDiv.innerHTML = html;
    } catch (error) {
        listDiv.innerHTML = `<p style="color: red;">Error loading registrations: ${error.message}</p>`;
    }
}

// Show section
function showSection(sectionName) {
    const sections = document.querySelectorAll('.section');
    const menuItems = document.querySelectorAll('.menu-item');

    sections.forEach(section => section.classList.remove('active'));
    menuItems.forEach(item => item.classList.remove('active'));

    const section = document.getElementById(sectionName + '-section');
    if (section) {
        section.classList.add('active');
    }

    if (event.target && event.target.classList.contains('menu-item')) {
        event.target.classList.add('active');
    }

    if (sectionName === 'events') {
        loadAdminEvents();
    }
}

// Close edit modal
function closeEditModal() {
    document.getElementById('editModal').style.display = 'none';
}

// Close registrations modal
function closeRegistrationsModal() {
    document.getElementById('registrationsModal').style.display = 'none';
}

// Logout
function adminLogout() {
    api.clearAuth();
    window.location.href = 'login.html';
}

// Close modal when clicking outside
window.onclick = function(event) {
    const editModal = document.getElementById('editModal');
    const regModal = document.getElementById('registrationsModal');

    if (event.target == editModal) {
        editModal.style.display = 'none';
    }
    if (event.target == regModal) {
        regModal.style.display = 'none';
    }
}

// Show message
function showMessage(message, type = 'info', elementId = 'message') {
    const messageEl = document.getElementById(elementId);
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

// Set first menu item as active on load
document.addEventListener('DOMContentLoaded', () => {
    const firstMenuItem = document.querySelector('.menu-item');
    if (firstMenuItem) {
        firstMenuItem.classList.add('active');
    }
});
