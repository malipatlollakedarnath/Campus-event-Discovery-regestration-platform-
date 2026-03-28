// Using in-memory mock database for frontend testing
// Replace with real MongoDB by reverting to mongoose models if needed

const { Student, Event, Registration, Admin } = require('./mock-db');

module.exports = {
  Student,
  Event,
  Registration,
  Admin,
};
