









// import React, { useState, useEffect } from 'react';
// import styles from './quizpopuptwo.module.css';
// import DeleteImg from '../../assets/delete.png';
// import { toast } from 'react-toastify';

// const QuizPopupTwo = ({ onSubmit, onClose, quizType, quizQuestions, handleUpdateQuiz }) => {
//     const [quizSlides, setQuizSlides] = useState([{ question: '', optionType: '', options: [{ text: '', imageURL: '', rightans: false }, { text: '', imageURL: '', rightans: false }], timer: 0 }]);
//     const [currentSlide, setCurrentSlide] = useState(0);

//     const [selectedOption, setSelectedOption] = useState(null);
//     const [optionType, setOptionType] = useState('text');
//     console.log(quizSlides[currentSlide].optionType, 'or', optionType);
//     useEffect(() => {
//         if (quizQuestions && quizQuestions.length > 0) {
//             setQuizSlides(quizQuestions);
//         }
//     }, [quizQuestions]);

//     useEffect(() => {
//         if (quizQuestions && quizQuestions.length > 0) {
//             setOptionType(quizSlides[currentSlide].optionType);
//         }
//     }, [currentSlide, quizSlides]);

//     console.log(quizQuestions);

//     const addOption = () => {
//         const newSlides = [...quizSlides];
//         if (newSlides[currentSlide].options.length < 5) {
//             newSlides[currentSlide].options.push({ text: '', imageURL: '', rightans: false });
//             setQuizSlides(newSlides);
//         }
//     };

//     const removeOption = (index) => {
//         const newSlides = [...quizSlides];
//         if (newSlides[currentSlide].options.length > 1) {
//             newSlides[currentSlide].options.splice(index, 1);
//             setQuizSlides(newSlides);
//         }
//     };

//     const handleOptionChange = (optionIndex, value, field) => {
//         const newSlides = [...quizSlides];
//         newSlides[currentSlide].options[optionIndex][field] = value;
//         setQuizSlides(newSlides);
//     };

//     const handleRightAnswerChange = (optionIndex) => {
//         const newSlides = [...quizSlides];
//         newSlides[currentSlide].options.forEach((option, index) => {
//             option.rightans = index === optionIndex;
//         });
//         setQuizSlides(newSlides);
//     };

//     const handleTimerChange = (event) => {
//         const value = event.target.value === 'OFF' ? 0 : parseInt(event.target.value);
//         const newSlides = [...quizSlides];
//         newSlides[currentSlide].timer = value;
//         setQuizSlides(newSlides);
//     };

//     const handleAddSlide = () => {
//         if (quizSlides.length < 5) {
//             setQuizSlides([...quizSlides, { question: '', optionType: '', options: [{ text: '', imageURL: '', rightans: false }, { text: '', imageURL: '', rightans: false }], timer: 0 }]);
//             setCurrentSlide(quizSlides.length); // Switch to the new slide
//         }
//     };

//     const handleRemoveSlide = (index) => {
//         if (quizSlides.length > 1) {
//             const newSlides = quizSlides.filter((_, i) => i !== index);
//             setQuizSlides(newSlides);
//             setCurrentSlide(Math.max(0, currentSlide - 1)); // Switch to the previous slide if current is removed
//         }
//     };

//     const handleQuestionChange = (value) => {
//         const newSlides = [...quizSlides];
//         newSlides[currentSlide].question = value;
//         setQuizSlides(newSlides);
//     };

//     const handleCreateQuiz = () => {
//         for (const slide of quizSlides) {
//             if (!slide.question.trim()) {
//                 toast.error("Please fill out all question fields.");
//                 return;
//             }
//             for (const option of slide.options) {
//                 if (optionType === 'text' && !option.text.trim()) {
//                     toast.error("Please fill out all option text fields.");
//                     return;
//                 }
//                 if (optionType === 'imageURL' && !option.imageURL.trim()) {
//                     toast.error("Please fill out all option image URL fields.");
//                     return;
//                 }
//                 if (optionType === 'textAndImageURL' && (!option.text.trim() || !option.imageURL.trim())) {
//                     toast.error("Please fill out all option text and image URL fields.");
//                     return;
//                 }
//             }
//         }
//         onSubmit(quizSlides);
//     };

