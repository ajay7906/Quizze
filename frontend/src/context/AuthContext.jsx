
import React, { createContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState(null);
  const [quizData, setQuizData] = useState([]);

  const addQuiz = (newQuiz) => {
    setQuizData((prevQuizData) => [...prevQuizData, newQuiz]);
  };

  useEffect(() => {
    const checkTokenExpiration = () => {
      const expirationTime = localStorage.getItem('tokenExpiration');
   
      if (expirationTime && Date.now() > expirationTime) {
        localStorage.removeItem('jwttokenuser');
        localStorage.removeItem('tokenExpiration');
        localStorage.removeItem('role');
        localStorage.removeItem('userId');
        setIsLoggedIn(false);
        setRole(null);
      } else {
        const token = localStorage.getItem('jwttokenuser');
        const storedRole = localStorage.getItem('role');
        if (token) {
          setIsLoggedIn(true);
          setRole(storedRole);
        }
      }
    };

    checkTokenExpiration();
    const interval = setInterval(checkTokenExpiration, 60000);

    return () => clearInterval(interval);
  }, []);

  const login = () => {
    setIsLoggedIn(true);
    setRole(localStorage.getItem('role'));
  };

  const logout = () => {
    setIsLoggedIn(false);
    setRole(null);
    localStorage.removeItem('jwttokenuser');
    localStorage.removeItem('tokenExpiration');
    localStorage.removeItem('role');
    localStorage.removeItem('userId');
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, role, login, logout, quizData, addQuiz }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;

