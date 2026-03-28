// API Client Module - Handles all backend API calls
const API_BASE_URL = 'http://localhost:3002/api';

class APIClient {
  constructor() {
    this.token = localStorage.getItem('authToken') || null;
    this.userRole = localStorage.getItem('userRole') || null;
    this.userId = localStorage.getItem('userId') || null;
  }

  setToken(token, role = 'student', userId = null) {
    this.token = token;
    this.userRole = role;
    this.userId = userId;
    localStorage.setItem('authToken', token);
    localStorage.setItem('userRole', role);
    if (userId) localStorage.setItem('userId', userId);
  }

  clearAuth() {
    this.token = null;
    this.userRole = null;
    this.userId = null;
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userId');
  }

  getHeaders() {
    const headers = { 'Content-Type': 'application/json' };
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }
    return headers;
  }

  async request(endpoint, method = 'GET', data = null) {
    const url = `${API_BASE_URL}${endpoint}`;
    const options = {
      method,
      headers: this.getHeaders(),
    };

    if (data) {
      options.body = JSON.stringify(data);
    }

    try {
      const response = await fetch(url, options);
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'API request failed');
      }

      return result;
    } catch (error) {
      console.error(`API Error (${method} ${endpoint}):`, error);
      throw error;
    }
  }

  // ==================== AUTHENTICATION ====================

  async registerStudent(name, email, password) {
    const result = await this.request('/auth/register', 'POST', {
      name,
      email,
      password,
    });
    this.setToken(result.token, 'student', result.student.id);
    return result;
  }

  async loginStudent(email, password) {
    const result = await this.request('/auth/login', 'POST', {
      email,
      password,
    });
    this.setToken(result.token, 'student', result.student.id);
    return result;
  }

  async loginAdmin(email, password) {
    const result = await this.request('/auth/admin-login', 'POST', {
      email,
      password,
    });
    this.setToken(result.token, 'admin', result.admin.id);
    return result;
  }

  async verifyToken() {
    if (!this.token) return false;
    try {
      await this.request('/auth/verify', 'GET');
      return true;
    } catch {
      this.clearAuth();
      return false;
    }
  }

  // ==================== EVENTS ====================

  async getAllEvents() {
    return await this.request('/events', 'GET');
  }

  async getEventDetails(eventId) {
    return await this.request(`/events/${eventId}`, 'GET');
  }

  // ==================== STUDENT FUNCTIONS ====================

  async getMyRegistrations() {
    return await this.request('/student/registrations', 'GET');
  }

  async registerForEvent(eventId) {
    return await this.request('/student/register', 'POST', { eventId });
  }

  async cancelRegistration(registrationId) {
    return await this.request(`/student/registrations/${registrationId}`, 'DELETE');
  }

  // ==================== ADMIN FUNCTIONS ====================

  async createEvent(eventData) {
    return await this.request('/admin/events', 'POST', eventData);
  }

  async updateEvent(eventId, eventData) {
    return await this.request(`/admin/events/${eventId}`, 'PUT', eventData);
  }

  async deleteEvent(eventId) {
    return await this.request(`/admin/events/${eventId}`, 'DELETE');
  }

  async getAdminEvents() {
    return await this.request('/admin/events', 'GET');
  }

  async getEventRegistrations(eventId) {
    return await this.request(`/admin/events/${eventId}/registrations`, 'GET');
  }

  isAuthenticated() {
    return !!this.token;
  }

  isAdmin() {
    return this.userRole === 'admin';
  }

  isStudent() {
    return this.userRole === 'student';
  }
}

// Create global instance
const api = new APIClient();
