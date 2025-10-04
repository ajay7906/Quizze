

// import React, { useEffect, useState } from 'react';
// import { fetchDashboardStats, fetchTrendingQuizzes } from '../../api/quizApi';
// import { formatNumber } from '../../utils/formatNumber';
// import { RotatingLines } from 'react-loader-spinner';
// import NoDataImg from '../../assets/NoNmae.png';
// import EmpressionImg from '../../assets/eye.png';

// const Dashboard = () => {
//   const [stats, setStats] = useState(null);
//   const [trendingQuizzes, setTrendingQuizzes] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [activeTab, setActiveTab] = useState('overview');

//   const fetchData = async () => {
//     try {
//       const statsData = await fetchDashboardStats();
//       setStats(statsData);
//       const trendingData = await fetchTrendingQuizzes();
//       setTrendingQuizzes(trendingData);
//     } catch (error) {
//       console.error('Error fetching data:', error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchData();
//   }, []);

//   // Format date to be more readable
//   const formatDate = (dateString) => {
//     const options = { year: 'numeric', month: 'short', day: 'numeric' };
//     return new Date(dateString).toLocaleDateString(undefined, options);
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50 p-4 md:p-8">
//       {isLoading ? (
//         <div className="flex items-center justify-center min-h-screen">
//           <div className="text-center">
//             <RotatingLines width="100" strokeColor="#3B82F6" />
//             <p className="mt-4 text-gray-600">Loading your dashboard...</p>
//           </div>
//         </div>
//       ) : (
//         <div className="max-w-7xl mx-auto space-y-8">
//           {/* Header with Tabs */}
//           <div className="pt-8 pb-4">
//             <h1 className="text-3xl md:text-4xl font-bold text-gray-800">Dashboard Overview</h1>
//             <p className="text-gray-600 mt-2">Track your quiz performance and engagement</p>
            
//             {/* Tabs */}
//             <div className="flex space-x-2 mt-6 border-b border-gray-200">
//               <button
//                 className={`px-4 py-2 font-medium text-sm rounded-t-lg transition-all ${
//                   activeTab === 'overview'
//                     ? 'bg-white border-t border-l border-r border-gray-200 text-purple-600'
//                     : 'text-gray-500 hover:text-gray-700'
//                 }`}
//                 onClick={() => setActiveTab('overview')}
//               >
//                 Overview
//               </button>
//               <button
//                 className={`px-4 py-2 font-medium text-sm rounded-t-lg transition-all ${
//                   activeTab === 'analytics'
//                     ? 'bg-white border-t border-l border-r border-gray-200 text-purple-600'
//                     : 'text-gray-500 hover:text-gray-700'
//                 }`}
//                 onClick={() => setActiveTab('analytics')}
//               >
//                 Analytics
//               </button>
//             </div>
//           </div>

//           {/* Stats Cards */}
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-6 -mt-1">
//             {/* Quiz Count Card */}
//             <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-orange-500 transition-all duration-300 hover:shadow-xl overflow-hidden relative">
//               <div className="absolute top-0 right-0 w-32 h-32 bg-orange-50 rounded-full -mr-16 -mt-16"></div>
//               <div className="flex items-center justify-between relative z-10">
//                 <div>
//                   <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wider">Total Quizzes</h3>
//                   <p className="text-4xl font-bold text-gray-800 mt-2">
//                     {stats ? formatNumber(stats.totalQuizzes) : '0'}
//                   </p>
//                 </div>
//                 <div className="bg-orange-100 p-3 rounded-full shadow-sm">
//                   <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
//                   </svg>
//                 </div>
//               </div>
//               <div className="w-full bg-gray-100 h-2 mt-4 rounded-full overflow-hidden">
//                 <div 
//                   className="bg-orange-500 h-2 rounded-full" 
//                   style={{ width: `${Math.min((stats?.totalQuizzes || 0) * 10, 100)}%` }}
//                 ></div>
//               </div>
//               <p className="text-gray-600 text-sm mt-4">Quizzes Created</p>
//             </div>

