// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { toast } from 'react-toastify';
// import styles from './CreateQuizPage.module.css';
// import { RotatingLines } from 'react-loader-spinner';

// const CreateQuizPage = () => {
//   const [subjects, setSubjects] = useState([]);
//   const [selectedSubject, setSelectedSubject] = useState('');
//   const [selectedTopic, setSelectedTopic] = useState('');
//   const [topics, setTopics] = useState([]);
//   const [quizData, setQuizData] = useState({
//     title: '',
//     description: '',
//     subject: '',
//     topic: '',
//     difficulty: 'Intermediate',
//     timeLimit: 30,
//     passingScore: 70,
//     isPublic: false,
//     questions: []
//   });
//   const [currentQuestion, setCurrentQuestion] = useState({
//     question: '',
//     questionType: 'Multiple Choice',
//     options: [
//       { text: '', rightans: false, imageURL: '' },
//       { text: '', rightans: false, imageURL: '' },
//       { text: '', rightans: false, imageURL: '' },
//       { text: '', rightans: false, imageURL: '' }
//     ],
//     explanation: ''
//   });
//   const [isLoading, setIsLoading] = useState(false);
//   const [showQuestionForm, setShowQuestionForm] = useState(false);
//   const [editingQuestionIndex, setEditingQuestionIndex] = useState(-1);
//   const [createdQuizId, setCreatedQuizId] = useState(null);

//   const navigate = useNavigate();

//   useEffect(() => {
//     fetchSubjects();
//   }, []);

//   useEffect(() => {
//     if (selectedSubject) {
//       const subject = subjects.find(s => s.name === selectedSubject);
//       setTopics(subject?.topics || []);
//       setSelectedTopic('');
//       setQuizData(prev => ({ ...prev, subject: selectedSubject, topic: '' }));
//     }
//   }, [selectedSubject, subjects]);

//   useEffect(() => {
//     if (selectedTopic) {
//       setQuizData(prev => ({ ...prev, topic: selectedTopic }));
//     }
//   }, [selectedTopic]);

//   const fetchSubjects = async () => {
//     try {
//       const response = await fetch('http://localhost:3000/api/v1/exam/subjects', {
//         headers: {
//           'Authorization': `Bearer ${localStorage.getItem('jwttokenuser')}`
//         }
//       });
//       const data = await response.json();
//       if (data.success) {
//         setSubjects(data.data);
//       }
//     } catch (error) {
//       console.error('Error fetching subjects:', error);
//       toast.error('Failed to load subjects');
//     }
//   };

//   const handleQuizDataChange = (field, value) => {
//     setQuizData(prev => ({ ...prev, [field]: value }));
//   };

//   const handleQuestionChange = (field, value) => {
//     setCurrentQuestion(prev => ({ ...prev, [field]: value }));
//   };

//   const handleOptionChange = (index, field, value) => {
//     setCurrentQuestion(prev => ({
//       ...prev,
//       options: prev.options.map((option, i) => 
//         i === index ? { ...option, [field]: value } : option
//       )
//     }));
//   };

//   const handleCorrectAnswerChange = (index) => {
//     setCurrentQuestion(prev => ({
//       ...prev,
//       options: prev.options.map((option, i) => ({
//         ...option,
//         rightans: i === index
//       }))
//     }));
//   };

//   const addQuestion = () => {
//     if (!currentQuestion.question.trim()) {
//       toast.error('Please enter a question');
//       return;
//     }

//     if (!currentQuestion.options.some(opt => opt.rightans)) {
//       toast.error('Please select a correct answer');
//       return;
//     }

//     if (currentQuestion.options.some(opt => !opt.text.trim())) {
//       toast.error('Please fill in all options');
//       return;
//     }

//     const newQuestion = {
//       ...currentQuestion,
//       subject: quizData.subject,
//       topic: quizData.topic,
//       difficulty: quizData.difficulty
//     };

//     if (editingQuestionIndex >= 0) {
//       // Editing existing question
//       setQuizData(prev => ({
//         ...prev,
//         questions: prev.questions.map((q, i) => 
//           i === editingQuestionIndex ? newQuestion : q
//         )
//       }));
//       setEditingQuestionIndex(-1);
//     } else {
//       // Adding new question
//       setQuizData(prev => ({
//         ...prev,
//         questions: [...prev.questions, newQuestion]
//       }));
//     }

