const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema({
  title: { type: String, required: true },
  type: { type: String, required: true, enum: ['Q&A', 'Poll Type', 'Practice Exam', 'AI Generated'] },
  subject: { type: String, required: true },
  topic: { type: String },
  difficulty: { 
    type: String, 
    required: true, 
    enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert'],
    default: 'Beginner'
  },
  grade: { type: String },
  questions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Question' }],
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher', required: true },
  impressions: { type: Number, default: 0 },
  // Exam platform specific fields
  isPublic: { type: Boolean, default: false },
  isAIGenerated: { type: Boolean, default: false },
  timeLimit: { type: Number, default: 0 }, // in minutes
  passingScore: { type: Number, default: 70 },
  tags: [{ type: String }],
  description: { type: String },
  // Analytics
  totalAttempts: { type: Number, default: 0 },
  averageScore: { type: Number, default: 0 },
  completionRate: { type: Number, default: 0 },
  status:{type:String,default:'pending'},
  // check the quiz is pending, completed, in progress

}, { timestamps: true });

const Quiz = mongoose.model('Quiz', quizSchema);
module.exports = Quiz;
