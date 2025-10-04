const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema({
  teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'teacher', required: true },
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  quiz: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz', required: true },
  assignedAt: { type: Date, default: Date.now },
  dueDate: { type: Date },
  status: { 
    type: String, 
    enum: ['assigned', 'in_progress', 'completed', 'overdue'], 
    default: 'assigned' 
  },
  completedAt: { type: Date },
  score: { type: Number },
  timeTaken: { type: Number }, // in minutes
  answers: [{
    question: { type: mongoose.Schema.Types.ObjectId, ref: 'Question' },
    selectedOption: { type: String },
    isCorrect: { type: Boolean },
    timeSpent: { type: Number } // in seconds
  }],
  feedback: { type: String },
  pdfUrl: { type: String } // URL to generated PDF
}, { timestamps: true });

const Assignment = mongoose.model('Assignment', assignmentSchema);
module.exports = Assignment;