//             {/* Questions Count Card */}
//             <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500 transition-all duration-300 hover:shadow-xl overflow-hidden relative">
//               <div className="absolute top-0 right-0 w-32 h-32 bg-green-50 rounded-full -mr-16 -mt-16"></div>
//               <div className="flex items-center justify-between relative z-10">
//                 <div>
//                   <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wider">Total Questions</h3>
//                   <p className="text-4xl font-bold text-gray-800 mt-2">
//                     {stats ? formatNumber(stats.totalQuestions) : '0'}
//                   </p>
//                 </div>
//                 <div className="bg-green-100 p-3 rounded-full shadow-sm">
//                   <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//                   </svg>
//                 </div>
//               </div>
//               <div className="w-full bg-gray-100 h-2 mt-4 rounded-full overflow-hidden">
//                 <div 
//                   className="bg-green-500 h-2 rounded-full" 
//                   style={{ width: `${Math.min((stats?.totalQuestions || 0) * 2, 100)}%` }}
//                 ></div>
//               </div>
//               <p className="text-gray-600 text-sm mt-4">Questions Created</p>
//             </div>

//             {/* Impressions Card - Fixed to prevent horizontal scroll */}
//             <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500 transition-all duration-300 hover:shadow-xl overflow-hidden relative">
//               <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full -mr-16 -mt-16"></div>
//               <div className="flex items-center justify-between relative z-10">
//                 <div className="min-w-0">
//                   <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wider">Total Impressions</h3>
//                   <p className="text-4xl font-bold text-gray-800 mt-2 truncate">
//                     {stats ? formatNumber(stats.totalImpressions) : '0'}
//                   </p>
//                 </div>
//                 <div className="bg-blue-100 p-3 rounded-full shadow-sm flex-shrink-0 ml-2">
//                   <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
//                   </svg>
//                 </div>
//               </div>
//               <div className="w-full bg-gray-100 h-2 mt-4 rounded-full overflow-hidden">
//                 <div 
//                   className="bg-blue-500 h-2 rounded-full" 
//                   style={{ width: `${Math.min((stats?.totalImpressions || 0) / 50, 100)}%` }}
//                 ></div>
//               </div>
//               <p className="text-gray-600 text-sm mt-4">Total Impressions</p>
//             </div>
//           </div>

//           {/* Trending Quizzes Section */}
//           <div className="bg-white rounded-xl shadow-lg p-6 mt-8">
//             <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
//               <div>
//                 <h2 className="text-2xl font-bold text-gray-800">Trending Quizzes</h2>
//                 <p className="text-gray-500 mt-1">Your most popular quizzes based on impressions</p>
//               </div>
//               <span className="text-sm text-white bg-gradient-to-r from-purple-500 to-indigo-600 px-3 py-1 rounded-full mt-2 md:mt-0">
//                 {trendingQuizzes.length} {trendingQuizzes.length === 1 ? 'quiz' : 'quizzes'}
//               </span>
//             </div>

//             {trendingQuizzes.length > 0 ? (
//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                 {trendingQuizzes.map((quiz, index) => (
//                   <div key={index} className="border border-gray-200 rounded-lg p-5 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 group">
//                     <div className="flex justify-between items-start mb-4">
//                       <h3 className="font-semibold text-gray-800 text-lg truncate max-w-[70%] group-hover:text-purple-600 transition-colors">
//                         {quiz.title}
//                       </h3>
//                       <div className="flex items-center bg-blue-50 px-2 py-1 rounded-md group-hover:bg-blue-100 transition-colors">
//                         <span className="text-blue-600 font-medium text-sm mr-1">
//                           {quiz.impressions >= 1000 
//                             ? (quiz.impressions / 1000).toFixed(1) + 'K' 
//                             : quiz.impressions}
//                         </span>
//                         <img src={EmpressionImg} alt="Impressions" className="h-4 w-4" />
//                       </div>
//                     </div>
//                     <div className="text-xs text-gray-500 mt-4 flex items-center">
//                       <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
//                       </svg>
//                       Created on: {formatDate(quiz.createdAt)}
//                     </div>
//                     <div className="mt-4 pt-3 border-t border-gray-100 flex justify-between items-center">
//                       <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
//                         {quiz.type || 'General'}
//                       </span>
//                       <button className="text-xs text-purple-600 font-medium hover:text-purple-800 transition-colors">
//                         View Details →
//                       </button>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             ) : (
//               <div className="flex flex-col items-center justify-center py-12">
//                 <img src={NoDataImg} alt="No quizzes available" className="h-40 mb-4 opacity-80" />
//                 <h3 className="text-xl font-medium text-gray-700 mb-2">No Trending Quizzes Yet</h3>
//                 <p className="text-gray-500 text-center max-w-md">
//                   Create your first quiz to see it appear here. Quizzes with more than 10 impressions will show up in this section.
//                 </p>
//                 <button className="mt-6 bg-gradient-to-r from-purple-500 to-indigo-600 text-white px-6 py-2 rounded-lg shadow-md hover:shadow-lg transition-shadow">
//                   Create Your First Quiz
//                 </button>
//               </div>
//             )}
//           </div>

