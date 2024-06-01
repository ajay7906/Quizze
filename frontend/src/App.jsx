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
import AuthContext from './context/AuthContext';


const App = () => {
  
  const { isLoggedIn } = useContext(AuthContext);
 
 
  return (

    <Router>
      {/* <ToastContainer /> */}
      <div className="appcontainer">
        {/*        
        <Sidebar /> */}
        <Routes>

          <Route path="/" element={isLoggedIn ? <Layout> <Home /> </Layout> : <Navigate to="/register" />} />
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
            
            />} // Add sharequiz route
          />
          <Route path='/questiondetails/:quizId' element={<Layout><QuestionPage /></Layout>} />
          <Route path='/successpage' element={<SuccessPage />} />



        </Routes>
      </div>
    </Router>
  );
};

export default App;

