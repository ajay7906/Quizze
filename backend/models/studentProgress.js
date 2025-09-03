const mongoose = require('mongoose');

const studentProgressSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  subject: { type: String, required: true },
  topic: { type: String },
  // Performance metrics
  totalQuestionsAttempted: { type: Number, default: 0 },
  correctAnswers: { type: Number, default: 0 },
  wrongAnswers: { type: Number, default: 0 },
  averageScore: { type: Number, default: 0 },
  totalTimeSpent: { type: Number, default: 0 }, // in seconds
  // Difficulty progression
  currentDifficulty: { 
    type: String, 
    enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert'],
    default: 'Beginner'
  },
  // AI recommendation data
  strengthAreas: [{ type: String }],
  weakAreas: [{ type: String }],
  recommendedTopics: [{ type: String }],
  // Learning analytics
  lastPracticeDate: { type: Date },
  practiceStreak: { type: Number, default: 0 },
  totalPracticeSessions: { type: Number, default: 0 },
  // Quiz attempts
  quizAttempts: [{
    quiz: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz' },
    score: { type: Number },
    timeTaken: { type: Number },
    completedAt: { type: Date },
    questionsAttempted: [{
      question: { type: mongoose.Schema.Types.ObjectId, ref: 'Question' },
      isCorrect: { type: Boolean },
      timeSpent: { type: Number },
      selectedOption: { type: String }
    }]
  }]
}, { timestamps: true });

const StudentProgress = mongoose.model('StudentProgress', studentProgressSchema);
module.exports = StudentProgress;
