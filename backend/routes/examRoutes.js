const express = require('express');
const router = express.Router();
const examController = require('../controllers/examController');
const verifyToken = require('../middleware/verifyToken');

// All routes require authentication
// router.use(verifyToken);

// Get available subjects for practice
router.get('/subjects', examController.getSubjects);

// Start a practice session with AI-generated questions
router.post('/practice/start', verifyToken, examController.startPracticeSession);

// Submit practice answers and get results
router.post('/practice/submit', verifyToken, examController.submitPracticeAnswers);

// Get student progress and AI recommendations
router.get('/progress', examController.getStudentProgress);

// Get recommended practice topics
router.get('/recommendations', examController.getRecommendedTopics);

module.exports = router;
