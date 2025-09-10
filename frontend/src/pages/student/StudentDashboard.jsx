import React, { useEffect, useState } from 'react';
import styles from './StudentDashboard.module.css';

const StudentDashboard = () => {
  const [teacher, setTeacher] = useState(null);
  const [quizzes, setQuizzes] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const token = localStorage.getItem('jwttokenuser');

  const fetchTeacher = async () => {
    const resp = await fetch('http://localhost:3000/api/v1/student/teacher', {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await resp.json();
    if (data.success) setTeacher(data.data);
  };

  const fetchQuizzes = async () => {
    const resp = await fetch('http://localhost:3000/api/v1/student/quizzes', {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await resp.json();
    if (data.success) setQuizzes(data.data);
  };

  const fetchAssignments = async () => {
    const resp = await fetch('http://localhost:3000/api/v1/pdf/student/assignments', {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await resp.json();
    if (data.success) setAssignments(data.data);
  };

  useEffect(() => {
    fetchTeacher();
    fetchQuizzes();
    fetchAssignments();
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Student Dashboard</h1>
        {teacher ? <p>Assigned Teacher: {teacher.name} ({teacher.email})</p> : <p>No teacher assigned</p>}
      </div>

      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2>Assigned Papers</h2>
        </div>
        <div className={styles.quizGrid}>
          {assignments.map((assignment) => (
            <div key={assignment._id} className={styles.quizCard}>
              <h3>{assignment.quiz.title}</h3>
              <p>{assignment.quiz.subject} - {assignment.quiz.topic}</p>
              <span className={styles.badge}>{assignment.quiz.difficulty}</span>
              <div className={styles.assignmentInfo}>
                <p><strong>Status:</strong> <span className={styles.status}>{assignment.status}</span></p>
                {assignment.dueDate && <p><strong>Due:</strong> {new Date(assignment.dueDate).toLocaleDateString()}</p>}
                {assignment.score && <p><strong>Score:</strong> {assignment.score}%</p>}
              </div>
              <button 
                className={styles.takeBtn} 
                onClick={() => window.location.href = `/sharequiz/${assignment.quiz._id}`}
                disabled={assignment.status === 'completed'}
              >
                {assignment.status === 'completed' ? 'Completed' : 'Take Test'}
              </button>
            </div>
          ))}
          {assignments.length === 0 && <p>No assigned papers.</p>}
        </div>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2>All Teacher Tests</h2>
        </div>
        <div className={styles.quizGrid}>
          {quizzes.map((q) => (
            <div key={q._id} className={styles.quizCard}>
              <h3>{q.title}</h3>
              <p>{q.subject} - {q.topic}</p>
              <span className={styles.badge}>{q.difficulty}</span>
              <button className={styles.takeBtn} onClick={() => window.location.href = `/sharequiz/${q._id}`}>Take Test</button>
            </div>
          ))}
          {quizzes.length === 0 && <p>No tests available.</p>}
        </div>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2>Practice with AI</h2>
        </div>
        <button className={styles.practiceBtn} onClick={() => window.location.href = '/practice'}>
          Start Practice
        </button>
      </div>
    </div>
  );
};

export default StudentDashboard;
