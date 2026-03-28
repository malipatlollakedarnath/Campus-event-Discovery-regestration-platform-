const express = require('express');
const { Event, Registration, Student } = require('./models');
const { verifyToken } = require('./auth-routes');

const router = express.Router();

// Get student's registrations
router.get('/registrations', verifyToken, async (req, res) => {
  try {
    const registrations = await Registration.find({ studentId: req.user.id }).sort({ registeredAt: -1 });
    res.json(registrations);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch registrations', error: error.message });
  }
});

// Register for an event
router.post('/register', verifyToken, async (req, res) => {
  try {
    const { eventId } = req.body;

    if (!eventId) {
      return res.status(400).json({ message: 'Event ID is required' });
    }

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Check if already registered
    const existingRegistration = await Registration.findOne({
      studentId: req.user.id,
      eventId: eventId,
    });

    if (existingRegistration) {
      return res.status(400).json({ message: 'Already registered for this event' });
    }

    // Check event capacity
    if (event.registrationCount >= event.capacity) {
      return res.status(400).json({ message: 'Event is full' });
    }

    const student = await Student.findById(req.user.id);

    const registration = new Registration({
      studentId: req.user.id,
      studentEmail: req.user.email,
      eventId: eventId,
      eventTitle: event.title,
    });

    await registration.save();

    // Update registration count
    event.registrationCount += 1;
    await event.save();

    res.status(201).json({
      message: 'Registered for event successfully',
      registration,
    });
  } catch (error) {
    res.status(500).json({ message: 'Registration failed', error: error.message });
  }
});

// Cancel registration
router.delete('/registrations/:registrationId', verifyToken, async (req, res) => {
  try {
    const registration = await Registration.findById(req.params.registrationId);

    if (!registration) {
      return res.status(404).json({ message: 'Registration not found' });
    }

    if (registration.studentId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const event = await Event.findById(registration.eventId);
    if (event) {
      event.registrationCount -= 1;
      await event.save();
    }

    await Registration.findByIdAndDelete(req.params.registrationId);

    res.json({ message: 'Registration cancelled successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to cancel registration', error: error.message });
  }
});

module.exports = router;
