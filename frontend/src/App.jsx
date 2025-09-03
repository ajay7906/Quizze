// src/App.jsx
import React, { useState, useEffect, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import './App.css';
import Register from './pages/register/RegisterPage';
import Home from './pages/home/Home';
import 'react-toastify/dist/ReactToastify.css';
import Sidebar from './components/sidebar/Sidebar';
import AnalysisPage from './pages/analytic/AnalysisPage';
import ShareQuiz from './pages/sharequiz/ShareQuiz';
import Layout from './components/layout/Layout';
import QuestionPage from './pages/questionpage/QuestionPage';
import SuccessPage from './pages/successpage/SuccessPage';
import PracticePage from './pages/practice/PracticePage';
import PracticeSession from './pages/practice/PracticeSession';
import CreateQuizPage from './pages/createquiz/CreateQuizPage';
import AuthContext from './context/AuthContext';

const App = () => {
  
  const { isLoggedIn } = useContext(AuthContext);
 
  return (

    <Router>
      <ToastContainer />
      <div className="appcontainer">
        <Routes>

          <Route path="/" element={isLoggedIn ? <Layout> <Home /> </Layout> : <Navigate to="/register" />} />
          <Route
            path="/register"
            element={isLoggedIn ? <Navigate to="/" /> : <Register />}
          />
          <Route
            path="/analytics"
            element={<Layout><AnalysisPage /></Layout>}
          />
          <Route
            path="/sharequiz/:quizId"
            element={<ShareQuiz />}
          />
          <Route path='/questiondetails/:quizId' element={<Layout><QuestionPage /></Layout>} />
          <Route path='/successpage' element={<SuccessPage />} />
          
                           {/* New Practice Routes */}
                 <Route
                   path="/practice"
                   element={isLoggedIn ? <Layout><PracticePage /></Layout> : <Navigate to="/register" />}
                 />
                 <Route
                   path="/practice-session"
                   element={isLoggedIn ? <PracticeSession /> : <Navigate to="/register" />}
                 />

                 {/* Create Quiz Route */}
                 <Route
                   path="/create-quiz"
                   element={isLoggedIn ? <Layout><CreateQuizPage /></Layout> : <Navigate to="/register" />}
                 />

        </Routes>
      </div>
    </Router>
  );
};

export default App;

