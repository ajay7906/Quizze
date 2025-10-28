const express = require('express');
const { createQuiz, 
     getShareQuestion,  questiRightWrongCheck, incrementImpression, 
     getQuizDetails,
     deleteQuiz,
     getQuestionDetails,
     updateQuiz,
     getTrendingQuiz,
     getDashBoardData,
     updateQuizStatus,
     updateAssignmentStatus} = require('../controllers/quizControllers');
const verifyToken = require('../middleware/verifyToken');
const router = express.Router();

router.post('/create', verifyToken, createQuiz);

router.put('/updatequiz/:quizId',  verifyToken, updateQuiz);
router.patch('/checkquestion/:quiId' , questiRightWrongCheck)
router.patch('/empression/:quiId' , incrementImpression)
router.get('/shareQuestion/:quizId', getShareQuestion);
router.get('/getquestion/:quizId', getQuestionDetails);
router.delete('/delete/:quizId', deleteQuiz)

router.get('/trending', verifyToken, getTrendingQuiz);
router.get('/dashboardstats', verifyToken, getDashBoardData);
router.get('/dashboard', verifyToken, getQuizDetails);

router.patch('/updatequizstatus/:quizId', verifyToken, updateQuizStatus);

router.patch('/updateAssignmentStatus/:assignmentId', verifyToken, updateAssignmentStatus);


module.exports = router;