//           {/* Quick Actions Section */}
//           <div className="bg-white rounded-xl shadow-lg p-6 mt-8">
//             <h2 className="text-2xl font-bold text-gray-800 mb-6">Quick Actions</h2>
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//               <button className="flex items-center justify-center p-4 border border-gray-200 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-all group">
//                 <div className="bg-purple-100 p-2 rounded-full mr-3 group-hover:bg-purple-200 transition-colors">
//                   <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
//                   </svg>
//                 </div>
//                 <span className="font-medium text-gray-700 group-hover:text-purple-600">Create New Quiz</span>
//               </button>
              
//               <button className="flex items-center justify-center p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all group">
//                 <div className="bg-blue-100 p-2 rounded-full mr-3 group-hover:bg-blue-200 transition-colors">
//                   <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
//                   </svg>
//                 </div>
//                 <span className="font-medium text-gray-700 group-hover:text-blue-600">View Analytics</span>
//               </button>
              
//               <button className="flex items-center justify-center p-4 border border-gray-200 rounded-lg hover:border-green-500 hover:bg-green-50 transition-all group">
//                 <div className="bg-green-100 p-2 rounded-full mr-3 group-hover:bg-green-200 transition-colors">
//                   <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
//                   </svg>
//                 </div>
//                 <span className="font-medium text-gray-700 group-hover:text-green-600">Share Progress</span>
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Dashboard;



