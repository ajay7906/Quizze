const mongoose = require('mongoose');

const questionSchema = mongoose.Schema({
  quiz: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz', required: true },
  question: { type: String, required: true },
  questionType: { 
    type: String, 
    required: true, 
    enum: ['Multiple Choice', 'True/False', 'Fill in the Blank', 'Short Answer', 'Essay'],
    default: 'Multiple Choice'
  },
  optionType: { type: String, required: true },
  options: [{ 
    imageURL: { type: String },
    rightans: { type: Boolean },
    text: { type: String }
  }],
  optionsTextAndImg: [{ 
    imageURL: { type: String },
    rightans: { type: Boolean },
    text: { type: String }
  }],
  // AI and exam platform specific fields
  isAIGenerated: { type: Boolean, default: false },
  difficulty: { 
    type: String, 
    enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert'],
    default: 'Beginner'
  },
  subject: { type: String, required: true },
  topic: { type: String },
  explanation: { type: String }, // Explanation for correct answer
  // Analytics
  attempts: { type: Number, default: 0 },
  correctAttempts: { type: Number, default: 0 },
  wrongAttempts: { type: Number, default: 0 },
  averageTime: { type: Number, default: 0 }, // Average time taken in seconds
  timer: { type: Number },
  // Difficulty adjustment based on performance
  difficultyScore: { type: Number, default: 0 }, // AI calculated difficulty
  successRate: { type: Number, default: 0 } // Percentage of correct attempts
}, { timestamps: true });

const Question = mongoose.model('Question', questionSchema);
module.exports = Question;