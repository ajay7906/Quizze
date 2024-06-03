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
  //  isTrending: 
  //  { type: Boolean, default: false },
}, { timestamps: true });

// quizSchema.methods.incrementImpressions = function () {
//   this.impressions += 1;
//   this.isTrending = this.impressions > 10;
//   return this.save();
// };

const Quiz = mongoose.model('Quiz', quizSchema);

module.exports = Quiz;