//     const getTimerLabel = (value) => {
//         return value === 0 ? 'OFF' : value;
//     };

//     return (
//         <div className={styles.container}>
//             <div className={styles.form}>
//                 <div className={styles.slideButtonContainer}>
//                     <div className={styles.slideButtonList}>
//                         {quizSlides.map((_, index) => (
//                             <div key={index} className={styles.slideButtonWrapper}>
//                                 <div>
//                                     <button
//                                         onClick={() => setCurrentSlide(index)}
//                                         className={`${styles.slideButton} ${currentSlide === index ? styles.active : ''}`}
//                                     >
//                                         {index + 1}
//                                     </button>

//                                     {index >= 1 && (
//                                         <div className={styles.removeSlide} onClick={() => handleRemoveSlide(index)}>✖</div>
//                                     )}
//                                 </div>
//                             </div>
//                         ))}
//                         {quizSlides.length < 5 && (
//                             <button className={styles.addSlideButton} onClick={handleAddSlide}>+</button>
//                         )}
//                     </div>
//                     <p className={styles.maxQuestions}>Max 5 questions</p>
//                 </div>

//                 <input
//                     className={styles.polInput}
//                     type="text"
//                     placeholder="Poll Question"
//                     value={quizSlides[currentSlide].question}
//                     onChange={(e) => handleQuestionChange(e.target.value)}
//                 />

//                 <div className={styles.optionType}>
//                     <h2>Option Type </h2>
//                     <label>
//                         <input
//                             type="radio"
//                             name="optionType"
//                             value="text"
//                             checked={optionType === 'text'}
//                             onChange={() => setOptionType('text')}
//                         />
//                         Text
//                     </label>
//                     <label>
//                         <input
//                             type="radio"
//                             name="optionType"
//                             value="imageURL"
//                             checked={optionType === 'imageURL'}
//                             onChange={() => setOptionType('imageURL')}
//                         />
//                         Image URL
//                     </label>
//                     <label>
//                         <input
//                             type="radio"
//                             name="optionType"
//                             value="textAndImageURL"
//                             checked={optionType === 'textAndImageURL'}
//                             onChange={() => setOptionType('textAndImageURL')}
//                         />
//                         Text & Image URL
//                     </label>
//                 </div>
//                 <div className={`${styles.timerAndInput} ${optionType === 'textAndImageURL' ? styles.fullWidth : ''}`}>
//                     <div>
//                         {quizSlides[currentSlide].options.map((option, index) => (
//                             <div key={index} className={`${styles.option} `}>
//                                 <label className={`${styles.optionColor}`}>
//                                     <input
//                                         id="specifyColor"
//                                         type="radio"
//                                         name={`rightans-${currentSlide}`}
//                                         checked={option.rightans}
//                                         onChange={() => handleRightAnswerChange(index)}
//                                     />
//                                 </label>

//                                 <div className={`${optionType === 'textAndImageURL' ? styles.textAndImagesUrl : styles.selectWidth}`}>
//                                     {optionType === 'text'  ? (
//                                         <input
//                                             className={`${option.rightans ? styles.isActiveOption : styles.optionInput}`}
//                                             type="text"
//                                             placeholder="Text"
//                                             value={option.text}
//                                             onChange={(e) => handleOptionChange(index, e.target.value, 'text')}
//                                         />
//                                     ) : null}
//                                     {optionType === 'imageURL'  ? (
//                                         <input
//                                             className={`${option.rightans ? styles.isActiveOption : styles.optionInput}`}
//                                             type="text"
//                                             placeholder="Image URL"
//                                             value={option.imageURL}
//                                             onChange={(e) => handleOptionChange(index, e.target.value, 'imageURL')}
//                                         />
//                                     ) : null}


//                                     { optionType === 'textAndImageURL' ? (
//                                       <>
//                                         <input
//                                             className={`${option.rightans ? styles.isActiveOption : styles.optionInput}`}
//                                             type="text"
//                                             placeholder="Text"
//                                             value={option.text}
//                                             onChange={(e) => handleOptionChange(index, e.target.value, 'text')}
//                                         />
//                                         <input
//                                             className={`${option.rightans ? styles.isActiveOption : styles.optionInput}`}
//                                             type="text"
//                                             placeholder="ImageUrl"
//                                             value={option.imageURL}
//                                             onChange={(e) => handleOptionChange(index, e.target.value, 'imageURL')}
//                                         />

