const Quiz = require('../models/quiz');
const Question = require('../models/question');
const StudentProgress = require('../models/studentProgress');
const Subject = require('../models/subject');
const aiService = require('../services/aiService');

// Get available subjects for practice
const getSubjects = async (req, res) => {
  try {
    const subjects = await Subject.find({ isActive: true })
      .select('name code description grade topics')
      .sort({ name: 1 });
    
    res.json({
      success: true,
      data: subjects
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching subjects',
      error: error.message
    });
  }
};

// Start a practice session with AI-generated questions
const startPracticeSession = async (req, res) => {
  try {
    const { subject, topic, difficulty, questionCount } = req.body;
    const studentId = req.userId;

    // Generate AI questions
    const aiQuestions = await aiService.generateQuestions(
      subject, 
      topic, 
      difficulty || 'Intermediate', 
      questionCount || 10
    );

    // Create a practice quiz
    const practiceQuiz = new Quiz({
      title: `${subject} - ${topic} Practice`,
      type: 'Practice Exam',
      subject,
      topic,
      difficulty: difficulty || 'Intermediate',
      user: studentId,
      isAIGenerated: true,
      isPublic: false,
      timeLimit: 0, // No time limit for practice
      questions: []
    });

    // Create questions from AI response
    const questions = [];
    for (const aiQuestion of aiQuestions.questions) {
      const question = new Question({
        quiz: practiceQuiz._id,
        question: aiQuestion.question,
        questionType: 'Multiple Choice',
        optionType: 'text',
        options: aiQuestion.options.map((option, index) => ({
          text: option,
          rightans: index === aiQuestion.correctAnswer,
          imageURL: null
        })),
        subject,
        topic,
        difficulty: aiQuestion.difficulty,
        isAIGenerated: true,
        explanation: aiQuestion.explanation
      });
      
      const savedQuestion = await question.save();
      questions.push(savedQuestion._id);
    }

    practiceQuiz.questions = questions;
    await practiceQuiz.save();

    // Update student progress
    await updateStudentProgress(studentId, subject, topic, 'practice_started');

    res.json({
      success: true,
      data: {
        quizId: practiceQuiz._id,
        title: practiceQuiz.title,
        subject,
        topic,
        difficulty: practiceQuiz.difficulty,
        questionCount: questions.length,
        questions: aiQuestions.questions
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error starting practice session',
      error: error.message
    });
  }
};

// Submit practice answers and get results
const submitPracticeAnswers = async (req, res) => {
  try {
    const { quizId, answers } = req.body;
    const studentId = req.userId;

    const quiz = await Quiz.findById(quizId).populate('questions');
    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: 'Quiz not found'
      });
    }

    let correctAnswers = 0;
    const results = [];
    const startTime = Date.now();

    // Process each answer
    for (const answer of answers) {
      const question = quiz.questions.find(q => q._id.toString() === answer.questionId);
      if (!question) continue;

      const isCorrect = question.options[answer.selectedOption]?.rightans || false;
      if (isCorrect) correctAnswers++;

      // Update question statistics
      question.attempts += 1;
      if (isCorrect) {
        question.correctAttempts += 1;
      } else {
        question.wrongAttempts += 1;
      }
      await question.save();

      results.push({
        questionId: answer.questionId,
        isCorrect,
        correctAnswer: question.options.findIndex(opt => opt.rightans),
        explanation: question.explanation
      });
    }

    const score = Math.round((correctAnswers / answers.length) * 100);
    const timeTaken = Math.round((Date.now() - startTime) / 1000);

    // Update quiz statistics
    quiz.totalAttempts += 1;
    quiz.averageScore = ((quiz.averageScore * (quiz.totalAttempts - 1)) + score) / quiz.totalAttempts;
    await quiz.save();

    // Update student progress
    await updateStudentProgress(studentId, quiz.subject, quiz.topic, 'practice_completed', {
      score,
      timeTaken,
      totalQuestions: answers.length,
      correctAnswers
    });

    res.json({
      success: true,
      data: {
        score,
        correctAnswers,
        totalQuestions: answers.length,
        timeTaken,
        results,
        feedback: generateFeedback(score)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error submitting practice answers',
      error: error.message
    });
  }
};

