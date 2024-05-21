const mongoose = require('mongoose');

const questionSchema = mongoose.Schema({
  quiz: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz', required: true },
  question: { type: String, required: true },
  options: [{ 
    // type: String, required: true
    imageURL:{ type:String},
    rightans:{type: Boolean},
    text:{type: String}
   }],
  correctOption: { type: String,  },
  attempts: { type: Number, default: 0 },
  timer: { type: Number,  },
  correctAttempts: { type: Number, default: 0 },
  wrongAttempts: { type: Number, default: 0 }
}, { timestamps: true });

const Question = mongoose.model('Question', questionSchema);
module.exports = Question;

// const mongoose = require('mongoose');

// const optionSchema = new mongoose.Schema({
//   text: { type: String, required: true },
//   imageURL: { type: String },
//   rightans: { type: Boolean, required: true },
// });

// const questionSchema = new mongoose.Schema({
//   quizId: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz', required: true },
//   question: { type: String, required: true },
//   options: [optionSchema],
//   timer: { type: Number },
//   attempts: { type: Number, default: 0 },
//   correctAttempts: { type: Number, default: 0 },
//   wrongAttempts: { type: Number, default: 0 },
// }, { timestamps: true });

// const quizSchema = new mongoose.Schema({
//   questions: [questionSchema],
// });

// const Question = mongoose.model('Quiz', quizSchema);

// module.exports = Question;