//                                         </>
//                                     ) : null}



//                                 </div>

//                                 {index >= 2 && (
//                                     <button className={` ${optionType === 'textAndImageURL' ? styles.removeButtonForboth : styles.removeButton}`} onClick={() => removeOption(index)}> <img src={DeleteImg} alt="" /> </button>
//                                 )}
//                             </div>
//                         ))}

//                         {quizSlides[currentSlide].options.length < 4 && (
//                             <button className={`${styles.addOptionButton} ${optionType === 'textAndImageURL' ? styles.addOptionButtonBoth : ''}`} onClick={addOption}>Add option</button>
//                         )}
//                     </div>
//                     {
//                         quizType === 'Poll Type' ? <></>
//                             :
//                             <>
//                                 <div className={styles.timer}>
//                                     <p>Timer</p>
//                                     <label className={` ${quizSlides[currentSlide].timer === 0 ? styles.isTimerActive : styles.labelInput}`}>
//                                         <input type="submit" value="OFF" onClick={handleTimerChange} />
//                                     </label>
//                                     <label className={` ${quizSlides[currentSlide].timer === 5 ? styles.isTimerActive : styles.labelInput}`}>
//                                         <input type="submit" value="5" onClick={handleTimerChange} /> &nbsp; sec
//                                     </label>
//                                     <label className={` ${quizSlides[currentSlide].timer === 10 ? styles.isTimerActive : styles.labelInput}`}>
//                                         <input type="submit" value="10" onClick={handleTimerChange} />&nbsp; sec
//                                     </label>
//                                 </div>
//                             </>
//                     }
//                 </div>
//                 <div className={styles.buttons}>
//                     <button className={styles.cancelButton} onClick={onClose}>Cancel</button>
//                     {
//                         quizQuestions && quizQuestions.length > 0 ?
//                             <> <button className={styles.createButton} onClick={handleUpdateQuiz}>Update Quiz</button></> :
//                             <> <button className={styles.createButton} onClick={handleCreateQuiz}>Create Quiz</button></>
//                     }
//                     <button className={styles.createButton} onClick={handleCreateQuiz}>Create Quiz</button>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default QuizPopupTwo;






















// import React, { useState, useEffect } from 'react';
// import styles from './quizpopuptwo.module.css';
// import DeleteImg from '../../assets/delete.png';
// import { toast } from 'react-toastify';

// const QuizPopupTwo = ({ onSubmit, onClose, quizType, quizQuestions, handleUpdateQuiz }) => {
//     const [quizSlides, setQuizSlides] = useState([{ question: '', optionType: '',
//      options: [{ text: '', imageURL: '', rightans: false }, 
//      { text: '', imageURL: '', rightans: false }], timer: 0 ,
//      optionsTextAndImg: [{ text: '', imageURL: '', rightans: false }, 
//      { text: '', imageURL: '', rightans: false }]

//     }
//     ],



//     );
//     const [currentSlide, setCurrentSlide] = useState(0);

//     const [selectedOption, setSelectedOption] = useState(null);
//     const [optionType, setOptionType] = useState('text');
//     console.log(quizSlides[currentSlide].optionType, 'or', optionType);
//     useEffect(() => {
//         if (quizQuestions && quizQuestions.length > 0) {
//             setQuizSlides(quizQuestions);
//         }
//     }, [quizQuestions]);

//     useEffect(() => {
//         if (quizQuestions && quizQuestions.length > 0) {
//             setOptionType(quizSlides[currentSlide].optionType);
//         }
//     }, [currentSlide, quizSlides]);

//     console.log(quizQuestions);

//     const addOption = () => {
//         const newSlides = [...quizSlides];
//         if (optionType==='textAndImageURL') {
//             if (newSlides[currentSlide].optionsTextAndImg.length < 5) {
//                 newSlides[currentSlide].optionsTextAndImg.push({ text: '', imageURL: '', rightans: false });
//                 setQuizSlides(newSlides);
//             }

//         } else {
//             if (newSlides[currentSlide].options.length < 5) {
//                 newSlides[currentSlide].options.push({ text: '', imageURL: '', rightans: false });
//                 setQuizSlides(newSlides);
//             }

//         }
//     };