//     // Reset form
//     setCurrentQuestion({
//       question: '',
//       questionType: 'Multiple Choice',
//       options: [
//         { text: '', rightans: false, imageURL: '' },
//         { text: '', rightans: false, imageURL: '' },
//         { text: '', rightans: false, imageURL: '' },
//         { text: '', rightans: false, imageURL: '' }
//       ],
//       explanation: ''
//     });
//     setShowQuestionForm(false);
//     toast.success(editingQuestionIndex >= 0 ? 'Question updated!' : 'Question added!');
//   };

//   const editQuestion = (index) => {
//     const question = quizData.questions[index];
//     setCurrentQuestion(question);
//     setEditingQuestionIndex(index);
//     setShowQuestionForm(true);
//   };

//   const deleteQuestion = (index) => {
//     setQuizData(prev => ({
//       ...prev,
//       questions: prev.questions.filter((_, i) => i !== index)
//     }));
//     toast.success('Question deleted!');
//   };

//   const saveQuiz = async () => {
//     if (!quizData.title.trim()) {
//       toast.error('Please enter a quiz title');
//       return;
//     }

//     if (!quizData.subject) {
//       toast.error('Please select a subject');
//       return;
//     }

//     if (!quizData.topic) {
//       toast.error('Please select a topic');
//       return;
//     }

//     if (quizData.questions.length === 0) {
//       toast.error('Please add at least one question');
//       return;
//     }

//     setIsLoading(true);
//     try {
//       const response = await fetch('http://localhost:3000/api/v1/quiz/create', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${localStorage.getItem('jwttokenuser')}`
//         },
//         body: JSON.stringify({
//           ...quizData,
//           type: 'Q&A',
//           user: localStorage.getItem('userId')
//         })
//       });

//       const data = await response.json();
//       if (data.success) {
//         toast.success('Quiz created successfully!');
//         setCreatedQuizId(data.data._id);
//         // Don't navigate immediately, allow PDF generation
//       } else {
//         toast.error(data.message || 'Failed to create quiz');
//       }
//     } catch (error) {
//       console.error('Error creating quiz:', error);
//       toast.error('Failed to create quiz');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleGeneratePDF = async () => {
//     if (!createdQuizId) {
//       toast.error('Please create the quiz first');
//       return;
//     }

//     try {
//       const response = await fetch(`http://localhost:3000/api/v1/pdf/quiz/${createdQuizId}/pdf`, {
//         method: 'GET',
//         headers: {
//           'Authorization': `Bearer ${localStorage.getItem('jwttokenuser')}`
//         }
//       });

//       if (response.ok) {
//         const blob = await response.blob();
//         const url = window.URL.createObjectURL(blob);
//         const a = document.createElement('a');
//         a.href = url;
//         a.download = `${quizData.title.replace(/[^a-z0-9]/gi, '_')}.pdf`;
//         document.body.appendChild(a);
//         a.click();
//         window.URL.revokeObjectURL(url);
//         document.body.removeChild(a);
//         toast.success('PDF generated successfully!');
//       } else {
//         toast.error('Failed to generate PDF');
//       }
//     } catch (error) {
//       console.error('Error generating PDF:', error);
//       toast.error('Failed to generate PDF');
//     }
//   };

//   const difficulties = [
//     { value: 'Beginner', label: 'Beginner', color: '#4CAF50' },
//     { value: 'Intermediate', label: 'Intermediate', color: '#FF9800' },
//     { value: 'Advanced', label: 'Advanced', color: '#F44336' },
//     { value: 'Expert', label: 'Expert', color: '#9C27B0' }
//   ];

//   return (
//     <div className={styles.container}>
//       <div className={styles.header}>
//         <h1>Create  Paper</h1>
//         <p>Create a comprehensive quiz paper for your students</p>
//       </div>

