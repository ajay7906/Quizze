// import React, { useState } from 'react';
// import styles from './Quizpopone.module.css';

// const QuizPopupOne = ({ onContinue }) => {
//   const [quizName, setQuizName] = useState('');
//   const [quizType, setQuizType] = useState('Q&A');

//   return (
//     <div className={styles.popup}>
//       <div className={styles.popupContent}>
//         <h2>Quiz Analysis</h2>
//         <div className={styles.formGroup}>
//           <label>Quiz name</label>
//           <input
//             type="text"
//             value={quizName}
//             onChange={(e) => setQuizName(e.target.value)}
//           />
//         </div>
//         <div className={styles.formGroup}>
//           <label>Quiz Type</label>
//           <div>
//             <input
//               type="radio"
//               id="qa"
//               name="quizType"
//               value="Q&A"
//               checked={quizType === 'Q&A'}
//               onChange={(e) => setQuizType(e.target.value)}
//             />
//             <label htmlFor="qa">Q & A</label>
//             <input
//               type="radio"
//               id="poll"
//               name="quizType"
//               value="Poll"
//               checked={quizType === 'Poll'}
//               onChange={(e) => setQuizType(e.target.value)}
//             />
//             <label htmlFor="poll">Poll Type</label>
//           </div>
//         </div>
//         <button className={styles.continueButton} onClick={onContinue}>
//           Continue
//         </button>
//       </div>
//     </div>
//   );
// };

// export default QuizPopupOne;


import React, { useState } from 'react';
import styles from './Quizpopone.module.css';
import QuizPopupTwo from '../quizpopuptwo/QuizPopupTwo';

const QuizPopupOne = ({ onCancel, onContinue }) => {
  const [quizName, setQuizName] = useState('');
  const [quizType, setQuizType] = useState('');


  const handleContinue = () => {
    onContinue(quizName, quizType);
  };


  return (
    <>
    <div className={styles.formContainer}>
      <h2>Create Quiz</h2>
      <form>
        <div className={styles.formGroup}>
          <label htmlFor="quizName">Quiz Name</label>
          <input 
           type="text" id="quizName" name="quizName" 
         
          
           value={quizName}
           onChange={(e) => setQuizName(e.target.value)}
           />
        </div>
        <div className={styles.formGroup}>
          <label>Quiz Type</label>
          <div className={styles.quizType}>
            <button type="button" className={styles.quizTypeButton}  onClick={() => setQuizType('Q&A')}>Q & A</button>
            <button type="button" className={styles.quizTypeButton} onClick={() => setQuizType('Poll Type')}>Poll Type</button>
          </div>
        </div>
        <div className={styles.buttonGroup}>
          <button type="button" className={styles.cancelButton} onClick={onCancel}>Cancel</button>
          <button type="button" className={styles.continueButton} onClick={()=>{handleContinue(); }}>Continue</button>
        </div>
      </form>
    </div>
    {/* {secondPopups && <QuizPopupTwo/>} */}
    </>
  );
};

export default QuizPopupOne;