//     const removeOption = (index) => {
//         const newSlides = [...quizSlides];
//         if (newSlides[currentSlide].options.length > 1) {
//             newSlides[currentSlide].options.splice(index, 1);
//             setQuizSlides(newSlides);
//         }
//     };

//     const handleOptionChange = (optionIndex, value, field) => {
//         const newSlides = [...quizSlides];
//         newSlides[currentSlide].options[optionIndex][field] = value;
//         setQuizSlides(newSlides);
//     };

//     const handleRightAnswerChange = (optionIndex) => {
//         const newSlides = [...quizSlides];
//         newSlides[currentSlide].options.forEach((option, index) => {
//             option.rightans = index === optionIndex;
//         });
//         setQuizSlides(newSlides);
//     };

//     const handleTimerChange = (event) => {
//         const value = event.target.value === 'OFF' ? 0 : parseInt(event.target.value);
//         const newSlides = [...quizSlides];
//         newSlides[currentSlide].timer = value;
//         setQuizSlides(newSlides);
//     };

//     const handleAddSlide = () => {
//         if (quizSlides.length < 5) {
//             setQuizSlides([...quizSlides, { question: '', optionType: '', options: [{ text: '', imageURL: '', rightans: false }, { text: '', imageURL: '', rightans: false }], timer: 0 }]);
//             setCurrentSlide(quizSlides.length); // Switch to the new slide
//         }
//     };

//     const handleRemoveSlide = (index) => {
//         if (quizSlides.length > 1) {
//             const newSlides = quizSlides.filter((_, i) => i !== index);
//             setQuizSlides(newSlides);
//             setCurrentSlide(Math.max(0, currentSlide - 1)); // Switch to the previous slide if current is removed
//         }
//     };

//     const handleQuestionChange = (value) => {
//         const newSlides = [...quizSlides];
//         newSlides[currentSlide].question = value;
//         setQuizSlides(newSlides);
//     };

//     const handleCreateQuiz = () => {
//         for (const slide of quizSlides) {
//             if (!slide.question.trim()) {
//                 toast.error("Please fill out all question fields.");
//                 return;
//             }
//             for (const option of slide.options) {
//                 if (optionType === 'text' && !option.text.trim()) {
//                     toast.error("Please fill out all option text fields.");
//                     return;
//                 }
//                 if (optionType === 'imageURL' && !option.imageURL.trim()) {
//                     toast.error("Please fill out all option image URL fields.");
//                     return;
//                 }
//                 if (optionType === 'textAndImageURL' && (!option.text.trim() || !option.imageURL.trim())) {
//                     toast.error("Please fill out all option text and image URL fields.");
//                     return;
//                 }
//             }
//         }
//         onSubmit(quizSlides);
//     };

//     const getTimerLabel = (value) => {
//         return value === 0 ? 'OFF' : value;
//     };

//     return (
//         <div className={styles.container}>
//             <div className={styles.form}>
//                 <div className={styles.slideButtonContainer}>
//                     <div className={styles.slideButtonList}>
//                         {quizSlides.map((_, index) => (
//                             <div key={index} className={styles.slideButtonWrapper}>
//                                 <div>
//                                     <button
//                                         onClick={() => setCurrentSlide(index)}
//                                         className={`${styles.slideButton} ${currentSlide === index ? styles.active : ''}`}
//                                     >
//                                         {index + 1}
//                                     </button>

//                                     {index >= 1 && (
//                                         <div className={styles.removeSlide} onClick={() => handleRemoveSlide(index)}>✖</div>
//                                     )}
//                                 </div>
//                             </div>
//                         ))}
//                         {quizSlides.length < 5 && (
//                             <button className={styles.addSlideButton} onClick={handleAddSlide}>+</button>
//                         )}
//                     </div>
//                     <p className={styles.maxQuestions}>Max 5 questions</p>
//                 </div>

//                 <input
//                     className={styles.polInput}
//                     type="text"
//                     placeholder="Poll Question"
//                     value={quizSlides[currentSlide].question}
//                     onChange={(e) => handleQuestionChange(e.target.value)}
//                 />