//       <div className={styles.quizForm}>
//         <div className={styles.section}>
//           <h2>Paper Information</h2>
//           <div className={styles.formGrid}>
//             <div className={styles.formGroup}>
//               <label>Quiz Title *</label>
//               <input
//                 type="text"
//                 value={quizData.title}
//                 onChange={(e) => handleQuizDataChange('title', e.target.value)}
//                 placeholder="Enter quiz title"
//                 className={styles.input}
//               />
//             </div>

//             <div className={styles.formGroup}>
//               <label>Description</label>
//               <textarea
//                 value={quizData.description}
//                 onChange={(e) => handleQuizDataChange('description', e.target.value)}
//                 placeholder="Enter quiz description"
//                 className={styles.textarea}
//                 rows="3"
//               />
//             </div>

//             <div className={styles.formGroup}>
//               <label>Subject *</label>
//               <select
//                 value={selectedSubject}
//                 onChange={(e) => setSelectedSubject(e.target.value)}
//                 className={styles.select}
//               >
//                 <option value="">Choose a subject</option>
//                 {subjects.map((subject) => (
//                   <option key={subject.code} value={subject.name}>
//                     {subject.name}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             {selectedSubject && (
//               <div className={styles.formGroup}>
//                 <label>Topic *</label>
//                 <select
//                   value={selectedTopic}
//                   onChange={(e) => setSelectedTopic(e.target.value)}
//                   className={styles.select}
//                 >
//                   <option value="">Choose a topic</option>
//                   {topics.map((topic, index) => (
//                     <option key={index} value={topic.name}>
//                       {topic.name} ({topic.difficulty})
//                     </option>
//                   ))}
//                 </select>
//               </div>
//             )}

//             <div className={styles.formGroup}>
//               <label>Difficulty Level</label>
//               <div className={styles.difficultyButtons}>
//                 {difficulties.map((diff) => (
//                   <button
//                     key={diff.value}
//                     type="button"
//                     className={`${styles.difficultyBtn} ${
//                       quizData.difficulty === diff.value ? styles.active : ''
//                     }`}
//                     onClick={() => handleQuizDataChange('difficulty', diff.value)}
//                     style={{ '--difficulty-color': diff.color }}
//                   >
//                     {diff.label}
//                   </button>
//                 ))}
//               </div>
//             </div>

//             <div className={styles.formGroup}>
//               <label>Time Limit (minutes)</label>
//               <input
//                 type="number"
//                 value={quizData.timeLimit}
//                 onChange={(e) => handleQuizDataChange('timeLimit', parseInt(e.target.value))}
//                 min="1"
//                 max="180"
//                 className={styles.input}
//               />
//             </div>

//             <div className={styles.formGroup}>
//               <label>Passing Score (%)</label>
//               <input
//                 type="number"
//                 value={quizData.passingScore}
//                 onChange={(e) => handleQuizDataChange('passingScore', parseInt(e.target.value))}
//                 min="1"
//                 max="100"
//                 className={styles.input}
//               />
//             </div>

//             <div className={styles.formGroup}>
//               <label className={styles.checkboxLabel}>
//                 <input
//                   type="checkbox"
//                   checked={quizData.isPublic}
//                   onChange={(e) => handleQuizDataChange('isPublic', e.target.checked)}
//                   className={styles.checkbox}
//                 />
//                 Make this quiz public
//               </label>
//             </div>
//           </div>
//         </div>

//         <div className={styles.section}>
//           <div className={styles.sectionHeader}>
//             <h2>Questions ({quizData.questions.length})</h2>
//             <button
//               type="button"
//               onClick={() => setShowQuestionForm(true)}
//               className={styles.addQuestionBtn}
//               disabled={!quizData.subject || !quizData.topic}
//             >
//               + Add Question
//             </button>
//           </div>

