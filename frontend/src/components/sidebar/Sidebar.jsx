

import React, { useContext, useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';

const Sidebar = () => {
  const { logout, role } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/register');
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (window.innerWidth < 1024 && isSidebarOpen && 
          !event.target.closest('aside') && 
          !event.target.closest('.lg\\:hidden.fixed.top-4.left-4')) {
        setIsSidebarOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isSidebarOpen]);

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-md bg-purple-600 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          aria-label="Toggle menu"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d={isSidebarOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
            />
          </svg>
        </button>
      </div>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={toggleSidebar}
        ></div>
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed lg:relative w-72 bg-white p-4 flex flex-col justify-between h-screen border-r border-gray-200 z-50 transform transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} overflow-hidden`}
      >
        {/* Scrollable container */}
        <div className="flex flex-col h-full overflow-hidden">
          {/* Logo Section - Fixed at top */}
          <div className="flex-shrink-0 flex flex-col items-center">
            <h2 className="font-jomhuria text-7xl text-gray-800 mb-2">EXAM</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full mb-8"></div>
          </div>

          {/* Navigation - Scrollable area */}
          <nav className="flex-1 overflow-y-auto py-2">
            <ul className="space-y-6">
              <li>
                <NavLink 
                  to={role === 'student' ? '/student' : '/'} 
                  className={({ isActive }) => 
                    `flex items-center p-3 rounded-xl transition-all duration-200 font-medium text-lg
                    ${isActive 
                      ? 'bg-gradient-to-r from-purple-100 to-indigo-100 text-purple-700 shadow-md border border-purple-200' 
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'}`
                  }
                  onClick={() => window.innerWidth < 1024 && toggleSidebar()}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  {role === 'student' ? 'My Dashboard' : 'Dashboard'}
                </NavLink>
              </li>
              <li>
                <NavLink 
                  to={role === 'student' ? '/student/analytics' : '/analytics'} 
                  className={({ isActive }) => 
                    `flex items-center p-3 rounded-xl transition-all duration-200 font-medium text-lg
                    ${isActive 
                      ? 'bg-gradient-to-r from-purple-100 to-indigo-100 text-purple-700 shadow-md border border-purple-200' 
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'}`
                  }
                  onClick={() => window.innerWidth < 1024 && toggleSidebar()}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  {role === 'student' ? 'My Analytics' : 'Analytics'}
                </NavLink>
              </li>
              <li>
                <NavLink 
                  to="/practice" 
                  className={({ isActive }) => 
                    `flex items-center p-3 rounded-xl transition-all duration-200 font-medium text-lg
                    ${isActive 
                      ? 'bg-gradient-to-r from-purple-100 to-indigo-100 text-purple-700 shadow-md border border-purple-200' 
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'}`
                  }
                  onClick={() => window.innerWidth < 1024 && toggleSidebar()}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                  Practice with AI
                </NavLink>
              </li>
              {role !== 'student' && (
                <>
                  <li>
                    <NavLink 
                      to="/create-quiz" 
                      className={({ isActive }) => 
                        `flex items-center p-3 rounded-xl transition-all duration-200 font-medium text-lg
                        ${isActive 
                          ? 'bg-gradient-to-r from-purple-100 to-indigo-100 text-purple-700 shadow-md border border-purple-200' 
                          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'}`
                      }
                      onClick={() => window.innerWidth < 1024 && toggleSidebar()}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      Create Quiz
                    </NavLink>
                  </li>
                  <li>
                    <NavLink 
                      to="/assignments" 
                      className={({ isActive }) => 
                        `flex items-center p-3 rounded-xl transition-all duration-200 font-medium text-lg
                        ${isActive 
                          ? 'bg-gradient-to-r from-purple-100 to-indigo-100 text-purple-700 shadow-md border border-purple-200' 
                          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'}`
                      }
                      onClick={() => window.innerWidth < 1024 && toggleSidebar()}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      Assignments
                    </NavLink>
                  </li>
                  <li>
                    <NavLink 
                      to="/add-students" 
                      className={({ isActive }) => 
                        `flex items-center p-3 rounded-xl transition-all duration-200 font-medium text-lg
                        ${isActive 
                          ? 'bg-gradient-to-r from-purple-100 to-indigo-100 text-purple-700 shadow-md border border-purple-200' 
                          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'}`
                      }
                      onClick={() => window.innerWidth < 1024 && toggleSidebar()}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                      </svg>
                      Add Student
                    </NavLink>
                  </li>
                </>
              )}
            </ul>
          </nav>

          {/* Logout Section - Fixed at bottom */}
          <div className="flex-shrink-0 pt-6 border-t border-gray-300 mt-auto">
            <button 
              onClick={handleLogout}
              className="flex items-center justify-center w-full p-3 text-gray-700 font-semibold rounded-xl hover:bg-gray-100 transition-all duration-200 hover:text-red-600"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              LOGOUT
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;