//                 <div className={styles.optionType}>
//                     <h2>Option Type </h2>
//                     <label>
//                         <input
//                             type="radio"
//                             name="optionType"
//                             value="text"
//                             checked={optionType === 'text'}
//                             onChange={() => setOptionType('text')}
//                         />
//                         Text
//                     </label>
//                     <label>
//                         <input
//                             type="radio"
//                             name="optionType"
//                             value="imageURL"
//                             checked={optionType === 'imageURL'}
//                             onChange={() => setOptionType('imageURL')}
//                         />
//                         Image URL
//                     </label>
//                     <label>
//                         <input
//                             type="radio"
//                             name="optionType"
//                             value="textAndImageURL"
//                             checked={optionType === 'textAndImageURL'}
//                             onChange={() => setOptionType('textAndImageURL')}
//                         />
//                         Text & Image URL
//                     </label>
//                 </div>
//                 <div className={`${styles.timerAndInput} ${optionType === 'textAndImageURL' ? styles.fullWidth : ''}`}>
//                     <div>
//                         {quizSlides[currentSlide].options.map((option, index) => (
//                             <div key={index} className={`${styles.option} `}>
//                                 <label className={`${styles.optionColor}`}>
//                                     <input
//                                         id="specifyColor"
//                                         type="radio"
//                                         name={`rightans-${currentSlide}`}
//                                         checked={option.rightans}
//                                         onChange={() => handleRightAnswerChange(index)}
//                                     />
//                                 </label>

//                                 <div className={`${optionType === 'textAndImageURL' ? styles.textAndImagesUrl : styles.selectWidth}`}>
//                                     {optionType === 'text'  ? (
//                                         <input
//                                             className={`${option.rightans ? styles.isActiveOption : styles.optionInput}`}
//                                             type="text"
//                                             placeholder="Text"
//                                             value={option.text}
//                                             onChange={(e) => handleOptionChange(index, e.target.value, 'text')}
//                                         />
//                                     ) : null}
//                                     {optionType === 'imageURL'  ? (
//                                         <input
//                                             className={`${option.rightans ? styles.isActiveOption : styles.optionInput}`}
//                                             type="text"
//                                             placeholder="Image URL"
//                                             value={option.imageURL}
//                                             onChange={(e) => handleOptionChange(index, e.target.value, 'imageURL')}
//                                         />
//                                     ) : null}


//                                     { optionType === 'textAndImageURL' ? (
//                                       <>
//                                         <input
//                                             className={`${option.rightans ? styles.isActiveOption : styles.optionInput}`}
//                                             type="text"
//                                             placeholder="Text"
//                                             value={option.text}
//                                             onChange={(e) => handleOptionChange(index, e.target.value, 'text')}
//                                         />
//                                         <input
//                                             className={`${option.rightans ? styles.isActiveOption : styles.optionInput}`}
//                                             type="text"
//                                             placeholder="ImageUrl"
//                                             value={option.imageURL}
//                                             onChange={(e) => handleOptionChange(index, e.target.value, 'imageURL')}
//                                         />

//                                         </>
//                                     ) : null}



//                                 </div>

//                                 {index >= 2 && (
//                                     <button className={` ${optionType === 'textAndImageURL' ? styles.removeButtonForboth : styles.removeButton}`} onClick={() => removeOption(index)}> <img src={DeleteImg} alt="" /> </button>
//                                 )}
//                             </div>
//                         ))}

//                         {quizSlides[currentSlide].options.length < 4 && (
//                             <button className={`${styles.addOptionButton} ${optionType === 'textAndImageURL' ? styles.addOptionButtonBoth : ''}`} onClick={addOption}>Add option</button>
//                         )}
//                     </div>
//                     {
//                         quizType === 'Poll Type' ? <></>
//                             :
//                             <>
//                                 <div className={styles.timer}>
//                                     <p>Timer</p>
//                                     <label className={` ${quizSlides[currentSlide].timer === 0 ? styles.isTimerActive : styles.labelInput}`}>
//                                         <input type="submit" value="OFF" onClick={handleTimerChange} />
//                                     </label>
//                                     <label className={` ${quizSlides[currentSlide].timer === 5 ? styles.isTimerActive : styles.labelInput}`}>
//                                         <input type="submit" value="5" onClick={handleTimerChange} /> &nbsp; sec
//                                     </label>
//                                     <label className={` ${quizSlides[currentSlide].timer === 10 ? styles.isTimerActive : styles.labelInput}`}>
//                                         <input type="submit" value="10" onClick={handleTimerChange} />&nbsp; sec
//                                     </label>
//                                 </div>
//                             </>
//                     }
//                 </div>
//                 <div className={styles.buttons}>
//                     <button className={styles.cancelButton} onClick={onClose}>Cancel</button>
//                     {
//                         quizQuestions && quizQuestions.length > 0 ?
//                             <> <button className={styles.createButton} onClick={handleUpdateQuiz}>Update Quiz</button></> :
//                             <> <button className={styles.createButton} onClick={handleCreateQuiz}>Create Quiz</button></>
//                     }
//                     <button className={styles.createButton} onClick={handleCreateQuiz}>Create Quiz</button>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default QuizPopupTwo;












