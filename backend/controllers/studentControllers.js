// controllers/studentController.js
const Student = require('../models/students');
const Teacher = require('../models/teachers');
const { generateRandomPassword } = require('../utils/helpers');
const emailQueue = require('../utils/emailQueue');

// Add a new student
exports.addStudent = async (req, res) => {
  try {
    const { firstName, lastName, email, studentId, class: studentClass, dateOfBirth } = req.body;
    
    // Check if student already exists
    const existingStudent = await Student.findOne({ 
      $or: [{ email }, { studentId }] 
    });
    
    if (existingStudent) {
      return res.status(400).json({
        success: false,
        message: 'Student with this email or ID already exists'
      });
    }
    
    // Generate a random password
    const password = generateRandomPassword(10);
    
    // Create new student
    const student = new Student({
      firstName,
      lastName,
      email,
      password,
      studentId,
      class: studentClass,
      dateOfBirth,
      teacher: req.userId // Assuming teacher ID is available in req.user
    });
    
    await student.save();
    
    // Add student to teacher's students array
    await Teacher.findByIdAndUpdate(
      req.userId,
      { $push: { students: student._id } }
    );
    
    // In a real application, you would send an email to the student with their credentials
    console.log(`Student created with password: ${password}`);
    emailQueue.addToQueue({
      to: email,
      studentName: `${firstName} ${lastName}`,
      email,
      password
    })
    
    res.status(201).json({
      success: true,
      message: 'Student added successfully',
      data: {
        id: student._id,
        firstName: student.firstName,
        lastName: student.lastName,
        email: student.email,
        studentId: student.studentId,
        class: student.class,
        dateOfBirth: student.dateOfBirth
      }
    });
    
  } catch (error) {
    console.error('Error adding student:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Get all students for a teacher
exports.getStudents = async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.userId).populate('students');
    
    res.status(200).json({
      success: true,
      data: teacher.students
    });
    
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({
      success: false,
      message: `Internal server error ${error.message}`
    });
  }
};

// Get a single student
exports.getStudent = async (req, res) => {
  try {
    const student = await Student.findOne({ 
      _id: req.params.id, 
      teacher: req.user.id 
    });
    
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: student
    });
    
  } catch (error) {
    console.error('Error fetching student:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Update a student
exports.updateStudent = async (req, res) => {
  try {
    const { firstName, lastName, email, studentId, class: studentClass, dateOfBirth } = req.body;
    
    const student = await Student.findOneAndUpdate(
      { _id: req.params.id, teacher: req.user.id },
      { firstName, lastName, email, studentId, class: studentClass, dateOfBirth },
      { new: true, runValidators: true }
    );
    
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Student updated successfully',
      data: student
    });
    
  } catch (error) {
    console.error('Error updating student:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Delete a student
exports.deleteStudent = async (req, res) => {
  try {
    const student = await Student.findOneAndDelete({ 
      _id: req.params.id, 
      teacher: req.user.id 
    });
    
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }
    
    // Remove student from teacher's students array
    await Teacher.findByIdAndUpdate(
      req.user.id,
      { $pull: { students: req.params.id } }
    );
    
    res.status(200).json({
      success: true,
      message: 'Student deleted successfully'
    });
    
  } catch (error) {
    console.error('Error deleting student:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};