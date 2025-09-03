const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  code: { type: String, required: true, unique: true },
  description: { type: String },
  grade: { type: String, required: true },
  topics: [{ 
    name: { type: String, required: true },
    description: { type: String },
    difficulty: { 
      type: String, 
      enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert'],
      default: 'Beginner'
    }
  }],
  isActive: { type: Boolean, default: true },
  totalQuizzes: { type: Number, default: 0 },
  totalQuestions: { type: Number, default: 0 }
}, { timestamps: true });

const Subject = mongoose.model('Subject', subjectSchema);
module.exports = Subject;