import React, { useEffect, useState } from 'react';
import { fetchDashboardStats, fetchTrendingQuizzes } from '../../api/quizApi';
import { formatNumber } from '../../utils/formatNumber';
import { RotatingLines } from 'react-loader-spinner';
import NoDataImg from '../../assets/NoNmae.png';
import EmpressionImg from '../../assets/eye.png';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [trendingQuizzes, setTrendingQuizzes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [timeRange, setTimeRange] = useState('week'); // week, month, year

  const fetchData = async () => {
    try {
      const statsData = await fetchDashboardStats();
      setStats(statsData);
      const trendingData = await fetchTrendingQuizzes();
      setTrendingQuizzes(trendingData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Mock data for charts (replace with actual API data)
  const performanceData = [
    { name: 'Mon', quizzes: 4, questions: 20, impressions: 45 },
    { name: 'Tue', quizzes: 2, questions: 15, impressions: 32 },
    { name: 'Wed', quizzes: 6, questions: 25, impressions: 68 },
    { name: 'Thu', quizzes: 3, questions: 18, impressions: 42 },
    { name: 'Fri', quizzes: 5, questions: 22, impressions: 58 },
    { name: 'Sat', quizzes: 1, questions: 10, impressions: 25 },
    { name: 'Sun', quizzes: 2, questions: 12, impressions: 30 },
  ];

  const quizTypeData = [
    { name: 'Multiple Choice', value: 65 },
    { name: 'True/False', value: 20 },
    { name: 'Poll Type', value: 15 },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Calculate additional stats
  const averageImpressions = stats ? Math.round(stats.totalImpressions / stats.totalQuizzes) : 0;
  const engagementRate = stats ? ((stats.totalImpressions / (stats.totalQuizzes * 100)) * 100).toFixed(1) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50 p-4 md:p-8">
      {isLoading ? (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <RotatingLines width="100" strokeColor="#3B82F6" />
            <p className="mt-4 text-gray-600">Loading your dashboard...</p>
          </div>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header Section */}
          <div className="pt-8 pb-4">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-800">Teacher Dashboard</h1>
                <p className="text-gray-600 mt-2">Monitor your quiz performance and student engagement</p>
              </div>
              <div className="flex items-center space-x-4 mt-4 md:mt-0">
                <select 
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="week">Last 7 Days</option>
                  <option value="month">Last 30 Days</option>
                  <option value="year">Last Year</option>
                </select>
                <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
                  Generate Report
                </button>
              </div>
            </div>

            {/* Enhanced Tabs */}
            <div className="flex space-x-1 bg-white p-1 rounded-xl shadow-sm border border-gray-200 w-fit">
              {['overview', 'analytics', 'performance', 'reports'].map((tab) => (
                <button
                  key={tab}
                  className={`px-6 py-3 font-medium text-sm rounded-lg transition-all capitalize ${
                    activeTab === tab
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                  }`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Key Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Total Quizzes */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-orange-500 hover:shadow-xl transition-all duration-300 group">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium">Total Quizzes</p>
                  <h3 className="text-3xl font-bold text-gray-800 mt-2">
                    {stats ? formatNumber(stats.totalQuizzes) : '0'}
                  </h3>
                  <div className="flex items-center mt-2">
                    <span className="text-green-500 text-sm font-medium">+12%</span>
                    <span className="text-gray-500 text-sm ml-2">from last month</span>
                  </div>
                </div>
                <div className="bg-orange-100 p-3 rounded-xl group-hover:scale-110 transition-transform">
                  <svg className="h-8 w-8 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Total Questions */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-green-500 hover:shadow-xl transition-all duration-300 group">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium">Total Questions</p>
                  <h3 className="text-3xl font-bold text-gray-800 mt-2">
                    {stats ? formatNumber(stats.totalQuestions) : '0'}
                  </h3>
                  <div className="flex items-center mt-2">
                    <span className="text-green-500 text-sm font-medium">+8%</span>
                    <span className="text-gray-500 text-sm ml-2">from last month</span>
                  </div>
                </div>
                <div className="bg-green-100 p-3 rounded-xl group-hover:scale-110 transition-transform">
                  <svg className="h-8 w-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Total Impressions */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-blue-500 hover:shadow-xl transition-all duration-300 group">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium">Total Impressions</p>
                  <h3 className="text-3xl font-bold text-gray-800 mt-2">
                    {stats ? formatNumber(stats.totalImpressions) : '0'}
                  </h3>
                  <div className="flex items-center mt-2">
                    <span className="text-green-500 text-sm font-medium">+23%</span>
                    <span className="text-gray-500 text-sm ml-2">from last month</span>
                  </div>
                </div>
                <div className="bg-blue-100 p-3 rounded-xl group-hover:scale-110 transition-transform">
                  <svg className="h-8 w-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Engagement Rate */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-purple-500 hover:shadow-xl transition-all duration-300 group">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium">Engagement Rate</p>
                  <h3 className="text-3xl font-bold text-gray-800 mt-2">
                    {engagementRate}%
                  </h3>
                  <div className="flex items-center mt-2">
                    <span className="text-green-500 text-sm font-medium">+5%</span>
                    <span className="text-gray-500 text-sm ml-2">from last month</span>
                  </div>
                </div>
                <div className="bg-purple-100 p-3 rounded-xl group-hover:scale-110 transition-transform">
                  <svg className="h-8 w-8 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Performance Chart */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-800">Weekly Performance</h3>
                <select className="text-sm border border-gray-300 rounded-lg px-3 py-1">
                  <option>Last 7 days</option>
                  <option>Last 30 days</option>
                </select>
              </div>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="quizzes" name="Quizzes" fill="#F59E0B" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="questions" name="Questions" fill="#10B981" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="impressions" name="Impressions" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Quiz Type Distribution */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-6">Quiz Type Distribution</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={quizTypeData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {quizTypeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value}%`, 'Percentage']} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Trending Quizzes & Quick Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Trending Quizzes */}
            <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-xl font-bold text-gray-800">Trending Quizzes</h3>
                  <p className="text-gray-500 text-sm">Most popular quizzes by impressions</p>
                </div>
                <span className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white px-3 py-1 rounded-full text-sm">
                  {trendingQuizzes.length} trending
                </span>
              </div>

              {trendingQuizzes.length > 0 ? (
                <div className="space-y-4">
                  {trendingQuizzes.map((quiz, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:border-purple-300 hover:shadow-md transition-all group">
                      <div className="flex items-center space-x-4">
                        <div className="bg-indigo-100 text-indigo-600 rounded-lg w-10 h-10 flex items-center justify-center font-bold">
                          {index + 1}
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-800 group-hover:text-indigo-600 transition-colors">
                            {quiz.title}
                          </h4>
                          <p className="text-gray-500 text-sm flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            {formatDate(quiz.createdAt)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <div className="flex items-center bg-blue-50 px-3 py-1 rounded-full">
                            <span className="text-blue-600 font-bold text-sm mr-2">
                              {quiz.impressions >= 1000 
                                ? (quiz.impressions / 1000).toFixed(1) + 'K' 
                                : quiz.impressions}
                            </span>
                            <img src={EmpressionImg} alt="Impressions" className="h-4 w-4" />
                          </div>
                          <span className="text-xs text-gray-500 mt-1">impressions</span>
                        </div>
                        <button className="text-indigo-600 hover:text-indigo-800 transition-colors">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <img src={NoDataImg} alt="No quizzes available" className="h-32 mx-auto mb-4 opacity-70" />
                  <h4 className="text-lg font-medium text-gray-700 mb-2">No Trending Quizzes</h4>
                  <p className="text-gray-500 mb-6">Create engaging quizzes to see them here</p>
                  <button className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white px-6 py-2 rounded-lg shadow-md hover:shadow-lg transition-all">
                    Create New Quiz
                  </button>
                </div>
              )}
            </div>

            {/* Quick Actions & Recent Activity */}
            <div className="space-y-6">
              {/* Quick Actions */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <button className="w-full flex items-center p-4 border border-gray-200 rounded-xl hover:border-indigo-500 hover:bg-indigo-50 transition-all group">
                    <div className="bg-indigo-100 p-2 rounded-lg mr-3 group-hover:bg-indigo-200">
                      <svg className="h-6 w-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    </div>
                    <span className="font-medium text-gray-700 group-hover:text-indigo-600">Create New Quiz</span>
                  </button>
                  
                  <button className="w-full flex items-center p-4 border border-gray-200 rounded-xl hover:border-green-500 hover:bg-green-50 transition-all group">
                    <div className="bg-green-100 p-2 rounded-lg mr-3 group-hover:bg-green-200">
                      <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <span className="font-medium text-gray-700 group-hover:text-green-600">View Analytics</span>
                  </button>
                  
                  <button className="w-full flex items-center p-4 border border-gray-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all group">
                    <div className="bg-blue-100 p-2 rounded-lg mr-3 group-hover:bg-blue-200">
                      <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                      </svg>
                    </div>
                    <span className="font-medium text-gray-700 group-hover:text-blue-600">Share Progress</span>
                  </button>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Recent Activity</h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="bg-green-100 p-2 rounded-full">
                      <svg className="h-4 w-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-800">New quiz created</p>
                      <p className="text-xs text-gray-500">2 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="bg-blue-100 p-2 rounded-full">
                      <svg className="h-4 w-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-800">Quiz shared with class</p>
                      <p className="text-xs text-gray-500">5 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="bg-purple-100 p-2 rounded-full">
                      <svg className="h-4 w-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-800">Performance report generated</p>
                      <p className="text-xs text-gray-500">1 day ago</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;