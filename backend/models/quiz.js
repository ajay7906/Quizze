const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema({
  title:
   { type: String, required: true },
  type: 
  { type: String, required: true, enum: ['Q&A', 'Poll Type'] },
  questions: 
  [{ type: mongoose.Schema.Types.ObjectId, ref: 'Question' }],
  user: 
  { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  impressions:
   { type: Number, default: 0 },

}, { timestamps: true });


const Quiz = mongoose.model('Quiz', quizSchema);

module.exports = Quiz;
