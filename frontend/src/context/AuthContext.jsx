// // src/context/AuthContext.jsx
// import React, { createContext, useState, useEffect } from 'react';

// const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const [quizData, setQuizData] = useState([]);

//   const addQuiz = (newQuiz) => {
//     setQuizData((prevQuizData) => [...prevQuizData, newQuiz]);
//   };


//   useEffect(() => {
//     // Check for token in local storage
//     const token = localStorage.getItem('jwttokenuser');
//     if (token) {
//       setIsLoggedIn(true);
//     }
//   }, []);

//   const login = () => {
//     setIsLoggedIn(true);
//     // localStorage.setItem('jwttokenuser', 'your-token'); // Replace with actual token
//   };

//   const logout = () => {
//     setIsLoggedIn(false);
//     localStorage.removeItem('jwttokenuser');
//   };

//   return (
//     <AuthContext.Provider value={{ isLoggedIn, login, logout, quizData, addQuiz  }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export default AuthContext;







import React, { createContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [quizData, setQuizData] = useState([]);

  const addQuiz = (newQuiz) => {
    setQuizData((prevQuizData) => [...prevQuizData, newQuiz]);
  };

  useEffect(() => {
    const checkTokenExpiration = () => {
      const expirationTime = localStorage.getItem('tokenExpiration');
     // console.log(expirationTime, Date.now() > expirationTime);
      if (expirationTime && Date.now() > expirationTime) {
        localStorage.removeItem('jwttokenuser');
        localStorage.removeItem('tokenExpiration');
        setIsLoggedIn(false);
      } else {
        const token = localStorage.getItem('jwttokenuser');
        if (token) {
          setIsLoggedIn(true);
        }
      }
    };

    checkTokenExpiration();
    const interval = setInterval(checkTokenExpiration, 60000); // Check every minute

    return () => clearInterval(interval);
  }, []);

  const login = () => {
    setIsLoggedIn(true);
  };

  const logout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('jwttokenuser');
    localStorage.removeItem('tokenExpiration');
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout, quizData, addQuiz }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;