//           {quizData.questions.length === 0 ? (
//             <div className={styles.noQuestions}>
//               <p>No questions added yet. Click "Add Question" to get started.</p>
//             </div>
//           ) : (
//             <div className={styles.questionsList}>
//               {quizData.questions.map((question, index) => (
//                 <div key={index} className={styles.questionCard}>
//                   <div className={styles.questionHeader}>
//                     <h3>Question {index + 1}</h3>
//                     <div className={styles.questionActions}>
//                       <button
//                         type="button"
//                         onClick={() => editQuestion(index)}
//                         className={styles.editBtn}
//                       >
//                         Edit
//                       </button>
//                       <button
//                         type="button"
//                         onClick={() => deleteQuestion(index)}
//                         className={styles.deleteBtn}
//                       >
//                         Delete
//                       </button>
//                     </div>
//                   </div>
//                   <p className={styles.questionText}>{question.question}</p>
//                   <div className={styles.optionsList}>
//                     {question.options.map((option, optIndex) => (
//                       <div
//                         key={optIndex}
//                         className={`${styles.optionItem} ${
//                           option.rightans ? styles.correctOption : ''
//                         }`}
//                       >
//                         <span className={styles.optionLetter}>
//                           {String.fromCharCode(65 + optIndex)}
//                         </span>
//                         <span className={styles.optionText}>{option.text}</span>
//                         {option.rightans && <span className={styles.correctBadge}>✓</span>}
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>

//         <div className={styles.actions}>
//           <button
//             type="button"
//             onClick={() => navigate('/')}
//             className={styles.cancelBtn}
//           >
//             Cancel
//           </button>
//           {createdQuizId && (
//             <button
//               type="button"
//               onClick={handleGeneratePDF}
//               className={styles.pdfBtn}
//             >
//               📄 Generate PDF
//             </button>
//           )}
//           <button
//             type="button"
//             onClick={saveQuiz}
//             disabled={isLoading || quizData.questions.length === 0}
//             className={styles.saveBtn}
//           >
//             {isLoading ? (
//               <RotatingLines width="20" strokeColor="#fff" />
//             ) : (
//               'Save Quiz'
//             )}
//           </button>
//         </div>
//       </div>

//       {/* Question Form Modal */}
//       {showQuestionForm && (
//         <div className={styles.modalOverlay}>
//           <div className={styles.modalContent}>
//             <div className={styles.modalHeader}>
//               <h3>{editingQuestionIndex >= 0 ? 'Edit Question' : 'Add New Question'}</h3>
//               <button
//                 type="button"
//                 onClick={() => {
//                   setShowQuestionForm(false);
//                   setEditingQuestionIndex(-1);
//                   setCurrentQuestion({
//                     question: '',
//                     questionType: 'Multiple Choice',
//                     options: [
//                       { text: '', rightans: false, imageURL: '' },
//                       { text: '', rightans: false, imageURL: '' },
//                       { text: '', rightans: false, imageURL: '' },
//                       { text: '', rightans: false, imageURL: '' }
//                     ],
//                     explanation: ''
//                   });
//                 }}
//                 className={styles.closeBtn}
//               >
//                 ×
//               </button>
//             </div>

//             <div className={styles.modalBody}>
//               <div className={styles.formGroup}>
//                 <label>Question *</label>
//                 <textarea
//                   value={currentQuestion.question}
//                   onChange={(e) => handleQuestionChange('question', e.target.value)}
//                   placeholder="Enter your question"
//                   className={styles.textarea}
//                   rows="3"
//                 />
//               </div>

//               <div className={styles.formGroup}>
//                 <label>Question Type</label>
//                 <select
//                   value={currentQuestion.questionType}
//                   onChange={(e) => handleQuestionChange('questionType', e.target.value)}
//                   className={styles.select}
//                 >
//                   <option value="Multiple Choice">Multiple Choice</option>
//                   <option value="True/False">True/False</option>
//                   <option value="Fill in the Blank">Fill in the Blank</option>
//                   <option value="Short Answer">Short Answer</option>
//                 </select>
//               </div>

//               <div className={styles.formGroup}>
//                 <label>Options *</label>
//                 {currentQuestion.options.map((option, index) => (
//                   <div key={index} className={styles.optionInput}>
//                     <input
//                       type="radio"
//                       name="correctAnswer"
//                       checked={option.rightans}
//                       onChange={() => handleCorrectAnswerChange(index)}
//                       className={styles.radio}
//                     />
//                     <input
//                       type="text"
//                       value={option.text}
//                       onChange={(e) => handleOptionChange(index, 'text', e.target.value)}
//                       placeholder={`Option ${String.fromCharCode(65 + index)}`}
//                       className={styles.optionTextInput}
//                     />
//                   </div>
//                 ))}
//               </div>

