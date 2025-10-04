

const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/verifyToken');
const requireRole = require('../middleware/requireRole');
const User = require('../models/user');
const Quiz = require('../models/quiz');
const studentControllers = require('../controllers/studentControllers');
const Student = require('../models/students');
const Assignment = require('../models/assignment');

// Apply verifyToken to all routes
router.use(verifyToken);

// Routes that require student role
// router.get('/teacher', requireRole('student'), async (req, res) => {
//   try {
//     const me = await User.findById(req.userId).select('teacher');
//     if (!me || !me.teacher) return res.json({ success: true, data: null });
//     const t = await User.findById(me.teacher).select('name email');
//     res.json({ success: true, data: t });
//   } catch (e) {
//     res.status(500).json({ success: false, message: e.message });
//   }
// });


// Fixed route - make sure this is in your student routes
router.get('/teacher', requireRole('student'), async (req, res) => {
  try {
    // Since you're using requireRole('student'), find the student directly
    const student = await Student.findById(req.userId).populate('teacher', 'name email');
    
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }
    
    if (!student.teacher) {
      return res.json({ success: true, data: null });
    }
    
    res.json({ 
      success: true, 
      data: {
        _id: student.teacher._id,
        name: student.teacher.name,
        email: student.teacher.email
      }
    });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
});





// List quizzes created by my teacher (student only)
// router.get('/quizzes', requireRole('student'), async (req, res) => {
//   try {
//     const me = await User.findById(req.userId).select('teacher');
//     const quizzes = await Quiz.find({ user: me.teacher }).select('title subject topic difficulty createdAt');
//     res.json({ success: true, data: quizzes });
//   } catch (e) {
//     res.status(500).json({ success: false, message: e.message });
//   }
// });

// Routes that require teacher/admin role (for managing students)


router.get('/assignments', requireRole('student'), async (req, res) => {
  try {
    const assignments = await Assignment.find({ student: req.userId })
      .populate('quiz', 'title subject topic difficulty type timeLimit passingScore description status')
      .populate('teacher', 'name email')
      .sort({ assignedAt: -1 });

    res.json({ 
      success: true, 
      data: assignments 
    });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
});







router.get('/all', requireRole(['teacher', 'admin']), studentControllers.getStudents);
router.post('/add', requireRole(['teacher', 'admin']), studentControllers.addStudent);
router.get('getstudent/:id', requireRole(['teacher', 'admin']), studentControllers.getStudent);
router.put('update/:id', requireRole(['teacher', 'admin']), studentControllers.updateStudent);
router.delete('delete/:id', requireRole(['teacher', 'admin']), studentControllers.deleteStudent);

// // Additional student management routes with teacher/admin role requirement
// router.get('/:id/performance', requireRole(['teacher', 'admin']), studentControllers.getStudentPerformance);
// router.get('/class/:className', requireRole(['teacher', 'admin']), studentControllers.getStudentsByClass);
// router.get('/search', requireRole(['teacher', 'admin']), studentControllers.searchStudents);

module.exports = router;