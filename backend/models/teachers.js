// // models/Teacher.js
// const mongoose = require('mongoose');
// const bcrypt = require('bcrypt');

// const teacherSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   email: { type: String, required: true, unique: true },
//   password: { type: String, required: true },
//   students: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Student' }]
// }, { timestamps: true });

// teacherSchema.pre('save', async function(next) {
//   if (!this.isModified('password')) return next();
//   this.password = await bcrypt.hash(this.password, 10);
//   next();
// });

// module.exports = mongoose.model('Teacher', teacherSchema);




















// models/Teacher.js
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const teacherSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: [true, 'Name is required'] 
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
  students: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Student' 
  }],
  role: {
    type: String,
    default: 'teacher',
    enum: ['teacher', 'admin'] // Added admin role for potential future use
  }
}, { 
  timestamps: true 
});

// Hash password before saving
teacherSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Compare password method
teacherSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('Teacher', teacherSchema);  