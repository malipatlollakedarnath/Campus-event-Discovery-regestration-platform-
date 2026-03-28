// In-memory database mock for testing without MongoDB
let nextId = 1000;

const generateId = () => {
  return { toString: () => (nextId++).toString(), _id: (nextId - 1).toString() };
};

const db = {
  students: [],
  events: [],
  registrations: [],
  admins: [],
};

// Pre-populate with sample events
db.events.push({
  _id: '1',
  title: 'Tech Hackathon 2026',
  description: '24-hour coding competition with prizes',
  date: new Date('2026-04-15'),
  time: '10:00 AM',
  venue: 'Tech Building Auditorium',
  category: 'Technical',
  capacity: 100,
  registrationCount: 0,
  organizer: 'CS Club',
  createdBy: 'admin1',
  createdAt: new Date(),
});

db.events.push({
  _id: '2',
  title: 'Annual Science Fair',
  description: 'Showcase your innovative projects',
  date: new Date('2026-05-01'),
  time: '2:00 PM',
  venue: 'Science Center',
  category: 'Science',
  capacity: 50,
  registrationCount: 0,
  organizer: 'Science Club',
  createdBy: 'admin1',
  createdAt: new Date(),
});

db.events.push({
  _id: '3',
  title: 'Career Fair 2026',
  description: 'Meet with top companies and network',
  date: new Date('2026-04-20'),
  time: '11:00 AM',
  venue: 'Main Hall',
  category: 'Career',
  capacity: 200,
  registrationCount: 0,
  organizer: 'Career Services',
  createdBy: 'admin1',
  createdAt: new Date(),
});

// Query wrapper to mimic Mongoose Query object
class Query {
  constructor(data = []) {
    this._data = [...data];
    this._sortFn = null;
  }

  sort(sortObj) {
    if (typeof sortObj === 'object') {
      for (const [key, order] of Object.entries(sortObj)) {
        this._data.sort((a, b) => {
          if (order === 1) {
            return a[key] > b[key] ? 1 : -1;
          } else {
            return a[key] < b[key] ? 1 : -1;
          }
        });
      }
    }
    return this;
  }

  async exec() {
    return this._data;
  }

  then(onFulfilled, onRejected) {
    return Promise.resolve(this._data).then(onFulfilled, onRejected);
  }

  [Symbol.toStringTag] = 'Query';
}

// Model classes that mimic Mongoose
class Model {
  constructor(data) {
    this._id = generateId().toString();
    Object.assign(this, data);
  }

  async save() {
    return this;
  }

  toString() {
    return this._id;
  }
}

class Student extends Model {
  static async findOne(query) {
    return db.students.find(
      s => s.email === query.email || s._id === query._id
    ) || null;
  }

  static async find(query = {}) {
    return db.students;
  }

  static async findById(id) {
    return db.students.find(s => s._id === id) || null;
  }

  async save() {
    const existing = db.students.find(s => s._id === this._id);
    if (!existing) {
      db.students.push(this);
    } else {
      Object.assign(existing, this);
    }
    return this;
  }
}

class Event extends Model {
  static async findOne(query) {
    return db.events.find(e => e._id === query._id) || null;
  }

  static find(query = {}) {
    return new Query(db.events);
  }

  static async findById(id) {
    return db.events.find(e => e._id === id) || null;
  }

  static async findByIdAndDelete(id) {
    const index = db.events.findIndex(e => e._id === id);
    if (index > -1) {
      return db.events.splice(index, 1)[0];
    }
    return null;
  }

  async save() {
    const existing = db.events.find(e => e._id === this._id);
    if (!existing) {
      db.events.push(this);
    } else {
      Object.assign(existing, this);
    }
    return this;
  }
}

class Registration extends Model {
  static async findOne(query) {
    return db.registrations.find(
      r => (query.studentId && r.studentId === query.studentId && r.eventId === query.eventId) ||
            r._id === query._id
    ) || null;
  }

  static find(query = {}) {
    let filtered = db.registrations;
    if (query.studentId) {
      filtered = db.registrations.filter(r => r.studentId === query.studentId);
    }
    if (query.eventId) {
      filtered = db.registrations.filter(r => r.eventId === query.eventId);
    }
    return new Query(filtered);
  }

  static async findById(id) {
    return db.registrations.find(r => r._id === id) || null;
  }

  static async findByIdAndDelete(id) {
    const index = db.registrations.findIndex(r => r._id === id);
    if (index > -1) {
      return db.registrations.splice(index, 1)[0];
    }
    return null;
  }

  static async deleteMany(query) {
    if (query.eventId) {
      db.registrations = db.registrations.filter(r => r.eventId !== query.eventId);
    }
    return { deletedCount: 0 };
  }

  async save() {
    if (!this._id) {
      this._id = generateId().toString();
    }
    const existing = db.registrations.find(r => r._id === this._id);
    if (!existing) {
      db.registrations.push(this);
    } else {
      Object.assign(existing, this);
    }
    return this;
  }
}

class Admin extends Model {
  static async findOne(query) {
    return db.admins.find(
      a => a.email === query.email || a._id === query._id
    ) || null;
  }

  static async find(query = {}) {
    return db.admins;
  }

  static async findById(id) {
    return db.admins.find(a => a._id === id) || null;
  }

  async save() {
    if (!this._id) {
      this._id = generateId().toString();
    }
    const existing = db.admins.find(a => a._id === this._id);
    if (!existing) {
      db.admins.push(this);
    } else {
      Object.assign(existing, this);
    }
    return this;
  }
}

module.exports = {
  Student,
  Event,
  Registration,
  Admin,
  db, // Export db for debugging
};
