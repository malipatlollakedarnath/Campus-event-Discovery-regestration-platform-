const express = require('express');
const { Event, Registration } = require('./models');
const { verifyToken } = require('./auth-routes');

const router = express.Router();

// Admin middleware to verify admin status
const verifyAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    if (!req.user.email.toLowerCase().includes('@admin')) {
      return res.status(403).json({ message: 'Admin access required' });
    }
    next();
  });
};

// Create event
router.post('/events', verifyAdmin, async (req, res) => {
  try {
    const { title, description, date, time, venue, category, capacity, organizer } = req.body;

    if (!title || !description || !date || !time || !venue || !category || !organizer) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const event = new Event({
      title,
      description,
      date: new Date(date),
      time,
      venue,
      category,
      capacity: capacity || 50,
      organizer,
      createdBy: req.user.id,
    });

    await event.save();

    res.status(201).json({
      message: 'Event created successfully',
      event,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create event', error: error.message });
  }
});

// Get all events (admin view with registration counts)
router.get('/events', verifyAdmin, async (req, res) => {
  try {
    const events = await Event.find().sort({ date: 1 });
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch events', error: error.message });
  }
});

// Update event
router.put('/events/:id', verifyAdmin, async (req, res) => {
  try {
    const { title, description, date, time, venue, category, capacity, organizer } = req.body;

    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Update fields
    if (title) event.title = title;
    if (description) event.description = description;
    if (date) event.date = new Date(date);
    if (time) event.time = time;
    if (venue) event.venue = venue;
    if (category) event.category = category;
    if (capacity) event.capacity = capacity;
    if (organizer) event.organizer = organizer;

    await event.save();

    res.json({
      message: 'Event updated successfully',
      event,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update event', error: error.message });
  }
});

// Delete event
router.delete('/events/:id', verifyAdmin, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Delete all registrations for this event
    await Registration.deleteMany({ eventId: req.params.id });

    // Delete event
    await Event.findByIdAndDelete(req.params.id);

    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete event', error: error.message });
  }
});

// Get registrations for an event
router.get('/events/:id/registrations', verifyAdmin, async (req, res) => {
  try {
    const registrations = await Registration.find({ eventId: req.params.id }).sort({ registeredAt: -1 });
    res.json(registrations);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch registrations', error: error.message });
  }
});

module.exports = router;
