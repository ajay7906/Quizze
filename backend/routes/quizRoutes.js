const express = require('express');
const { createQuiz, submitQuiz, getAnalytics,
     getShareQuestion,  questiRightWrongCheck, incrementImpression, 
     getQuizDetails,
     deleteQuiz} = require('../controllers/quizControllers');
const verifyToken = require('../middleware/verifyToken');
const router = express.Router();

router.post('/create', verifyToken, createQuiz);
router.patch('/updatequestion/:quiId' , questiRightWrongCheck)
router.patch('/empression/:quiId' , incrementImpression)
router.get('/shareQuestion/:quizId', getShareQuestion);
router.delete('/delete/:quizId', deleteQuiz)
router.get('/analytics', verifyToken, getAnalytics);
router.get('/dashboard', verifyToken, getQuizDetails);
router.post('/:id/submit', submitQuiz);

module.exports = router;
