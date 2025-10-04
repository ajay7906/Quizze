const Quiz = require('../models/quiz');
const Question = require('../models/question');
const Assignment = require('../models/assignment');
const User = require('../models/user');
const pdfService = require('../services/pdfService');
const verifyToken = require('../middleware/verifyToken');
const requireRole = require('../middleware/requireRole');
const Student = require('../models/students');
const Teacher = require('../models/teachers');



const generateQuizPDF = async (req, res) => {
  try {
    const { quizId } = req.params;
    const teacherId = req.userId;

    // Find quiz and verify ownership
    const quiz = await Quiz.findOne({ _id: quizId, user: teacherId })
      .populate('user', 'name email');
    if (!quiz) {
      return res.status(404).json({ success: false, message: 'Quiz not found' });
    }

    // Get all questions for this quiz
    const questions = await Question.find({ quiz: quizId });
    if (questions.length === 0) {
      return res.status(400).json({ success: false, message: 'No questions found for this quiz' });
    }

    // Generate PDF
    const pdfBuffer = await pdfService.generateQuizPDF(quiz, questions);

    // Set response headers for PDF download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${quiz.title.replace(/[^a-z0-9]/gi, '_')}.pdf"`);
    res.setHeader('Content-Length', pdfBuffer.length);

    res.send(pdfBuffer);
  } catch (error) {
    console.error('PDF generation error:', error);
    res.status(500).json({ success: false, message: 'Failed to generate PDF' });
  }
};

const assignQuizToStudents = async (req, res) => {
  try {
    const { quizId, studentIds, dueDate } = req.body;
    const teacherId = req.userId;
 
    // Validate input
    if (!quizId || !studentIds || !Array.isArray(studentIds) || studentIds.length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Quiz ID and student IDs array are required' 
      });
    }

    // Verify quiz ownership
    const quiz = await Quiz.findOne({ _id: quizId, user: teacherId });
    if (!quiz) {
      return res.status(404).json({ success: false, message: 'Quiz not found' });
    }

    // Verify students belong to this teacher
    const students = await Student.find({ 
      _id: { $in: studentIds }, 
      role: 'student', 
      teacher: teacherId 
    });

    if (students.length !== studentIds.length) {
      return res.status(400).json({ 
        success: false, 
        message: 'Some students not found or not assigned to you' 
      });
    }

    // Check for existing assignments to prevent duplicates
    const existingAssignments = await Assignment.find({
      teacher: teacherId,
      student: { $in: studentIds },
      quiz: quizId
    });

    const existingStudentIds = existingAssignments.map(assignment => 
      assignment.student.toString()
    );

    // Filter out students who already have this assignment
    const newStudentIds = studentIds.filter(studentId => 
      !existingStudentIds.includes(studentId.toString())
    );

    if (newStudentIds.length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'All selected students already have this quiz assigned' 
      });
    }

    // Create new assignments only for students who don't have it
    const assignments = await Promise.all(
      newStudentIds.map(studentId => 
        Assignment.create({
          teacher: teacherId,
          student: studentId,
          quiz: quizId,
          dueDate: dueDate ? new Date(dueDate) : null,
          status: 'assigned',
          assignedAt: new Date()
        })
      )
    );

    let message = `Quiz assigned to ${assignments.length} students`;
    if (existingAssignments.length > 0) {
      message += ` (${existingAssignments.length} students already had this assignment)`;
    }

    res.json({ 
      success: true, 
      message,
      data: assignments 
    });
  } catch (error) {
    console.error('Assignment error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to assign quiz',
      error: error.message 
    });
  }
};



const getTeacherAssignments = async (req, res) => {
  try {
    const teacherId = req.userId;
    const assignments = await Assignment.find({ teacher: teacherId })
      .populate('student', 'firstName lastName email')
      .populate('quiz', 'title subject topic difficulty')
      .sort({ assignedAt: -1 });

    res.json({ success: true, data: assignments });
  } catch (error) {
    console.error('Get assignments error:', error);
    res.status(500).json({ success: false, message: 'Failed to get assignments' });
  }
};

// Get student's assignments
const getStudentAssignments = async (req, res) => {
  try {
    const studentId = req.userId;
    const assignments = await Assignment.find({ student: studentId })
      .populate('teacher', 'name email')
      .populate('quiz', 'title subject topic difficulty timeLimit passingScore')
      .sort({ assignedAt: -1 });

    res.json({ success: true, data: assignments });
  } catch (error) {
    console.error('Get student assignments error:', error);
    res.status(500).json({ success: false, message: 'Failed to get assignments' });
  }
};

// Submit assignment (student takes the quiz)
const submitAssignment = async (req, res) => {
  try {
    const { assignmentId, answers, timeTaken } = req.body;
    const studentId = req.userId;

    const assignment = await Assignment.findOne({ 
      _id: assignmentId, 
      student: studentId,
      status: { $in: ['assigned', 'in_progress'] }
    }).populate('quiz');

    if (!assignment) {
      return res.status(404).json({ success: false, message: 'Assignment not found' });
    }

    // Calculate score
    const questions = await Question.find({ quiz: assignment.quiz._id });
    let correctAnswers = 0;
    const answerDetails = answers.map(answer => {
      const question = questions.find(q => q._id.toString() === answer.questionId);
      const isCorrect = question && question.options[answer.selectedOptionIndex]?.rightans;
      if (isCorrect) correctAnswers++;
      
      return {
        question: answer.questionId,
        selectedOption: answer.selectedOption,
        isCorrect,
        timeSpent: answer.timeSpent || 0
      };
    });

    const score = Math.round((correctAnswers / questions.length) * 100);
    const passed = score >= (assignment.quiz.passingScore || 70);

    // Update assignment
    assignment.status = 'completed';
    assignment.completedAt = new Date();
    assignment.score = score;
    assignment.timeTaken = timeTaken;
    assignment.answers = answerDetails;
    await assignment.save();

    res.json({ 
      success: true, 
      message: 'Assignment submitted successfully',
      data: { score, passed, correctAnswers, totalQuestions: questions.length }
    });
  } catch (error) {
    console.error('Submit assignment error:', error);
    res.status(500).json({ success: false, message: 'Failed to submit assignment' });
  }
};

module.exports = {
  generateQuizPDF,
  assignQuizToStudents,
  getTeacherAssignments,
  getStudentAssignments,
  submitAssignment
};
