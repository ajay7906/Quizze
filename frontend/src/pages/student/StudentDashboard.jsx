


import React, { useEffect, useState } from 'react';
import { updateQuizStatus } from '../../api/quizApi';
import { useNavigate } from 'react-router-dom';

const StudentDashboard = () => {
  const [teacher, setTeacher] = useState(null);
  const [quizzes, setQuizzes] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [activeTab, setActiveTab] = useState('assignments');
  const [stats, setStats] = useState({ completed: 0, pending: 0, total: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const token = localStorage.getItem('jwttokenuser');
  const navigate = useNavigate();
  const fetchTeacher = async () => {
    try {
      const resp = await fetch('http://localhost:3000/api/v1/student/teacher', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await resp.json();
      if (data.success) setTeacher(data.data);
    } catch (error) {
      console.error('Error fetching teacher:', error);
    }
  };

  const fetchQuizzes = async () => {
    try {
      const resp = await fetch('http://localhost:3000/api/v1/student/assignments', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await resp.json();
      if (data.success) setQuizzes(data.data);
    } catch (error) {
      console.error('Error fetching quizzes:', error);
    }
  };

  const fetchAssignments = async () => {
    try {
      const resp = await fetch('http://localhost:3000/api/v1/pdf/student/assignments', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await resp.json();
      console.log("assignments", data);
      if (data.success) {
        setAssignments(data.data);
        // Calculate stats
        const completed = data.data.filter(a => a.status === 'completed').length;
        const pending = data.data.filter(a => a.status !== 'completed').length;
        setStats({
          completed,
          pending,
          total: data.data.length
        });
      }
    } catch (error) {
      console.error('Error fetching assignments:', error);
    } finally {
      setIsLoading(false);
    }
  };
  const  updateQuizStatusAndRedirect = async (quizId, status) => {
    try{
      const response = await updateQuizStatus(quizId, status);
      if(response.status){
        // window.location.href = `/sharequiz/${quizId}`;
        navigate(`/sharequiz/${quizId}`);
      }
    }catch(error){
      console.error('Error updating quiz status:', error);
    }
  }

  useEffect(() => {
    fetchTeacher();
    fetchQuizzes();
    fetchAssignments();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'overdue':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case 'hard':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'easy':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (dueDate) => {
    if (!dueDate) return 'bg-gray-100 text-gray-800';
    
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'bg-red-100 text-red-800';
    if (diffDays <= 2) return 'bg-orange-100 text-orange-800';
    if (diffDays <= 7) return 'bg-yellow-100 text-yellow-800';
    return 'bg-green-100 text-green-800';
  };

  const getDaysRemaining = (dueDate) => {
    if (!dueDate) return null;
    
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return `${Math.abs(diffDays)} days overdue`;
    if (diffDays === 0) return 'Due today';
    if (diffDays === 1) return 'Due tomorrow';
    return `Due in ${diffDays} days`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Enhanced Header */}
      <header className="bg-white/80 backdrop-blur-lg shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Student Dashboard
              </h1>
              {teacher ? (
                <div className="mt-2 flex items-center space-x-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <p className="text-gray-600">
                      Teacher: <span className="font-semibold text-gray-800">{teacher.name}</span>
                    </p>
                  </div>
                  <span className="text-gray-400">•</span>
                  <p className="text-gray-500 text-sm">{teacher.email}</p>
                </div>
              ) : (
                <p className="mt-2 text-gray-500">No teacher assigned</p>
              )}
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => window.location.href = '/practice'}
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Practice with AI
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg p-6 border border-gray-200/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Total Assignments</p>
                <h3 className="text-3xl font-bold text-gray-800 mt-1">{stats.total}</h3>
              </div>
              <div className="bg-blue-100 p-3 rounded-xl">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg p-6 border border-gray-200/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Completed</p>
                <h3 className="text-3xl font-bold text-gray-800 mt-1">{stats.completed}</h3>
                <p className="text-green-600 text-sm font-medium mt-1">
                  {stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0}% done
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-xl">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg p-6 border border-gray-200/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Pending</p>
                <h3 className="text-3xl font-bold text-gray-800 mt-1">{stats.pending}</h3>
                <p className="text-orange-600 text-sm font-medium mt-1">Need attention</p>
              </div>
              <div className="bg-orange-100 p-3 rounded-xl">
                <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Tabs */}
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg p-2 mb-8 border border-gray-200/50">
          <nav className="flex space-x-2">
            <button
              onClick={() => setActiveTab('assignments')}
              className={`flex items-center px-6 py-3 rounded-xl font-medium text-sm transition-all ${
                activeTab === 'assignments'
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
              }`}
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              My Assignments
              {assignments.length > 0 && (
                <span className="ml-2 py-1 px-2.5 rounded-full text-xs font-medium bg-white/20">
                  {assignments.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('tests')}
              className={`flex items-center px-6 py-3 rounded-xl font-medium text-sm transition-all ${
                activeTab === 'tests'
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
              }`}
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              All Tests
              {quizzes.length > 0 && (
                <span className="ml-2 py-1 px-2.5 rounded-full text-xs font-medium bg-white/20">
                  {quizzes.length}
                </span>
              )}
            </button>
          </nav>
        </div>

        {/* Assigned Papers Section */}
        {activeTab === 'assignments' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">My Assignments</h2>
              <div className="text-sm text-gray-500">
                {stats.completed} of {stats.total} completed
              </div>
            </div>
            
            {assignments.length === 0 ? (
              <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg p-12 text-center border border-gray-200/50">
                <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No assignments yet</h3>
                <p className="text-gray-500 mb-6">Your teacher hasn't assigned any papers yet.</p>
              </div>
            ) : (
              <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
                {assignments.map((assignment) => (
                  <div key={assignment._id} className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg border border-gray-200/50 transition-all duration-300 hover:shadow-xl hover:border-indigo-200">
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-xl font-semibold text-gray-900 truncate mb-1">
                            {assignment.quiz.title}
                          </h3>
                          <p className="text-gray-500 text-sm">{assignment.quiz.subject} • {assignment.quiz.topic}</p>
                        </div>
                        <div className="flex space-x-2 ml-4">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getDifficultyColor(assignment.quiz.difficulty)}`}>
                            {assignment.quiz.difficulty}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-3 mb-4">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-gray-600">Status</span>
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(assignment.status)}`}>
                            {assignment.status.charAt(0).toUpperCase() + assignment.status.slice(1)}
                          </span>
                        </div>
                        
                        {assignment.dueDate && (
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium text-gray-600">Due Date</span>
                            <div className="text-right">
                              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getPriorityColor(assignment.dueDate)} mb-1`}>
                                {getDaysRemaining(assignment.dueDate)}
                              </span>
                              <p className="text-sm text-gray-900">{new Date(assignment.dueDate).toLocaleDateString()}</p>
                            </div>
                          </div>
                        )}
                        
                        {assignment.score && (
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium text-gray-600">Score</span>
                            <span className="text-lg font-bold text-gray-900">{assignment.score}%</span>
                          </div>
                        )}
                      </div>

                      <button
                        // onClick={() => window.location.href = `/sharequiz/${assignment.quiz._id}`}
                        onClick={() => updateQuizStatusAndRedirect(assignment.quiz._id, 'in_progress')}
                        disabled={assignment.quiz.status === 'completed'}
                        className={`w-full py-3 px-4 rounded-xl font-medium transition-all duration-200 ${
                          assignment.status === 'completed'
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
                        }`}
                      >
                        {assignment.quiz.status === 'completed' ? (
                          <span className="flex items-center justify-center">
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Completed
                          </span>
                        ) : (
                          'Start Assignment'
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* All Teacher Tests Section */}
        {activeTab === 'tests' && (
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Available Tests</h2>
            {quizzes.length === 0 ? (
              <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg p-12 text-center border border-gray-200/50">
                <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No tests available</h3>
                <p className="text-gray-500">Check back later for new tests from your teacher.</p>
              </div>
            ) : (
              <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {quizzes.map((quiz) => (
                  <div key={quiz._id} className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg border border-gray-200/50 transition-all duration-300 hover:shadow-xl hover:border-indigo-200 group">
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="text-lg font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
                          {quiz.title}
                        </h3>
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getDifficultyColor(quiz.difficulty)}`}>
                          {quiz.difficulty}
                        </span>
                      </div>
                      
                      <p className="text-gray-500 text-sm mb-2">{quiz.subject}</p>
                      <p className="text-gray-600 text-sm mb-4">{quiz.topic}</p>
                      
                      <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                        <span>Questions: {quiz.questions?.length || 'N/A'}</span>
                        <span>{quiz.duration || 'No time limit'}</span>
                      </div>

                      <button
                        onClick={() => window.location.href = `/sharequiz/${quiz._id}`}
                        className="w-full py-3 px-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
                      >
                        Start Test
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default StudentDashboard;