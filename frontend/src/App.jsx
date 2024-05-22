// import { useState } from 'react'
// import { ToastContainer } from 'react-toastify';
// import './App.css'
// import Register from './components/register/Register'
// import 'react-toastify/dist/ReactToastify.css';
// function App() {


//   return (
//     <>
//      <ToastContainer/>
//      <Register/>
//     </>
//   )
// }

// export default App



// src/App.jsx
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import './App.css';
import Register from './pages/register/RegisterPage';
import Home from './pages/home/Home';
import 'react-toastify/dist/ReactToastify.css';
import Sidebar from './components/sidebar/Sidebar';
import AnalysisPage from './components/analytic/AnalysisPage';
import ShareQuiz from './pages/sharequiz/ShareQuiz';
import Layout from './components/layout/Layout';
import QuestionPage from './pages/questionpage/QuestionPage';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check for token in local storage
    const token = localStorage.getItem('jwttokenuser');
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);
  console.log(isLoggedIn);
  const sampleQuestion = {
    questionNumber: 1,
    totalQuestions: 4,
    questionText: 'Your question text comes here, its a sample text.',
    options: ['Option 1', 'Option 2', 'Option 3', 'Option 4'],
    timer: 10,
  };
  return (
    <Router>
      <ToastContainer />
      <div className="appcontainer">
{/*        
        <Sidebar /> */}
        <Routes>
          <Route exact path="/">
            <Route exact path="/" element={isLoggedIn ?  <Layout> <Home /> </Layout> : <Navigate to="/register" />} />
            <Route
              path="/register"
              element={isLoggedIn ? <Navigate to="/" /> : <Register />}
            />
            <Route
              path="/analytics"
              element={<Layout><AnalysisPage /></Layout>} // Add AnalysisPage route
            />
            <Route
              path="/sharequiz/:quizId"
              element={<ShareQuiz
                questionNumber={sampleQuestion.questionNumber}
                totalQuestions={sampleQuestion.totalQuestions}
                questionText={sampleQuestion.questionText}
                options={sampleQuestion.options}
                timer={sampleQuestion.timer}
              />} // Add sharequiz route
            />
            <Route path='/questiondetails/:quizId' element={<Layout><QuestionPage/></Layout>}/>

          </Route>

        </Routes>
      </div>
    </Router>
  );
};

export default App;