//               <div className={styles.formGroup}>
//                 <label>Explanation</label>
//                 <textarea
//                   value={currentQuestion.explanation}
//                   onChange={(e) => handleQuestionChange('explanation', e.target.value)}
//                   placeholder="Explain why this is the correct answer"
//                   className={styles.textarea}
//                   rows="2"
//                 />
//               </div>
//             </div>

//             <div className={styles.modalActions}>
//               <button
//                 type="button"
//                 onClick={() => {
//                   setShowQuestionForm(false);
//                   setEditingQuestionIndex(-1);
//                 }}
//                 className={styles.cancelBtn}
//               >
//                 Cancel
//               </button>
//               <button
//                 type="button"
//                 onClick={addQuestion}
//                 className={styles.addBtn}
//               >
//                 {editingQuestionIndex >= 0 ? 'Update Question' : 'Add Question'}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default CreateQuizPage;



































































































import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
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
    answer: '',
    marks: 1,
    explanation: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showQuestionForm, setShowQuestionForm] = useState(false);
  const [editingQuestionIndex, setEditingQuestionIndex] = useState(-1);
  const [createdQuizId, setCreatedQuizId] = useState(null);
  const [activeTab, setActiveTab] = useState('mcq');

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
    // Validation based on question type
    if (!currentQuestion.question.trim()) {
      toast.error('Please enter a question');
      return;
    }

    if (currentQuestion.questionType === 'Multiple Choice' || currentQuestion.questionType === 'True/False') {
      if (!currentQuestion.options.some(opt => opt.rightans)) {
        toast.error('Please select a correct answer');
        return;
      }

      if (currentQuestion.options.some(opt => !opt.text.trim())) {
        toast.error('Please fill in all options');
        return;
      }
    } else if (['Short Answer', 'Essay', 'Descriptive'].includes(currentQuestion.questionType)) {
      if (!currentQuestion.answer.trim()) {
        toast.error('Please provide an answer');
        return;
      }
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
    resetQuestionForm();
    setShowQuestionForm(false);
    toast.success(editingQuestionIndex >= 0 ? 'Question updated!' : 'Question added!');
  };

  const resetQuestionForm = () => {
    setCurrentQuestion({
      question: '',
      questionType: activeTab === 'mcq' ? 'Multiple Choice' : 'Descriptive',
      options: [
        { text: '', rightans: false, imageURL: '' },
        { text: '', rightans: false, imageURL: '' },
        { text: '', rightans: false, imageURL: '' },
        { text: '', rightans: false, imageURL: '' }
      ],
      answer: '',
      marks: 1,
      explanation: ''
    });
  };

  const editQuestion = (index) => {
    const question = quizData.questions[index];
    setCurrentQuestion(question);
    setEditingQuestionIndex(index);
    setActiveTab(['Multiple Choice', 'True/False'].includes(question.questionType) ? 'mcq' : 'descriptive');
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
      const response = await fetch('http://localhost:3000/api/v1/quiz/create', {
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
        setCreatedQuizId(data.data._id);
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

  const handleGeneratePDF = async () => {
    if (!createdQuizId) {
      toast.error('Please create the quiz first');
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/api/v1/pdf/quiz/${createdQuizId}/pdf`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('jwttokenuser')}`
        }
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${quizData.title.replace(/[^a-z0-9]/gi, '_')}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        toast.success('PDF generated successfully!');
      } else {
        toast.error('Failed to generate PDF');
      }
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('Failed to generate PDF');
    }
  };

  const difficulties = [
    { value: 'Beginner', label: 'Beginner', color: 'bg-green-500' },
    { value: 'Intermediate', label: 'Intermediate', color: 'bg-yellow-500' },
    { value: 'Advanced', label: 'Advanced', color: 'bg-red-500' },
    { value: 'Expert', label: 'Expert', color: 'bg-purple-500' }
  ];

  const questionTypes = [
    { value: 'Multiple Choice', label: 'Multiple Choice' },
    { value: 'True/False', label: 'True/False' },
    { value: 'Short Answer', label: 'Short Answer' },
    { value: 'Essay', label: 'Essay' },
    { value: 'Descriptive', label: 'Descriptive' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Question Paper</h1>
            <p className="text-gray-600">Create a comprehensive question paper with both MCQ and descriptive questions</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4 pb-2 border-b-2 border-blue-500">Paper Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Quiz Title *</label>
              <input
                type="text"
                value={quizData.title}
                onChange={(e) => handleQuizDataChange('title', e.target.value)}
                placeholder="Enter quiz title"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                value={quizData.description}
                onChange={(e) => handleQuizDataChange('description', e.target.value)}
                placeholder="Enter quiz description"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                rows="3"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Subject *</label>
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
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
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Topic *</label>
                <select
                  value={selectedTopic}
                  onChange={(e) => setSelectedTopic(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty Level</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {difficulties.map((diff) => (
                  <button
                    key={diff.value}
                    type="button"
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      quizData.difficulty === diff.value 
                        ? `${diff.color} text-white shadow-md transform -translate-y-1` 
                        : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                    }`}
                    onClick={() => handleQuizDataChange('difficulty', diff.value)}
                  >
                    {diff.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Time Limit (minutes)</label>
              <input
                type="number"
                value={quizData.timeLimit}
                onChange={(e) => handleQuizDataChange('timeLimit', parseInt(e.target.value))}
                min="1"
                max="180"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Passing Score (%)</label>
              <input
                type="number"
                value={quizData.passingScore}
                onChange={(e) => handleQuizDataChange('passingScore', parseInt(e.target.value))}
                min="1"
                max="100"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                checked={quizData.isPublic}
                onChange={(e) => handleQuizDataChange('isPublic', e.target.checked)}
                className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label className="ml-2 block text-sm text-gray-700">Make this quiz public</label>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4 sm:mb-0">Questions ({quizData.questions.length})</h2>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  type="button"
                  className={`px-4 py-2 rounded-md font-medium transition-all ${
                    activeTab === 'mcq' ? 'bg-white shadow-md' : 'text-gray-600'
                  }`}
                  onClick={() => setActiveTab('mcq')}
                >
                  MCQ Questions
                </button>
                <button
                  type="button"
                  className={`px-4 py-2 rounded-md font-medium transition-all ${
                    activeTab === 'descriptive' ? 'bg-white shadow-md' : 'text-gray-600'
                  }`}
                  onClick={() => setActiveTab('descriptive')}
                >
                  Descriptive Questions
                </button>
              </div>
              
              <button
                type="button"
                onClick={() => setShowQuestionForm(true)}
                className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all transform hover:-translate-y-1 shadow-md disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                disabled={!quizData.subject || !quizData.topic}
              >
                + Add Question
              </button>
            </div>
          </div>

          {quizData.questions.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
              <p className="text-gray-500">No questions added yet. Click "Add Question" to get started.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {quizData.questions.map((question, index) => (
                <div key={index} className="bg-gray-50 rounded-xl p-6 border-l-4 border-blue-500 transition-all hover:shadow-md">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-800">
                      Question {index + 1} ({question.questionType}) - {question.marks} mark(s)
                    </h3>
                    <div className="flex gap-2 mt-2 sm:mt-0">
                      <button
                        type="button"
                        onClick={() => editQuestion(index)}
                        className="px-3 py-1 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteQuestion(index)}
                        className="px-3 py-1 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                  
                  <p className="text-gray-700 mb-4">{question.question}</p>
                  
                  {['Multiple Choice', 'True/False'].includes(question.questionType) ? (
                    <div className="space-y-2">
                      {question.options.map((option, optIndex) => (
                        <div
                          key={optIndex}
                          className={`flex items-center p-3 rounded-lg ${
                            option.rightans ? 'bg-green-100 border-l-4 border-green-500' : 'bg-white border'
                          }`}
                        >
                          <span className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-medium mr-3">
                            {String.fromCharCode(65 + optIndex)}
                          </span>
                          <span className="flex-1">{option.text}</span>
                          {option.rightans && (
                            <span className="ml-2 px-2 py-1 bg-green-500 text-white text-xs font-medium rounded-full">
                              ✓ Correct
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
                      <p className="font-medium text-blue-800">Answer:</p>
                      <p className="text-blue-700">{question.answer}</p>
                      {question.explanation && (
                        <>
                          <p className="font-medium text-blue-800 mt-3">Explanation:</p>
                          <p className="text-blue-700">{question.explanation}</p>
                        </>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row justify-end gap-4">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-gray-600 text-white font-medium rounded-lg hover:bg-gray-700 transition"
          >
            Cancel
          </button>
          
          {createdQuizId && (
            <button
              type="button"
              onClick={handleGeneratePDF}
              className="px-6 py-3 bg-gradient-to-r from-green-600 to-teal-600 text-white font-medium rounded-lg hover:from-green-700 hover:to-teal-700 transition flex items-center gap-2"
            >
              📄 Generate PDF
            </button>
          )}
          
          <button
            type="button"
            onClick={saveQuiz}
            disabled={isLoading || quizData.questions.length === 0}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-purple-700 transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b">
              <h3 className="text-xl font-semibold text-gray-800">
                {editingQuestionIndex >= 0 ? 'Edit Question' : 'Add New Question'}
              </h3>
              
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  type="button"
                  className={`px-3 py-1 rounded-md text-sm font-medium transition-all ${
                    activeTab === 'mcq' ? 'bg-white shadow-md' : 'text-gray-600'
                  }`}
                  onClick={() => {
                    setActiveTab('mcq');
                    setCurrentQuestion(prev => ({ ...prev, questionType: 'Multiple Choice' }));
                  }}
                >
                  MCQ
                </button>
                <button
                  type="button"
                  className={`px-3 py-1 rounded-md text-sm font-medium transition-all ${
                    activeTab === 'descriptive' ? 'bg-white shadow-md' : 'text-gray-600'
                  }`}
                  onClick={() => {
                    setActiveTab('descriptive');
                    setCurrentQuestion(prev => ({ ...prev, questionType: 'Descriptive' }));
                  }}
                >
                  Descriptive
                </button>
              </div>
              
              <button
                type="button"
                onClick={() => {
                  setShowQuestionForm(false);
                  setEditingQuestionIndex(-1);
                  resetQuestionForm();
                }}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ×
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Question *</label>
                <textarea
                  value={currentQuestion.question}
                  onChange={(e) => handleQuestionChange('question', e.target.value)}
                  placeholder="Enter your question"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  rows="3"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Question Type</label>
                  <select
                    value={currentQuestion.questionType}
                    onChange={(e) => handleQuestionChange('questionType', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  >
                    {questionTypes.map(type => (
                      <option key={type.value} value={type.value}>{type.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Marks</label>
                  <input
                    type="number"
                    value={currentQuestion.marks}
                    onChange={(e) => handleQuestionChange('marks', parseInt(e.target.value))}
                    min="1"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  />
                </div>
              </div>

              {['Multiple Choice', 'True/False'].includes(currentQuestion.questionType) ? (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Options *</label>
                  <div className="space-y-3">
                    {currentQuestion.options.map((option, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="correctAnswer"
                          checked={option.rightans}
                          onChange={() => handleCorrectAnswerChange(index)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                        />
                        <input
                          type="text"
                          value={option.text}
                          onChange={(e) => handleOptionChange(index, 'text', e.target.value)}
                          placeholder={`Option ${String.fromCharCode(65 + index)}`}
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Answer *</label>
                  <textarea
                    value={currentQuestion.answer}
                    onChange={(e) => handleQuestionChange('answer', e.target.value)}
                    placeholder="Enter the expected answer"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    rows="3"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Explanation</label>
                <textarea
                  value={currentQuestion.explanation}
                  onChange={(e) => handleQuestionChange('explanation', e.target.value)}
                  placeholder="Explain why this is the correct answer"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  rows="2"
                />
              </div>
            </div>

            <div className="flex justify-end gap-4 p-6 border-t">
              <button
                type="button"
                onClick={() => {
                  setShowQuestionForm(false);
                  setEditingQuestionIndex(-1);
                  resetQuestionForm();
                }}
                className="px-6 py-2 bg-gray-600 text-white font-medium rounded-lg hover:bg-gray-700 transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={addQuestion}
                className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-purple-700 transition"
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