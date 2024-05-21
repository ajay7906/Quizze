const express = require('express');
const { createQuiz, getDashboardData, submitQuiz, getAnalytics,
     getShareQuestion,  questiRightWrongCheck, incrementImpression } = require('../controllers/quizControllers');
const verifyToken = require('../middleware/verifyToken');
const router = express.Router();

router.post('/create', verifyToken, createQuiz);
router.patch('/updatequestion/:quiId' , questiRightWrongCheck)
router.patch('/empression/:quiId' , incrementImpression)
router.get('/shareQuestion/:quizId', getShareQuestion);
router.get('/analytics', verifyToken, getAnalytics);
router.get('/dashboard', verifyToken, getDashboardData);
router.post('/:id/submit', submitQuiz);

module.exports = router;
