const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Student, Admin } = require('./models');

const router = express.Router();

// Generate JWT Token
const generateToken = (id, email) => {
  return jwt.sign({ id, email }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// Middleware to verify token
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token provided' });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ message: 'Invalid token' });
    req.user = decoded;
    next();
  });
};

// Student Registration
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    const existingStudent = await Student.findOne({ email: email.toLowerCase() });
    if (existingStudent) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const student = new Student({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
    });

    await student.save();
    const token = generateToken(student._id, student.email);

    res.status(201).json({
      message: 'Student registered successfully',
      token,
      student: { id: student._id, name: student.name, email: student.email },
    });
  } catch (error) {
    res.status(500).json({ message: 'Registration failed', error: error.message });
  }
});

// Student Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const student = await Student.findOne({ email: email.toLowerCase() });
    if (!student) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const isPasswordValid = await bcrypt.compare(password, student.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const token = generateToken(student._id, student.email);

    res.json({
      message: 'Login successful',
      token,
      student: { id: student._id, name: student.name, email: student.email },
    });
  } catch (error) {
    res.status(500).json({ message: 'Login failed', error: error.message });
  }
});

// Admin Login
router.post('/admin-login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Check if email ends with @admin or admin@college for admin authorization
    if (!email.toLowerCase().includes('@admin')) {
      return res.status(403).json({ message: 'Only admin emails are allowed' });
    }

    let admin = await Admin.findOne({ email: email.toLowerCase() });

    // First time admin login - create account
    if (!admin) {
      const hashedPassword = await bcrypt.hash(password, 10);
      admin = new Admin({
        email: email.toLowerCase(),
        password: hashedPassword,
      });
      await admin.save();
    } else {
      // Verify password for existing admin
      const isPasswordValid = await bcrypt.compare(password, admin.password);
      if (!isPasswordValid) {
        return res.status(400).json({ message: 'Invalid password' });
      }
    }

    const token = generateToken(admin._id, admin.email);

    res.json({
      message: 'Admin login successful',
      token,
      admin: { id: admin._id, email: admin.email, role: 'admin' },
    });
  } catch (error) {
    res.status(500).json({ message: 'Admin login failed', error: error.message });
  }
});

// Verify token endpoint
router.get('/verify', verifyToken, (req, res) => {
  res.json({ message: 'Token valid', user: req.user });
});

module.exports = router;
module.exports.verifyToken = verifyToken;
module.exports.generateToken = generateToken;
