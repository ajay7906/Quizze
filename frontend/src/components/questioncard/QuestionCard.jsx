// import React from 'react';
// import styles from './QuestionCard.module.css';

// const QuestionCard = ({ question, attempts, correct, incorrect, index }) => {
//   return (
//     <div className={styles.card}>
//       <div className={styles.question}>Q.{index+1} {question}</div>
//       <div className={styles.stats}>
//         <div className={styles.stat}>
//           <p className={styles.number}>{attempts}</p>
//           <p className={styles.label}>people Attempted the question</p>
//         </div>
//         <div className={styles.stat}>
//           <p className={styles.number}>{correct}</p>
//           <p className={styles.label}>people Answered Correctly</p>
//         </div>
//         <div className={styles.stat}>
//           <p className={styles.number}>{incorrect}</p>
//           <p className={styles.label}>people Answered Incorrectly</p>
//         </div>
//       </div>
//       <hr  className={styles.hrLine}/>
//     </div>
//   );
// };

// export default QuestionCard;



import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const QuestionCard = ({ question, attempts, correct, incorrect, index }) => {
  const data = [
    { name: 'Correct', value: correct, color: '#10B981' },
    { name: 'Incorrect', value: incorrect, color: '#EF4444' },
  ];

  const accuracy = attempts > 0 ? ((correct / attempts) * 100).toFixed(1) : 0;

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
        {/* Question and Stats */}
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-800 mb-4 leading-relaxed">
            Q.{index + 1}. {question}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="bg-blue-50 rounded-xl p-4 text-center border border-blue-100">
              <div className="text-2xl font-bold text-blue-600">{attempts}</div>
              <div className="text-sm font-medium text-blue-800 mt-1">Total Attempts</div>
            </div>
            
            <div className="bg-green-50 rounded-xl p-4 text-center border border-green-100">
              <div className="text-2xl font-bold text-green-600">{correct}</div>
              <div className="text-sm font-medium text-green-800 mt-1">Correct Answers</div>
            </div>
            
            <div className="bg-red-50 rounded-xl p-4 text-center border border-red-100">
              <div className="text-2xl font-bold text-red-600">{incorrect}</div>
              <div className="text-sm font-medium text-red-800 mt-1">Incorrect Answers</div>
            </div>
          </div>

          {/* Accuracy Bar */}
          <div className="mt-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">Accuracy Rate</span>
              <span className="text-sm font-bold text-gray-900">{accuracy}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="h-3 rounded-full bg-gradient-to-r from-green-400 to-green-600 transition-all duration-1000 ease-out"
                style={{ width: `${accuracy}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Pie Chart */}
        <div className="lg:w-48 lg:h-48 w-40 h-40 mx-auto lg:mx-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={60}
                paddingAngle={2}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="text-center mt-2">
            <div className="flex justify-center items-center space-x-4 text-xs">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-1"></div>
                <span>Correct</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-red-500 rounded-full mr-1"></div>
                <span>Incorrect</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionCard;