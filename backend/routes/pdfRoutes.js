const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/verifyToken');
const requireRole = require('../middleware/requireRole');
const pdfController = require('../controllers/pdfController');

// PDF generation route (teacher only)
router.get('/quiz/:quizId/pdf', verifyToken, requireRole('teacher'), pdfController.generateQuizPDF);

// Assignment routes
router.post('/assign', verifyToken, requireRole('teacher'), pdfController.assignQuizToStudents);
router.get('/assignments', verifyToken, requireRole('teacher'), pdfController.getTeacherAssignments);
router.get('/student/assignments', verifyToken, requireRole('student'), pdfController.getStudentAssignments);
router.post('/submit', verifyToken, requireRole('student'), pdfController.submitAssignment);

module.exports = router;
