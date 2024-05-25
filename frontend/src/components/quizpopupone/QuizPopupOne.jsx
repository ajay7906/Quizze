


// import React, { useState } from 'react';
// import styles from './Quizpopone.module.css';
// import QuizPopupTwo from '../quizpopuptwo/QuizPopupTwo';
// import {  toast } from 'react-toastify';

// const QuizPopupOne = ({ onCancel, onContinue }) => {
//   const [quizName, setQuizName] = useState('');
//   const [quizType, setQuizType] = useState('');

//   const handleContinue = () => {
//     if (quizName === '' || quizType === '') {
//       toast.error('Please add all the fields');
//     } else {
//       onContinue(quizName, quizType);
//     }
//   };


//   return (
//     <>
//       <div className={styles.formContainer}>
//         {/* <h2>Create Quiz</h2> */}
//         <form>
//           <div className={styles.formGroup}>

//             <input
//               type="text" id="quizName" name="quizName" placeholder='Quiz name '


//               value={quizName}
//               onChange={(e) => setQuizName(e.target.value)}
//             />
//           </div>
//           <div className={styles.formGroupType}>
//             <label>Quiz Type</label>
//             <button type="button" className={styles.quizTypeButton} onClick={() => setQuizType('Q&A')}>Q & A</button>
//             <button type="button" className={styles.quizTypeButton} onClick={() => setQuizType('Poll Type')}>Poll Type</button>
//             {/* <div className={styles.quizType}>

//           </div> */}
//           </div>
//           <div className={styles.buttonGroup}>
//             <button type="button" className={styles.cancelButton} onClick={onCancel}>Cancel</button>
//             <button type="button" className={styles.continueButton} onClick={() => { handleContinue(); }}>Continue</button>
//           </div>
//         </form>
//       </div>
//       {/* {secondPopups && <QuizPopupTwo/>} */}
//     </>
//   );
// };

// export default QuizPopupOne;




// import React, { useState } from 'react';
// import styles from './Quizpopone.module.css';
// import QuizPopupTwo from '../quizpopuptwo/QuizPopupTwo';
// import { toast } from 'react-toastify';

// const QuizPopupOne = ({ onCancel, onContinue , quizToEdit }) => {
//   const [quizName, setQuizName] = useState('');
//   const [quizType, setQuizType] = useState('');
//   const [activeButton, setActiveButton] = useState('');

//   const handleContinue = () => {
//     if (quizName === '' || quizType === '') {
//       toast.error('Please add all the fields');
//     } else {
//       onContinue(quizName, quizType);
//     }
//   };

//   const handleQuizTypeClick = (type) => {
//     setQuizType(type);
//     setActiveButton(type);
//   };

//   return (
//     <>
//       <div className={styles.formContainer}>
//         <form>
//           <div className={styles.formGroup}>
//             <input
//               type="text"
//               id="quizName"
//               name="quizName"
//               placeholder="Quiz name"
//               value={quizName}
//               onChange={(e) => setQuizName(e.target.value)}
//             />
//           </div>
//           <div className={styles.formGroupType}>
//             <label>Quiz Type</label>
//             <button
//               type="button"
//               className={`${styles.quizTypeButton} ${activeButton === 'Q&A' ? styles.isActive : ''}`}
//               onClick={() => handleQuizTypeClick('Q&A')}
//             >
//               Q & A
//             </button>
//             <button
//               type="button"
//               className={`${styles.quizTypeButton} ${activeButton === 'Poll Type' ? styles.isActive : ''}`}
//               onClick={() => handleQuizTypeClick('Poll Type')}
//             >
//               Poll Type
//             </button>
//           </div>
//           <div className={styles.buttonGroup}>
//             <button type="button" className={styles.cancelButton} onClick={onCancel}>
//               Cancel
//             </button>
//             <button type="button" className={styles.continueButton} onClick={handleContinue}>
//               Continue
//             </button>
//           </div>
//         </form>
//       </div>
//     </>
//   );
// };

// export default QuizPopupOne;








import React, { useState, useEffect } from 'react';
import styles from './Quizpopone.module.css';
import QuizPopupTwo from '../quizpopuptwo/QuizPopupTwo';
import { toast } from 'react-toastify';

const QuizPopupOne = ({ onCancel, onContinue, quizToEdit }) => {
  const [quizName, setQuizName] = useState('');
  const [quizType, setQuizType] = useState('');
  const [activeButton, setActiveButton] = useState('');

  useEffect(() => {
    if (quizToEdit) {
      setQuizName(quizToEdit.title || '');
      setQuizType(quizToEdit.type || '');
      setActiveButton(quizToEdit.type || '');
    }
  }, [quizToEdit]);

  const handleContinue = () => {
    if (quizName === '' || quizType === '') {
      toast.error('Please add all the fields');
    } else {
      onContinue(quizName, quizType);
    }
  };

  const handleQuizTypeClick = (type) => {
    setQuizType(type);
    setActiveButton(type);
  };

  return (
    <>
      <div className={styles.formContainer}>
        <form>
          <div className={styles.formGroup}>
            <input
              type="text"
              id="quizName"
              name="quizName"
              placeholder="Quiz name"
              value={quizName}
              onChange={(e) => setQuizName(e.target.value)}
            />
          </div>
          <div className={styles.formGroupType}>
            <label>Quiz Type</label>
            <button
              type="button"
              className={`${styles.quizTypeButton} ${activeButton === 'Q&A' ? styles.isActive : ''}`}
              onClick={() => handleQuizTypeClick('Q&A')}
            >
              Q & A
            </button>
            <button
              type="button"
              className={`${styles.quizTypeButton} ${activeButton === 'Poll Type' ? styles.isActive : ''}`}
              onClick={() => handleQuizTypeClick('Poll Type')}
            >
              Poll Type
            </button>
          </div>
          <div className={styles.buttonGroup}>
            <button type="button" className={styles.cancelButton} onClick={onCancel}>
              Cancel
            </button>
            <button type="button" className={styles.continueButton} onClick={handleContinue}>
              Continue
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default QuizPopupOne;
