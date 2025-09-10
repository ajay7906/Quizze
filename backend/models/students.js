// // models/Student.js
// const mongoose = require('mongoose');

// const studentSchema = new mongoose.Schema({
//   firstName: { type: String, required: true },
//   lastName: {type: String, requires: true},
//   email: { type: String, required: true, unique: true },
//   password: { type: String, required: true },
//   teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher', required: true }
// }, { timestamps: true });

// module.exports = mongoose.model('Student', studentSchema);





// models/Student.js
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const studentSchema = new mongoose.Schema({
  firstName: { 
    type: String, 
    required: [true, 'First name is required'] 
  },
  lastName: { 
    type: String, 
    required: [true, 'Last name is required'] 
  },
  email: { 
    type: String, 
    required: [true, 'Email is required'], 
    unique: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: { 
    type: String, 
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters']
  },
  studentId: {
    type: String,
    required: [true, 'Student ID is required'],
    unique: true
  },
  class: {
    type: String,
    required: [true, 'Class/Group is required']
  },
  dateOfBirth: {
    type: Date,
    required: [true, 'Date of birth is required']
  },
  teacher: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Teacher', 
    required: true 
  },
  role: {
    type: String,
    default: 'student',
    enum: ['student']
  }
}, { 
  timestamps: true 
});

// Hash password before saving
studentSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Compare password method
studentSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('Student', studentSchema);