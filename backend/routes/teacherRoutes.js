const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/verifyToken');
const requireRole = require('../middleware/requireRole');
const User = require('../models/user');
const Quiz = require('../models/quiz');

// All routes below require teacher role
router.use(verifyToken, requireRole('teacher'));

// Create student under teacher
router.post('/students', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Missing fields' });
    }
    const exists = await User.findOne({ email });
    if (exists) return res.status(409).json({ success: false, message: 'Email already in use' });
    const bcrypt = require('bcrypt');
    const hashedPassword = await bcrypt.hash(password, 10);
    const student = await User.create({ name, email, password: hashedPassword, role: 'student', teacher: req.userId });
    res.json({ success: true, data: { _id: student._id, name: student.name, email: student.email } });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
});

// List teacher's students
router.get('/students', async (req, res) => {
  try {
    const students = await User.find({ role: 'student', teacher: req.userId }).select('name email createdAt');
    res.json({ success: true, data: students });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
});

// Update a student profile
router.put('/students/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, password } = req.body;
    const student = await User.findOne({ _id: id, role: 'student', teacher: req.userId });
    if (!student) return res.status(404).json({ success: false, message: 'Student not found' });
    if (name) student.name = name;
    if (email) student.email = email;
    if (password) {
      const bcrypt = require('bcrypt');
      student.password = await bcrypt.hash(password, 10);
    }
    await student.save();
    res.json({ success: true, data: { _id: student._id, name: student.name, email: student.email } });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
});

// Delete a student
router.delete('/students/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const student = await User.findOneAndDelete({ _id: id, role: 'student', teacher: req.userId });
    if (!student) return res.status(404).json({ success: false, message: 'Student not found' });
    res.json({ success: true, message: 'Student deleted' });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
});

// List teacher quizzes
router.get('/quizzes', async (req, res) => {
  try {
    const quizzes = await Quiz.find({ user: req.userId }).select('title subject topic difficulty createdAt');
    res.json({ success: true, data: quizzes });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
});

module.exports = router;
