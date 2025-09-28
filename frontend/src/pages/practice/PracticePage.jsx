import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { RotatingLines } from 'react-loader-spinner';
import { toast } from 'react-toastify';

const PracticePage = () => {
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('Intermediate');
  const [questionCount, setQuestionCount] = useState(10);
  const [isLoading, setIsLoading] = useState(false);
  const [topics, setTopics] = useState([]);
  const [isSubjectInfoExpanded, setIsSubjectInfoExpanded] = useState(false);
  
  const navigate = useNavigate();

  useEffect(() => {
    fetchSubjects();
  }, []);

  useEffect(() => {
    if (selectedSubject) {
      const subject = subjects.find(s => s.name === selectedSubject);
      setTopics(subject?.topics || []);
      setSelectedTopic('');
    }
  }, [selectedSubject, subjects]);

  const fetchSubjects = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/v1/exam/subjects', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('jwttokenuser')}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setSubjects(data.data);
      }
    } catch (error) {
      console.error('Error fetching subjects:', error);
      toast.error('Failed to load subjects');
    }
  };

  const startPractice = async () => {
    if (!selectedSubject || !selectedTopic) {
      toast.error('Please select both subject and topic');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:3000/api/v1/exam/practice/start', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('jwttokenuser')}`
        },
        body: JSON.stringify({
          subject: selectedSubject,
          topic: selectedTopic,
          difficulty: selectedDifficulty,
          questionCount: parseInt(questionCount)
        })
      });

      const data = await response.json();
      if (data.success) {
        navigate('/practice-session', { 
          state: { 
            quizData: data.data,
            isPractice: true
          }
        });
      } else {
        toast.error(data.message || 'Failed to start practice session');
      }
    } catch (error) {
      console.error('Error starting practice:', error);
      toast.error('Failed to start practice session');
    } finally {
      setIsLoading(false);
    }
  };

  const difficulties = [
    { value: 'Beginner', label: 'Beginner', color: 'bg-green-500' },
    { value: 'Intermediate', label: 'Intermediate', color: 'bg-yellow-500' },
    { value: 'Advanced', label: 'Advanced', color: 'bg-red-500' },
    { value: 'Expert', label: 'Expert', color: 'bg-purple-500' }
  ];

  const getDifficultyColor = (difficulty) => {
    switch(difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-800';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'Advanced': return 'bg-red-100 text-red-800';
      case 'Expert': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 to-purple-800 py-8 px-4 sm:px-6 lg:px-8" style={{width: '90vw'}}>
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-white mb-4">Practice with AI</h1>
          <p className="text-xl text-indigo-100 max-w-2xl mx-auto">
            Choose your subject and topic to start practicing with AI-generated questions
          </p>
        </div>

        {/* Selection Card */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
          {/* Subject Selection */}
          <div className="mb-6">
            <label className="block text-lg font-medium text-gray-800 mb-2">Select Subject</label>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
            >
              <option value="">Choose a subject</option>
              {subjects.map((subject) => (
                <option key={subject.code} value={subject.name}>
                  {subject.name}
                </option>
              ))}
            </select>
          </div>

          {/* Topic Selection (conditionally rendered) */}
          {selectedSubject && (
            <div className="mb-6">
              <label className="block text-lg font-medium text-gray-800 mb-2">Select Topic</label>
              <select
                value={selectedTopic}
                onChange={(e) => setSelectedTopic(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
              >
                <option value="">Choose a topic</option>
                {topics.map((topic, index) => (
                  <option key={index} value={topic.name}>
                    {topic.name} ({topic.difficulty})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Difficulty and Question Count (conditionally rendered) */}
          {selectedTopic && (
            <>
              <div className="mb-6">
                <label className="block text-lg font-medium text-gray-800 mb-2">Difficulty Level</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {difficulties.map((diff) => (
                    <button
                      key={diff.value}
                      className={`py-3 px-4 rounded-lg font-medium transition-all ${
                        selectedDifficulty === diff.value 
                          ? `${diff.color} text-white shadow-md transform -translate-y-1` 
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                      onClick={() => setSelectedDifficulty(diff.value)}
                    >
                      {diff.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-8">
                <label className="block text-lg font-medium text-gray-800 mb-2">Number of Questions</label>
                <select
                  value={questionCount}
                  onChange={(e) => setQuestionCount(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                >
                  <option value={5}>5 Questions</option>
                  <option value={10}>10 Questions</option>
                  <option value={15}>15 Questions</option>
                  <option value={20}>20 Questions</option>
                </select>
              </div>

              <button
                onClick={startPractice}
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-4 px-6 rounded-lg font-semibold text-lg flex items-center justify-center transition-all shadow-md hover:shadow-lg disabled:opacity-70"
              >
                {isLoading ? (
                  <RotatingLines width="24" strokeColor="#fff" />
                ) : (
                  'Start Practice Session'
                )}
              </button>
            </>
          )}
        </div>

        {/* Subject Information (conditionally rendered) */}
        {selectedSubject && (
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <div 
              className="flex justify-between items-center cursor-pointer"
              onClick={() => setIsSubjectInfoExpanded(!isSubjectInfoExpanded)}
            >
              <h3 className="text-2xl font-bold text-gray-800">About {selectedSubject}</h3>
              <svg 
                className={`w-6 h-6 text-gray-600 transform transition-transform ${isSubjectInfoExpanded ? 'rotate-180' : ''}`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
            
            {isSubjectInfoExpanded && (
              <>
                <p className="text-gray-600 mt-4 leading-relaxed">
                  {subjects.find(s => s.name === selectedSubject)?.description}
                </p>
                
                <div className="mt-6">
                  <h4 className="text-xl font-semibold text-gray-800 mb-4">Available Topics</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {topics.map((topic, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
                        <h5 className="font-medium text-gray-800 text-lg mb-2">{topic.name}</h5>
                        <p className="text-gray-600 text-sm mb-3">{topic.description}</p>
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getDifficultyColor(topic.difficulty)}`}>
                          {topic.difficulty}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PracticePage;