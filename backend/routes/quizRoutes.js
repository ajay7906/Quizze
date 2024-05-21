const express = require('express');
const { createQuiz, getDashboardData, submitQuiz, getAnalytics, getShareQuestion } = require('../controllers/quizControllers');
const verifyToken = require('../middleware/verifyToken');
const router = express.Router();

router.post('/create', verifyToken, createQuiz);
router.get('/dashboard', verifyToken, getDashboardData);
router.post('/:id/submit', submitQuiz);
router.get('/shareQuestion/:quizId', getShareQuestion);
router.get('/analytics', verifyToken, getAnalytics);

module.exports = router;
