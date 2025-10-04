import React, { useEffect, useState } from 'react';

const StudentDashboard = () => {
  const [teacher, setTeacher] = useState(null);
  const [quizzes, setQuizzes] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [activeTab, setActiveTab] = useState('assignments');
  const token = localStorage.getItem('jwttokenuser');

  const fetchTeacher = async () => {
    const resp = await fetch('http://localhost:3000/api/v1/student/teacher', {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await resp.json();
    console.log("teacher",data);
    if (data.success) setTeacher(data.data);
  };

  const fetchQuizzes = async () => {
    const resp = await fetch('http://localhost:3000/api/v1/student/assignments', {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await resp.json();
    console.log("quizzes",data);
    if (data.success) setQuizzes(data.data);
  };

  const fetchAssignments = async () => {
    const resp = await fetch('http://localhost:3000/api/v1/pdf/student/assignments', {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await resp.json();
    console.log("assignments",data);
    if (data.success) setAssignments(data.data);
  };

  useEffect(() => {
    fetchTeacher();
    fetchQuizzes();
    fetchAssignments();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty.toLowerCase()) {
      case 'hard':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-green-100 text-green-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="md:flex md:items-center md:justify-between">
            <div className="flex-1 min-w-0">
              <h1 className="text-3xl font-bold text-gray-900">Student Dashboard</h1>
              {teacher ? (
                <p className="mt-2 text-sm text-gray-600">
                  Assigned Teacher: <span className="font-medium">{teacher.name}</span> ({teacher.email})
                </p>
              ) : (
                <p className="mt-2 text-sm text-gray-500">No teacher assigned</p>
              )}
            </div>
            <div className="mt-4 flex md:mt-0 md:ml-4">
              <button
                type="button"
                className="ml-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                onClick={() => window.location.href = '/practice'}
              >
                Practice with AI
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="mb-6 border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('assignments')}
              className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'assignments' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            >
              Assigned Papers
              {assignments.length > 0 && (
                <span className="ml-2 py-0.5 px-2.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                  {assignments.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('tests')}
              className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'tests' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            >
              All Teacher Tests
              {quizzes.length > 0 && (
                <span className="ml-2 py-0.5 px-2.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                  {quizzes.length}
                </span>
              )}
            </button>
          </nav>
        </div>

        {/* Assigned Papers Section */}
        {activeTab === 'assignments' && (
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Assigned Papers</h2>
            {assignments.length === 0 ? (
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6 text-center">
                  <p className="text-sm text-gray-500">No assigned papers.</p>
                </div>
              </div>
            ) : (
              <div className="grid gap-5 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {assignments.map((assignment) => (
                  <div key={assignment._id} className="bg-white overflow-hidden shadow rounded-lg transition-all duration-200 hover:shadow-md">
                    <div className="p-5">
                      <div className="flex justify-between items-start">
                        <h3 className="text-lg font-medium text-gray-900 truncate">{assignment.quiz.title}</h3>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getDifficultyColor(assignment.quiz.difficulty)}`}>
                          {assignment.quiz.difficulty}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-gray-500">{assignment.quiz.subject} - {assignment.quiz.topic}</p>
                      
                      <div className="mt-4 space-y-2">
                        <div className="flex items-center">
                          <span className="text-sm font-medium text-gray-600">Status:</span>
                          <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(assignment.status)}`}>
                            {assignment.status}
                          </span>
                        </div>
                        
                        {assignment.dueDate && (
                          <div className="flex items-center">
                            <span className="text-sm font-medium text-gray-600">Due:</span>
                            <span className="ml-2 text-sm text-gray-900">{new Date(assignment.dueDate).toLocaleDateString()}</span>
                          </div>
                        )}
                        
                        {assignment.score && (
                          <div className="flex items-center">
                            <span className="text-sm font-medium text-gray-600">Score:</span>
                            <span className="ml-2 text-sm text-gray-900">{assignment.score}%</span>
                          </div>
                        )}
                      </div>
                      
                      <button
                        className={`mt-4 w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${assignment.status === 'completed' ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'}`}
                        onClick={() => window.location.href = `/sharequiz/${assignment.quiz._id}`}
                        disabled={assignment.status === 'completed'}
                      >
                        {assignment.status === 'completed' ? 'Completed' : 'Take Test'}
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
            <h2 className="text-xl font-semibold text-gray-900 mb-4">All Teacher Tests</h2>
            {quizzes.length === 0 ? (
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6 text-center">
                  <p className="text-sm text-gray-500">No tests available.</p>
                </div>
              </div>
            ) : (
              <div className="grid gap-5 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {quizzes.map((q) => (
                  <div key={q._id} className="bg-white overflow-hidden shadow rounded-lg transition-all duration-200 hover:shadow-md">
                    <div className="p-5">
                      <div className="flex justify-between items-start">
                        <h3 className="text-lg font-medium text-gray-900 truncate">{q.title}</h3>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getDifficultyColor(q.difficulty)}`}>
                          {q.difficulty}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-gray-500">{q.subject} - {q.topic}</p>
                      
                      <button
                        className="mt-4 w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        onClick={() => window.location.href = `/sharequiz/${q._id}`}
                      >
                        Take Test
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