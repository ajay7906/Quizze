import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import styles from './CreateQuizPage.module.css';
import { RotatingLines } from 'react-loader-spinner';

const CreateQuizPage = () => {
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('');
  const [topics, setTopics] = useState([]);
  const [quizData, setQuizData] = useState({
    title: '',
    description: '',
    subject: '',
    topic: '',
    difficulty: 'Intermediate',
    timeLimit: 30,
    passingScore: 70,
    isPublic: false,
    questions: []
  });
  const [currentQuestion, setCurrentQuestion] = useState({
    question: '',
    questionType: 'Multiple Choice',
    options: [
      { text: '', rightans: false, imageURL: '' },
      { text: '', rightans: false, imageURL: '' },
      { text: '', rightans: false, imageURL: '' },
      { text: '', rightans: false, imageURL: '' }
    ],
    explanation: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showQuestionForm, setShowQuestionForm] = useState(false);
  const [editingQuestionIndex, setEditingQuestionIndex] = useState(-1);

  const navigate = useNavigate();

  useEffect(() => {
    fetchSubjects();
  }, []);

  useEffect(() => {
    if (selectedSubject) {
      const subject = subjects.find(s => s.name === selectedSubject);
      setTopics(subject?.topics || []);
      setSelectedTopic('');
      setQuizData(prev => ({ ...prev, subject: selectedSubject, topic: '' }));
    }
  }, [selectedSubject, subjects]);

  useEffect(() => {
    if (selectedTopic) {
      setQuizData(prev => ({ ...prev, topic: selectedTopic }));
    }
  }, [selectedTopic]);

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

  const handleQuizDataChange = (field, value) => {
    setQuizData(prev => ({ ...prev, [field]: value }));
  };

  const handleQuestionChange = (field, value) => {
    setCurrentQuestion(prev => ({ ...prev, [field]: value }));
  };

  const handleOptionChange = (index, field, value) => {
    setCurrentQuestion(prev => ({
      ...prev,
      options: prev.options.map((option, i) => 
        i === index ? { ...option, [field]: value } : option
      )
    }));
  };

  const handleCorrectAnswerChange = (index) => {
    setCurrentQuestion(prev => ({
      ...prev,
      options: prev.options.map((option, i) => ({
        ...option,
        rightans: i === index
      }))
    }));
  };

  const addQuestion = () => {
    if (!currentQuestion.question.trim()) {
      toast.error('Please enter a question');
      return;
    }

    if (!currentQuestion.options.some(opt => opt.rightans)) {
      toast.error('Please select a correct answer');
      return;
    }

    if (currentQuestion.options.some(opt => !opt.text.trim())) {
      toast.error('Please fill in all options');
      return;
    }

    const newQuestion = {
      ...currentQuestion,
      subject: quizData.subject,
      topic: quizData.topic,
      difficulty: quizData.difficulty
    };

    if (editingQuestionIndex >= 0) {
      // Editing existing question
      setQuizData(prev => ({
        ...prev,
        questions: prev.questions.map((q, i) => 
          i === editingQuestionIndex ? newQuestion : q
        )
      }));
      setEditingQuestionIndex(-1);
    } else {
      // Adding new question
      setQuizData(prev => ({
        ...prev,
        questions: [...prev.questions, newQuestion]
      }));
    }

    // Reset form
    setCurrentQuestion({
      question: '',
      questionType: 'Multiple Choice',
      options: [
        { text: '', rightans: false, imageURL: '' },
        { text: '', rightans: false, imageURL: '' },
        { text: '', rightans: false, imageURL: '' },
        { text: '', rightans: false, imageURL: '' }
      ],
      explanation: ''
    });
    setShowQuestionForm(false);
    toast.success(editingQuestionIndex >= 0 ? 'Question updated!' : 'Question added!');
  };

  const editQuestion = (index) => {
    const question = quizData.questions[index];
    setCurrentQuestion(question);
    setEditingQuestionIndex(index);
    setShowQuestionForm(true);
  };

  const deleteQuestion = (index) => {
    setQuizData(prev => ({
      ...prev,
      questions: prev.questions.filter((_, i) => i !== index)
    }));
    toast.success('Question deleted!');
  };

  const saveQuiz = async () => {
    if (!quizData.title.trim()) {
      toast.error('Please enter a quiz title');
      return;
    }

    if (!quizData.subject) {
      toast.error('Please select a subject');
      return;
    }

    if (!quizData.topic) {
      toast.error('Please select a topic');
      return;
    }

    if (quizData.questions.length === 0) {
      toast.error('Please add at least one question');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:3000/api/v1/quiz', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('jwttokenuser')}`
        },
        body: JSON.stringify({
          ...quizData,
          type: 'Q&A',
          user: localStorage.getItem('userId')
        })
      });

      const data = await response.json();
      if (data.success) {
        toast.success('Quiz created successfully!');
        navigate('/');
      } else {
        toast.error(data.message || 'Failed to create quiz');
      }
    } catch (error) {
      console.error('Error creating quiz:', error);
      toast.error('Failed to create quiz');
    } finally {
      setIsLoading(false);
    }
  };

  const difficulties = [
    { value: 'Beginner', label: 'Beginner', color: '#4CAF50' },
    { value: 'Intermediate', label: 'Intermediate', color: '#FF9800' },
    { value: 'Advanced', label: 'Advanced', color: '#F44336' },
    { value: 'Expert', label: 'Expert', color: '#9C27B0' }
  ];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Create Quiz Paper</h1>
        <p>Create a comprehensive quiz paper for your students</p>
      </div>

      <div className={styles.quizForm}>
        <div className={styles.section}>
          <h2>Quiz Information</h2>
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label>Quiz Title *</label>
              <input
                type="text"
                value={quizData.title}
                onChange={(e) => handleQuizDataChange('title', e.target.value)}
                placeholder="Enter quiz title"
                className={styles.input}
              />
            </div>

            <div className={styles.formGroup}>
              <label>Description</label>
              <textarea
                value={quizData.description}
                onChange={(e) => handleQuizDataChange('description', e.target.value)}
                placeholder="Enter quiz description"
                className={styles.textarea}
                rows="3"
              />
            </div>

            <div className={styles.formGroup}>
              <label>Subject *</label>
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className={styles.select}
              >
                <option value="">Choose a subject</option>
                {subjects.map((subject) => (
                  <option key={subject.code} value={subject.name}>
                    {subject.name}
                  </option>
                ))}
              </select>
            </div>

            {selectedSubject && (
              <div className={styles.formGroup}>
                <label>Topic *</label>
                <select
                  value={selectedTopic}
                  onChange={(e) => setSelectedTopic(e.target.value)}
                  className={styles.select}
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

            <div className={styles.formGroup}>
              <label>Difficulty Level</label>
              <div className={styles.difficultyButtons}>
                {difficulties.map((diff) => (
                  <button
                    key={diff.value}
                    type="button"
                    className={`${styles.difficultyBtn} ${
                      quizData.difficulty === diff.value ? styles.active : ''
                    }`}
                    onClick={() => handleQuizDataChange('difficulty', diff.value)}
                    style={{ '--difficulty-color': diff.color }}
                  >
                    {diff.label}
                  </button>
                ))}
              </div>
            </div>

            <div className={styles.formGroup}>
              <label>Time Limit (minutes)</label>
              <input
                type="number"
                value={quizData.timeLimit}
                onChange={(e) => handleQuizDataChange('timeLimit', parseInt(e.target.value))}
                min="1"
                max="180"
                className={styles.input}
              />
            </div>

            <div className={styles.formGroup}>
              <label>Passing Score (%)</label>
              <input
                type="number"
                value={quizData.passingScore}
                onChange={(e) => handleQuizDataChange('passingScore', parseInt(e.target.value))}
                min="1"
                max="100"
                className={styles.input}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={quizData.isPublic}
                  onChange={(e) => handleQuizDataChange('isPublic', e.target.checked)}
                  className={styles.checkbox}
                />
                Make this quiz public
              </label>
            </div>
          </div>
        </div>

        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2>Questions ({quizData.questions.length})</h2>
            <button
              type="button"
              onClick={() => setShowQuestionForm(true)}
              className={styles.addQuestionBtn}
              disabled={!quizData.subject || !quizData.topic}
            >
              + Add Question
            </button>
          </div>

          {quizData.questions.length === 0 ? (
            <div className={styles.noQuestions}>
              <p>No questions added yet. Click "Add Question" to get started.</p>
            </div>
          ) : (
            <div className={styles.questionsList}>
              {quizData.questions.map((question, index) => (
                <div key={index} className={styles.questionCard}>
                  <div className={styles.questionHeader}>
                    <h3>Question {index + 1}</h3>
                    <div className={styles.questionActions}>
                      <button
                        type="button"
                        onClick={() => editQuestion(index)}
                        className={styles.editBtn}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteQuestion(index)}
                        className={styles.deleteBtn}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                  <p className={styles.questionText}>{question.question}</p>
                  <div className={styles.optionsList}>
                    {question.options.map((option, optIndex) => (
                      <div
                        key={optIndex}
                        className={`${styles.optionItem} ${
                          option.rightans ? styles.correctOption : ''
                        }`}
                      >
                        <span className={styles.optionLetter}>
                          {String.fromCharCode(65 + optIndex)}
                        </span>
                        <span className={styles.optionText}>{option.text}</span>
                        {option.rightans && <span className={styles.correctBadge}>✓</span>}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className={styles.actions}>
          <button
            type="button"
            onClick={() => navigate('/')}
            className={styles.cancelBtn}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={saveQuiz}
            disabled={isLoading || quizData.questions.length === 0}
            className={styles.saveBtn}
          >
            {isLoading ? (
              <RotatingLines width="20" strokeColor="#fff" />
            ) : (
              'Save Quiz'
            )}
          </button>
        </div>
      </div>

      {/* Question Form Modal */}
      {showQuestionForm && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h3>{editingQuestionIndex >= 0 ? 'Edit Question' : 'Add New Question'}</h3>
              <button
                type="button"
                onClick={() => {
                  setShowQuestionForm(false);
                  setEditingQuestionIndex(-1);
                  setCurrentQuestion({
                    question: '',
                    questionType: 'Multiple Choice',
                    options: [
                      { text: '', rightans: false, imageURL: '' },
                      { text: '', rightans: false, imageURL: '' },
                      { text: '', rightans: false, imageURL: '' },
                      { text: '', rightans: false, imageURL: '' }
                    ],
                    explanation: ''
                  });
                }}
                className={styles.closeBtn}
              >
                ×
              </button>
            </div>

            <div className={styles.modalBody}>
              <div className={styles.formGroup}>
                <label>Question *</label>
                <textarea
                  value={currentQuestion.question}
                  onChange={(e) => handleQuestionChange('question', e.target.value)}
                  placeholder="Enter your question"
                  className={styles.textarea}
                  rows="3"
                />
              </div>

              <div className={styles.formGroup}>
                <label>Question Type</label>
                <select
                  value={currentQuestion.questionType}
                  onChange={(e) => handleQuestionChange('questionType', e.target.value)}
                  className={styles.select}
                >
                  <option value="Multiple Choice">Multiple Choice</option>
                  <option value="True/False">True/False</option>
                  <option value="Fill in the Blank">Fill in the Blank</option>
                  <option value="Short Answer">Short Answer</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label>Options *</label>
                {currentQuestion.options.map((option, index) => (
                  <div key={index} className={styles.optionInput}>
                    <input
                      type="radio"
                      name="correctAnswer"
                      checked={option.rightans}
                      onChange={() => handleCorrectAnswerChange(index)}
                      className={styles.radio}
                    />
                    <input
                      type="text"
                      value={option.text}
                      onChange={(e) => handleOptionChange(index, 'text', e.target.value)}
                      placeholder={`Option ${String.fromCharCode(65 + index)}`}
                      className={styles.optionTextInput}
                    />
                  </div>
                ))}
              </div>

              <div className={styles.formGroup}>
                <label>Explanation</label>
                <textarea
                  value={currentQuestion.explanation}
                  onChange={(e) => handleQuestionChange('explanation', e.target.value)}
                  placeholder="Explain why this is the correct answer"
                  className={styles.textarea}
                  rows="2"
                />
              </div>
            </div>

            <div className={styles.modalActions}>
              <button
                type="button"
                onClick={() => {
                  setShowQuestionForm(false);
                  setEditingQuestionIndex(-1);
                }}
                className={styles.cancelBtn}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={addQuestion}
                className={styles.addBtn}
              >
                {editingQuestionIndex >= 0 ? 'Update Question' : 'Add Question'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateQuizPage;