// Get student progress and recommendations
const getStudentProgress = async (req, res) => {
  try {
    const studentId = req.userId;
    const { subject, topic } = req.query;

    let query = { student: studentId };
    if (subject) query.subject = subject;
    if (topic) query.topic = topic;

    const progress = await StudentProgress.find(query)
      .sort({ updatedAt: -1 });

    // Generate AI recommendations
    let recommendations = '';
    if (progress.length > 0) {
      const overallProgress = progress[0]; // Most recent progress
      recommendations = await aiService.generateRecommendations(overallProgress);
    }

    res.json({
      success: true,
      data: {
        progress,
        recommendations
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching student progress',
      error: error.message
    });
  }
};

// Get recommended practice topics
const getRecommendedTopics = async (req, res) => {
  try {
    const studentId = req.userId;
    const { subject } = req.query;

    // Get student's weak areas
    const progress = await StudentProgress.findOne({
      student: studentId,
      subject: subject
    });

    if (!progress) {
      // If no progress, recommend beginner topics
      const subjects = await Subject.findOne({ name: subject });
      return res.json({
        success: true,
        data: {
          recommendedTopics: subjects?.topics?.slice(0, 3) || [],
          difficulty: 'Beginner'
        }
      });
    }

    // Analyze performance and recommend topics
    const weakAreas = progress.weakAreas || [];
    const currentDifficulty = progress.currentDifficulty;

    // Get available topics for the subject
    const subjectData = await Subject.findOne({ name: subject });
    const availableTopics = subjectData?.topics || [];

    // Recommend topics based on weak areas and difficulty
    const recommendedTopics = availableTopics
      .filter(topic => 
        weakAreas.includes(topic.name) || 
        topic.difficulty === currentDifficulty
      )
      .slice(0, 5);

    res.json({
      success: true,
      data: {
        recommendedTopics,
        difficulty: currentDifficulty,
        weakAreas,
        strengthAreas: progress.strengthAreas || []
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error getting recommended topics',
      error: error.message
    });
  }
};

// Helper function to update student progress
const updateStudentProgress = async (studentId, subject, topic, action, data = {}) => {
  try {
    let progress = await StudentProgress.findOne({
      student: studentId,
      subject,
      topic
    });

    if (!progress) {
      progress = new StudentProgress({
        student: studentId,
        subject,
        topic,
        currentDifficulty: 'Beginner'
      });
    }

    // Update based on action
    switch (action) {
      case 'practice_started':
        progress.totalPracticeSessions += 1;
        progress.lastPracticeDate = new Date();
        break;
      
      case 'practice_completed':
        progress.totalQuestionsAttempted += data.totalQuestions;
        progress.correctAnswers += data.correctAnswers;
        progress.wrongAnswers += (data.totalQuestions - data.correctAnswers);
        progress.totalTimeSpent += data.timeTaken;
        progress.averageScore = (progress.correctAnswers / progress.totalQuestionsAttempted) * 100;
        
        // Update difficulty based on performance
        if (data.score >= 80 && progress.currentDifficulty !== 'Expert') {
          progress.currentDifficulty = getNextDifficulty(progress.currentDifficulty);
        } else if (data.score < 60 && progress.currentDifficulty !== 'Beginner') {
          progress.currentDifficulty = getPreviousDifficulty(progress.currentDifficulty);
        }
        
        // Update practice streak
        const today = new Date().toDateString();
        const lastPractice = progress.lastPracticeDate?.toDateString();
        if (today === lastPractice) {
          progress.practiceStreak += 1;
        } else if (today !== lastPractice) {
          progress.practiceStreak = 1;
        }
        progress.lastPracticeDate = new Date();
        break;
    }

    await progress.save();
  } catch (error) {
    console.error('Error updating student progress:', error);
  }
};

// Helper function to get next difficulty level
const getNextDifficulty = (currentDifficulty) => {
  const levels = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];
  const currentIndex = levels.indexOf(currentDifficulty);
  return levels[Math.min(currentIndex + 1, levels.length - 1)];
};

// Helper function to get previous difficulty level
const getPreviousDifficulty = (currentDifficulty) => {
  const levels = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];
  const currentIndex = levels.indexOf(currentDifficulty);
  return levels[Math.max(currentIndex - 1, 0)];
};

// Helper function to generate feedback based on score
const generateFeedback = (score) => {
  if (score >= 90) return "Excellent! You've mastered this topic.";
  if (score >= 80) return "Great job! You have a solid understanding.";
  if (score >= 70) return "Good work! Keep practicing to improve.";
  if (score >= 60) return "You're on the right track. Review the concepts.";
  return "Don't worry! Practice makes perfect. Review the basics and try again.";
};

module.exports = {
  getSubjects,
  startPracticeSession,
  submitPracticeAnswers,
  getStudentProgress,
  getRecommendedTopics
};
