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
  return (
    <Router>
      <ToastContainer />
      <div className="appcontainer">
        <Sidebar />
        <Routes>
          <Route exact path="/">
            <Route exact path="/" element={isLoggedIn ? <Home /> : <Navigate to="/register" />} />
            <Route
              path="/register"
              element={isLoggedIn ? <Navigate to="/" /> : <Register />}
            />
              <Route
            path="/analytics"
            element={<AnalysisPage />} // Add AnalysisPage route
          />

          </Route>

        </Routes>
      </div>
    </Router>
  );
};

export default App;

