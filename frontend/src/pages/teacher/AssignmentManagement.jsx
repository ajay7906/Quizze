import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import styles from './AssignmentManagement.module.css';

const AssignmentManagement = () => {
  const [assignments, setAssignments] = useState([]);
  const [students, setStudents] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState('');
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [dueDate, setDueDate] = useState('');
  const token = localStorage.getItem('jwttokenuser');

  useEffect(() => {
    fetchAssignments();
    fetchStudents();
    fetchQuizzes();
  }, []);

  const fetchAssignments = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/v1/pdf/assignments', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) setAssignments(data.data);
    } catch (error) {
      console.error('Error fetching assignments:', error);
    }
  };

  const fetchStudents = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/v1/teacher/students', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) setStudents(data.data);
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  const fetchQuizzes = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/v1/teacher/quizzes', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) setQuizzes(data.data);
    } catch (error) {
      console.error('Error fetching quizzes:', error);
    }
  };

  const handleAssignQuiz = async () => {
    if (!selectedQuiz || selectedStudents.length === 0) {
      toast.error('Please select a quiz and at least one student');
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/api/v1/pdf/assign', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          quizId: selectedQuiz,
          studentIds: selectedStudents,
          dueDate: dueDate || null
        })
      });

      const data = await response.json();
      if (data.success) {
        toast.success('Quiz assigned successfully!');
        setShowAssignModal(false);
        setSelectedQuiz('');
        setSelectedStudents([]);
        setDueDate('');
        fetchAssignments();
      } else {
        toast.error(data.message || 'Failed to assign quiz');
      }
    } catch (error) {
      console.error('Error assigning quiz:', error);
      toast.error('Failed to assign quiz');
    }
  };

  const toggleStudent = (studentId) => {
    setSelectedStudents(prev => 
      prev.includes(studentId) 
        ? prev.filter(id => id !== studentId)
        : [...prev, studentId]
    );
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'assigned': return '#e3f2fd';
      case 'completed': return '#e8f5e8';
      case 'overdue': return '#ffebee';
      default: return '#f5f5f5';
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Assignment Management</h1>
        <button 
          className={styles.assignBtn}
          onClick={() => setShowAssignModal(true)}
        >
          + Assign Quiz
        </button>
      </div>

      <div className={styles.assignmentsList}>
        {assignments.map((assignment) => (
          <div key={assignment._id} className={styles.assignmentCard}>
            <div className={styles.assignmentHeader}>
              <h3>{assignment.quiz.title}</h3>
              <span 
                className={styles.statusBadge}
                style={{ backgroundColor: getStatusColor(assignment.status) }}
              >
                {assignment.status}
              </span>
            </div>
            <div className={styles.assignmentDetails}>
              <p><strong>Student:</strong> {assignment.student.name}</p>
              <p><strong>Subject:</strong> {assignment.quiz.subject}</p>
              <p><strong>Topic:</strong> {assignment.quiz.topic}</p>
              <p><strong>Difficulty:</strong> {assignment.quiz.difficulty}</p>
              <p><strong>Assigned:</strong> {new Date(assignment.assignedAt).toLocaleDateString()}</p>
              {assignment.dueDate && (
                <p><strong>Due:</strong> {new Date(assignment.dueDate).toLocaleDateString()}</p>
              )}
              {assignment.score && (
                <p><strong>Score:</strong> {assignment.score}%</p>
              )}
            </div>
          </div>
        ))}
        {assignments.length === 0 && (
          <p className={styles.noAssignments}>No assignments yet.</p>
        )}
      </div>

      {/* Assign Modal */}
      {showAssignModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h3>Assign Quiz to Students</h3>
              <button 
                className={styles.closeBtn}
                onClick={() => setShowAssignModal(false)}
              >
                ×
              </button>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.formGroup}>
                <label>Select Quiz:</label>
                <select 
                  value={selectedQuiz} 
                  onChange={(e) => setSelectedQuiz(e.target.value)}
                  className={styles.select}
                >
                  <option value="">Choose a quiz...</option>
                  {quizzes.map(quiz => (
                    <option key={quiz._id} value={quiz._id}>
                      {quiz.title} ({quiz.subject} - {quiz.topic})
                    </option>
                  ))}
                </select>
              </div>

              <div className={styles.formGroup}>
                <label>Select Students:</label>
                <div className={styles.studentsList}>
                  {students.map(student => (
                    <label key={student._id} className={styles.studentCheckbox}>
                      <input
                        type="checkbox"
                        checked={selectedStudents.includes(student._id)}
                        onChange={() => toggleStudent(student._id)}
                      />
                      <span>{student.name} ({student.email})</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className={styles.formGroup}>
                <label>Due Date (Optional):</label>
                <input
                  type="datetime-local"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className={styles.input}
                />
              </div>
            </div>
            <div className={styles.modalFooter}>
              <button 
                className={styles.cancelBtn}
                onClick={() => setShowAssignModal(false)}
              >
                Cancel
              </button>
              <button 
                className={styles.assignBtn}
                onClick={handleAssignQuiz}
              >
                Assign Quiz
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssignmentManagement;