import React, { useState, useEffect } from 'react';
import styles from './quizpopuptwo.module.css';
import DeleteImg from '../../assets/delete.png';
import { toast } from 'react-toastify';

const QuizPopupTwo = ({ onSubmit, onClose, quizType, quizQuestions, handleUpdateQuiz }) => {
    const [optionType, setOptionType] = useState('text');
    const [quizSlides, setQuizSlides] = useState([{
        question: '',
        optionType: optionType,
        options: [
            { text: '', imageURL: '', rightans: false },
            { text: '', imageURL: '', rightans: false }
        ],
        optionsTextAndImg: [
            { text: '', imageURL: '', rightans: false },
            { text: '', imageURL: '', rightans: false }
        ],
        timer: 0
    }]);

    const [currentSlide, setCurrentSlide] = useState(0);
   

    useEffect(() => {
        if (quizQuestions && quizQuestions.length > 0) {
            setQuizSlides(quizQuestions);
        }
    }, [quizQuestions]);

    useEffect(() => {
        if (quizQuestions && quizQuestions.length > 0) {
            setOptionType(quizSlides[currentSlide].optionType);
        }
    }, [currentSlide, quizSlides]);

    const addOption = () => {
        const newSlides = [...quizSlides];
        if (optionType === 'textAndImageURL') {
            if (newSlides[currentSlide].optionsTextAndImg.length < 5) {
                newSlides[currentSlide].optionsTextAndImg.push({ text: '', imageURL: '', rightans: false });
                setQuizSlides(newSlides);
            }
        } else {
            if (newSlides[currentSlide].options.length < 5) {
                newSlides[currentSlide].options.push({ text: '', imageURL: '', rightans: false });
                setQuizSlides(newSlides);
            }
        }
    };

    const removeOption = (index) => {
        const newSlides = [...quizSlides];
        if (optionType === 'textAndImageURL') {
            if (newSlides[currentSlide].optionsTextAndImg.length > 1) {
                newSlides[currentSlide].optionsTextAndImg.splice(index, 1);
                setQuizSlides(newSlides);
            }
        } else {
            if (newSlides[currentSlide].options.length > 1) {
                newSlides[currentSlide].options.splice(index, 1);
                setQuizSlides(newSlides);
            }
        }
    };

    const handleOptionChange = (optionIndex, value, field) => {
        const newSlides = [...quizSlides];
        if (optionType === 'textAndImageURL') {
            newSlides[currentSlide].optionsTextAndImg[optionIndex][field] = value;
        } else {
            newSlides[currentSlide].options[optionIndex][field] = value;
        }
        setQuizSlides(newSlides);
    };

    const handleRightAnswerChange = (optionIndex) => {
        const newSlides = [...quizSlides];
        if (optionType === 'textAndImageURL') {
            newSlides[currentSlide].optionsTextAndImg.forEach((option, index) => {
                option.rightans = index === optionIndex;
            });
        } else {
            newSlides[currentSlide].options.forEach((option, index) => {
                option.rightans = index === optionIndex;
            });
        }
        setQuizSlides(newSlides);
    };

    const handleTimerChange = (event) => {
        const value = event.target.value === 'OFF' ? 0 : parseInt(event.target.value);
        const newSlides = [...quizSlides];
        newSlides[currentSlide].timer = value;
        setQuizSlides(newSlides);
    };
   console.log(optionType==='text');
    const handleAddSlide = () => {
        if (quizSlides.length < 5) {
            setQuizSlides([...quizSlides, {
                question: '',
                optionType: '',
                options: [
                    { text: '', imageURL: '', rightans: false },
                    { text: '', imageURL: '', rightans: false }
                ],
                optionsTextAndImg: [
                    { text: '', imageURL: '', rightans: false },
                    { text: '', imageURL: '', rightans: false }
                ],
                timer: 0
            }]);
            setCurrentSlide(quizSlides.length); // Switch to the new slide
        }
    };

    const handleRemoveSlide = (index) => {
        if (quizSlides.length > 1) {
            const newSlides = quizSlides.filter((_, i) => i !== index);
            setQuizSlides(newSlides);
            setCurrentSlide(Math.max(0, currentSlide - 1)); // Switch to the previous slide if current is removed
        }
    };

    const handleQuestionChange = (value) => {
        const newSlides = [...quizSlides];
        newSlides[currentSlide].question = value;
        setQuizSlides(newSlides);
    };

    const handleOptionTypeChange = (type) => {
        setOptionType(type);
        const newSlides = [...quizSlides];
        newSlides[currentSlide].optionType = type;
        setQuizSlides(newSlides);
    };
    console.log(quizSlides);
    const handleCreateQuiz = () => {
        for (const slide of quizSlides) {
            if (!slide.question.trim()) {
                toast.error("Please fill out all question fields.");
                return;
            }
            const optionsToCheck = optionType === 'textAndImageURL' ? slide.optionsTextAndImg : slide.options;
            for (const option of optionsToCheck) {
                if (optionType === 'text' && !option.text.trim()) {
                    toast.error("Please fill out all option text fields.");
                    return;
                }
                if (optionType === 'imageURL' && !option.imageURL.trim()) {
                    toast.error("Please fill out all option image URL fields.");
                    return;
                }
                if (optionType === 'textAndImageURL' && (!option.text.trim() || !option.imageURL.trim())) {
                    toast.error("Please fill out all option text and image URL fields.");
                    return;
                }
            }
        }
        onSubmit(quizSlides);
        // if (quizQuestions && quizQuestions.length > 0) {
        //     handleUpdateQuiz(quizSlides)
            
        // } else {
        //      onSubmit(quizSlides);
            
        // }
    };

    const getTimerLabel = (value) => {
        return value === 0 ? 'OFF' : value;
    };

    return (
        <div className={styles.container}>
            <div className={styles.form}>
                <div className={styles.slideButtonContainer}>
                    <div className={styles.slideButtonList}>
                        {quizSlides.map((_, index) => (
                            <div key={index} className={styles.slideButtonWrapper}>
                                <div>
                                    <button
                                        onClick={() => setCurrentSlide(index)}
                                        className={`${styles.slideButton} ${currentSlide === index ? styles.active : ''}`}
                                    >
                                        {index + 1}
                                    </button>

                                    {index >= 1 && (
                                        <div className={styles.removeSlide} onClick={() => handleRemoveSlide(index)}>✖</div>
                                    )}
                                </div>
                            </div>
                        ))}
                        {quizSlides.length < 5 && (
                            <button className={styles.addSlideButton} onClick={handleAddSlide}>+</button>
                        )}
                    </div>
                    <p className={styles.maxQuestions}>Max 5 questions</p>
                </div>

                <input
                    className={styles.polInput}
                    type="text"
                    placeholder="Poll Question"
                    value={quizSlides[currentSlide].question}
                    onChange={(e) => handleQuestionChange(e.target.value)}
                />

                <div className={styles.optionType}>
                    <h2>Option Type</h2>
                    <label>
                        <input
                            type="radio"
                            name="optionType"
                            value={quizSlides[currentSlide].optionType}
                            checked={optionType === 'text'}
                            onChange={() => handleOptionTypeChange('text')}
                        />
                        Text
                    </label>
                    <label>
                        <input
                            type="radio"
                            name="optionType"
                            value={quizSlides[currentSlide].optionType}
                            checked={optionType === 'imageURL'}
                            onChange={() => handleOptionTypeChange('imageURL')}
                        />
                        Image URL
                    </label>
                    <label>
                        <input
                            type="radio"
                            name="optionType"
                            value={quizSlides[currentSlide].optionType}
                            checked={optionType === 'textAndImageURL'}
                            onChange={() => handleOptionTypeChange('textAndImageURL')}
                        />
                        Text & Image URL
                    </label>
                </div>
                <div className={`${styles.timerAndInput} ${optionType === 'textAndImageURL' ? styles.fullWidth : ''}`}>
                    <div>
                        {(optionType === 'textAndImageURL' ? quizSlides[currentSlide].optionsTextAndImg : quizSlides[currentSlide].options).map((option, index) => (
                            <div key={index} className={`${styles.option} `}>
                                <label className={`${styles.optionColor}`}>
                                    <input
                                        id="specifyColor"
                                        type="radio"
                                        name={`rightans-${currentSlide}`}
                                        checked={option.rightans}
                                        onChange={() => handleRightAnswerChange(index)}
                                    />
                                </label>

                                <div className={`${optionType === 'textAndImageURL' ? styles.textAndImagesUrl : styles.selectWidth}`}>
                                    {optionType === 'text' ? (
                                        <input
                                            className={`${option.rightans ? styles.isActiveOption : styles.optionInput}`}
                                            type="text"
                                            placeholder="Text"
                                            value={option.text}
                                            onChange={(e) => handleOptionChange(index, e.target.value, 'text')}
                                        />
                                    ) : null}
                                    {optionType === 'imageURL' ? (
                                        <input
                                            className={`${option.rightans ? styles.isActiveOption : styles.optionInput}`}
                                            type="text"
                                            placeholder="Image URL"
                                            value={option.imageURL}
                                            onChange={(e) => handleOptionChange(index, e.target.value, 'imageURL')}
                                        />
                                    ) : null}

                                    {optionType === 'textAndImageURL' ? (
                                        <>
                                            <input
                                                className={`${option.rightans ? styles.isActiveOption : styles.optionInput}`}
                                                type="text"
                                                placeholder="Text"
                                                value={option.text}
                                                onChange={(e) => handleOptionChange(index, e.target.value, 'text')}
                                            />
                                            <input
                                                className={`${option.rightans ? styles.isActiveOption : styles.optionInput}`}
                                                type="text"
                                                placeholder="Image URL"
                                                value={option.imageURL}
                                                onChange={(e) => handleOptionChange(index, e.target.value, 'imageURL')}
                                            />
                                        </>
                                    ) : null}
                                </div>

                                {index >= 2 && (
                                    <button className={` ${optionType === 'textAndImageURL' ? styles.removeButtonForboth : styles.removeButton}`} onClick={() => removeOption(index)}> <img src={DeleteImg} alt="" /> </button>
                                )}
                            </div>
                        ))}

                        {(optionType === 'textAndImageURL' ? quizSlides[currentSlide].optionsTextAndImg : quizSlides[currentSlide].options).length < 4 && (
                            <button className={`${styles.addOptionButton} ${optionType === 'textAndImageURL' ? styles.addOptionButtonBoth : ''}`} onClick={addOption}>Add option</button>
                        )}
                    </div>
                    {
                        quizType === 'Poll Type' ? <></>
                            :
                            <>
                                <div className={styles.timer}>
                                    <p>Timer</p>
                                    <label className={` ${quizSlides[currentSlide].timer === 0 ? styles.isTimerActive : styles.labelInput}`}>
                                        <input type="submit" value="OFF" onClick={handleTimerChange} />
                                    </label>
                                    <label className={` ${quizSlides[currentSlide].timer === 5 ? styles.isTimerActive : styles.labelInput}`}>
                                        <input type="submit" value="5" onClick={handleTimerChange} /> &nbsp; sec
                                    </label>
                                    <label className={` ${quizSlides[currentSlide].timer === 10 ? styles.isTimerActive : styles.labelInput}`}>
                                        <input type="submit" value="10" onClick={handleTimerChange} />&nbsp; sec
                                    </label>
                                </div>
                            </>
                    }
                </div>
                <div className={styles.buttons}>
                    <button className={styles.cancelButton} onClick={onClose}>Cancel</button>
                    {
                        quizQuestions && quizQuestions.length > 0 ?
                            <button className={styles.createButton} onClick={handleCreateQuiz}>Update Quiz</button> :
                            <button className={styles.createButton} onClick={handleCreateQuiz}>Create Quiz</button>
                    }
                </div>
            </div>
        </div>
    );
};

export default QuizPopupTwo;
