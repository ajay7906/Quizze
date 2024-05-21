











// import React, { useState } from 'react';
// import styles from './quizpopuptwo.module.css';

// const QuizPopupTwo = ({ onSubmit, onClose }) => {
//     const [quizSlides, setQuizSlides] = useState([{ question: '', options: [{ text: '', imageURL: '' }], timer: 0 }]);
//     const [currentSlide, setCurrentSlide] = useState(0);
//     const [timer, setTimer] = useState('OFF');
//     const [optionType, setOptionType] = useState('text');

//     const addOption = () => {
//         const newSlides = [...quizSlides];
//         if (newSlides[currentSlide].options.length < 5) {
//             newSlides[currentSlide].options.push({ text: '', imageURL: '' });
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

//     const handleTimerChange = (event) => {
//         setTimer(event.target.value);
//     };

//     const handleAddSlide = () => {
//         if (quizSlides.length < 5) {
//             setQuizSlides([...quizSlides, { question: '', options: [{ text: '', imageURL: '' }], timer: 0 }]);
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
//         onSubmit(quizSlides);
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
//                                         Slide {index + 1}
//                                     </button>
//                                 </div>
//                                 {quizSlides.length > 1 && (
//                                     <div className={styles.removeSlide} onClick={() => handleRemoveSlide(index)}>✖</div>
//                                 )}
//                             </div>
//                         ))}
//                         {quizSlides.length < 5 && (
//                             <button className={styles.addSlideButton} onClick={handleAddSlide}>+</button>
//                         )}
//                     </div>
//                     <p className={styles.maxQuestions}>Max 5 questions</p>
//                 </div>

//                 <input
//                     className={styles.input}
//                     type="text"
//                     placeholder="Poll Question"
//                     value={quizSlides[currentSlide].question}
//                     onChange={(e) => handleQuestionChange(e.target.value)}
//                 />

//                 <div className={styles.optionType}>
//                     <h2>Question Type</h2>
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

//                 {quizSlides[currentSlide].options.map((option, index) => (
//                     <div key={index} className={styles.option}>
//                         {optionType === 'text' || optionType === 'textAndImageURL' ? (
//                             <input
//                                 className={styles.input}
//                                 type="text"
//                                 placeholder="Text"
//                                 value={option.text}
//                                 onChange={(e) => handleOptionChange(index, e.target.value, 'text')}
//                             />
//                         ) : null}
//                         {optionType === 'imageURL' || optionType === 'textAndImageURL' ? (
//                             <input
//                                 className={styles.input}
//                                 type="text"
//                                 placeholder="Image URL"
//                                 value={option.imageURL}
//                                 onChange={(e) => handleOptionChange(index, e.target.value, 'imageURL')}
//                             />
//                         ) : null}
//                         {quizSlides[currentSlide].options.length > 1 && (
//                             <button className={styles.removeButton} onClick={() => removeOption(index)}>✖</button>
//                         )}
//                     </div>
//                 ))}

//                 {quizSlides[currentSlide].options.length < 5 && (
//                     <button className={styles.addOptionButton} onClick={addOption}>Add option</button>
//                 )}

//                 <div className={styles.timer}>
//                     <span>Timer</span>
//                     <label>
//                         <input type="radio" value="OFF" checked={timer === 'OFF'} onChange={handleTimerChange} /> OFF
//                     </label>
//                     <label>
//                         <input type="radio" value="5" checked={timer === '5'} onChange={handleTimerChange} /> 5 sec
//                     </label>
//                     <label>
//                         <input type="radio" value="10" checked={timer === '10'} onChange={handleTimerChange} /> 10 sec
//                     </label>
//                 </div>

//                 <div className={styles.buttons}>
//                     <button className={styles.cancelButton} onClick={onClose}>Cancel</button>
//                     <button className={styles.createButton} onClick={handleCreateQuiz}>Create Quiz</button>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default QuizPopupTwo;



// import React, { useState } from 'react';
// import styles from './quizpopuptwo.module.css';

// const QuizPopupTwo = ({ onSubmit, onClose }) => {
//     const [quizSlides, setQuizSlides] = useState([{ question: '', options: [{ text: '', imageURL: '', rightans: false }], timer: 0 }]);
//     const [currentSlide, setCurrentSlide] = useState(0);
//     const [timer, setTimer] = useState('OFF');
//     const [optionType, setOptionType] = useState('text');

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
//         setTimer(event.target.value);
//     };

//     const handleAddSlide = () => {
//         if (quizSlides.length < 5) {
//             setQuizSlides([...quizSlides, { question: '', options: [{ text: '', imageURL: '', rightans: false }], timer: 0 }]);
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
//         onSubmit(quizSlides);
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
//                                         Slide {index + 1}
//                                     </button>
//                                 </div>
//                                 {quizSlides.length > 1 && (
//                                     <div className={styles.removeSlide} onClick={() => handleRemoveSlide(index)}>✖</div>
//                                 )}
//                             </div>
//                         ))}
//                         {quizSlides.length < 5 && (
//                             <button className={styles.addSlideButton} onClick={handleAddSlide}>+</button>
//                         )}
//                     </div>
//                     <p className={styles.maxQuestions}>Max 5 questions</p>
//                 </div>

//                 <input
//                     className={styles.input}
//                     type="text"
//                     placeholder="Poll Question"
//                     value={quizSlides[currentSlide].question}
//                     onChange={(e) => handleQuestionChange(e.target.value)}
//                 />

//                 <div className={styles.optionType}>
//                     <h2>Question Type</h2>
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

//                 {quizSlides[currentSlide].options.map((option, index) => (
//                     <div key={index} className={styles.option}>
//                         {optionType === 'text' || optionType === 'textAndImageURL' ? (
//                             <input
//                                 className={styles.input}
//                                 type="text"
//                                 placeholder="Text"
//                                 value={option.text}
//                                 onChange={(e) => handleOptionChange(index, e.target.value, 'text')}
//                             />
//                         ) : null}
//                         {optionType === 'imageURL' || optionType === 'textAndImageURL' ? (
//                             <input
//                                 className={styles.input}
//                                 type="text"
//                                 placeholder="Image URL"
//                                 value={option.imageURL}
//                                 onChange={(e) => handleOptionChange(index, e.target.value, 'imageURL')}
//                             />
//                         ) : null}
//                         <label>
//                             <input
//                                 type="radio"
//                                 name={`rightans-${currentSlide}`}
//                                 checked={option.rightans}
//                                 onChange={() => handleRightAnswerChange(index)}
//                             />
//                             Correct Answer
//                         </label>
//                         {quizSlides[currentSlide].options.length > 1 && (
//                             <button className={styles.removeButton} onClick={() => removeOption(index)}>✖</button>
//                         )}
//                     </div>
//                 ))}

//                 {quizSlides[currentSlide].options.length < 5 && (
//                     <button className={styles.addOptionButton} onClick={addOption}>Add option</button>
//                 )}

//                 <div className={styles.timer}>
//                     <span>Timer</span>
//                     <label>
//                         <input type="radio" value="OFF" checked={timer === 'OFF'} onChange={handleTimerChange} /> OFF
//                     </label>
//                     <label>
//                         <input type="radio" value="5" checked={timer === '5'} onChange={handleTimerChange} /> 5 sec
//                     </label>
//                     <label>
//                         <input type="radio" value="10" checked={timer === '10'} onChange={handleTimerChange} /> 10 sec
//                     </label>
//                 </div>

//                 <div className={styles.buttons}>
//                     <button className={styles.cancelButton} onClick={onClose}>Cancel</button>
//                     <button className={styles.createButton} onClick={handleCreateQuiz}>Create Quiz</button>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default QuizPopupTwo;









import React, { useState } from 'react';
import styles from './quizpopuptwo.module.css';

const QuizPopupTwo = ({ onSubmit, onClose }) => {
    const [quizSlides, setQuizSlides] = useState([{ question: '', options: [{ text: '', imageURL: '', rightans: false }], timer: 0 }]);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [timer, setTimer] = useState('OFF');
    const [optionType, setOptionType] = useState('text');

    const addOption = () => {
        const newSlides = [...quizSlides];
        if (newSlides[currentSlide].options.length < 5) {
            newSlides[currentSlide].options.push({ text: '', imageURL: '', rightans: false });
            setQuizSlides(newSlides);
        }
    };

    const removeOption = (index) => {
        const newSlides = [...quizSlides];
        if (newSlides[currentSlide].options.length > 1) {
            newSlides[currentSlide].options.splice(index, 1);
            setQuizSlides(newSlides);
        }
    };

    const handleOptionChange = (optionIndex, value, field) => {
        const newSlides = [...quizSlides];
        newSlides[currentSlide].options[optionIndex][field] = value;
        setQuizSlides(newSlides);
    };

    const handleRightAnswerChange = (optionIndex) => {
        const newSlides = [...quizSlides];
        newSlides[currentSlide].options.forEach((option, index) => {
            option.rightans = index === optionIndex;
        });
        setQuizSlides(newSlides);
    };

    const handleTimerChange = (event) => {
        const value = event.target.value;
        setTimer(value);
        const newSlides = quizSlides.map(slide => ({ ...slide, timer: value === 'OFF' ? 0 : parseInt(value) }));
        setQuizSlides(newSlides);
    };

    const handleAddSlide = () => {
        if (quizSlides.length < 5) {
            setQuizSlides([...quizSlides, { question: '', options: [{ text: '', imageURL: '', rightans: false }], timer: timer === 'OFF' ? 0 : parseInt(timer) }]);
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

    const handleCreateQuiz = () => {
        onSubmit(quizSlides);
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
                                        Slide {index + 1}
                                    </button>
                                </div>
                                {quizSlides.length > 1 && (
                                    <div className={styles.removeSlide} onClick={() => handleRemoveSlide(index)}>✖</div>
                                )}
                            </div>
                        ))}
                        {quizSlides.length < 5 && (
                            <button className={styles.addSlideButton} onClick={handleAddSlide}>+</button>
                        )}
                    </div>
                    <p className={styles.maxQuestions}>Max 5 questions</p>
                </div>

                <input
                    className={styles.input}
                    type="text"
                    placeholder="Poll Question"
                    value={quizSlides[currentSlide].question}
                    onChange={(e) => handleQuestionChange(e.target.value)}
                />

                <div className={styles.optionType}>
                    <h2>Question Type</h2>
                    <label>
                        <input
                            type="radio"
                            name="optionType"
                            value="text"
                            checked={optionType === 'text'}
                            onChange={() => setOptionType('text')}
                        />
                        Text
                    </label>
                    <label>
                        <input
                            type="radio"
                            name="optionType"
                            value="imageURL"
                            checked={optionType === 'imageURL'}
                            onChange={() => setOptionType('imageURL')}
                        />
                        Image URL
                    </label>
                    <label>
                        <input
                            type="radio"
                            name="optionType"
                            value="textAndImageURL"
                            checked={optionType === 'textAndImageURL'}
                            onChange={() => setOptionType('textAndImageURL')}
                        />
                        Text & Image URL
                    </label>
                </div>

                {quizSlides[currentSlide].options.map((option, index) => (
                    <div key={index} className={styles.option}>
                        {optionType === 'text' || optionType === 'textAndImageURL' ? (
                            <input
                                className={styles.input}
                                type="text"
                                placeholder="Text"
                                value={option.text}
                                onChange={(e) => handleOptionChange(index, e.target.value, 'text')}
                            />
                        ) : null}
                        {optionType === 'imageURL' || optionType === 'textAndImageURL' ? (
                            <input
                                className={styles.input}
                                type="text"
                                placeholder="Image URL"
                                value={option.imageURL}
                                onChange={(e) => handleOptionChange(index, e.target.value, 'imageURL')}
                            />
                        ) : null}
                        <label>
                            <input
                                type="radio"
                                name={`rightans-${currentSlide}`}
                                checked={option.rightans}
                                onChange={() => handleRightAnswerChange(index)}
                            />
                            Correct Answer
                        </label>
                        {quizSlides[currentSlide].options.length > 1 && (
                            <button className={styles.removeButton} onClick={() => removeOption(index)}>✖</button>
                        )}
                    </div>
                ))}

                {quizSlides[currentSlide].options.length < 5 && (
                    <button className={styles.addOptionButton} onClick={addOption}>Add option</button>
                )}

                <div className={styles.timer}>
                    <span>Timer</span>
                    <label>
                        <input type="radio" value="OFF" checked={timer === 'OFF'} onChange={handleTimerChange} /> OFF
                    </label>
                    <label>
                        <input type="radio" value="5" checked={timer === '5'} onChange={handleTimerChange} /> 5 sec
                    </label>
                    <label>
                        <input type="radio" value="10" checked={timer === '10'} onChange={handleTimerChange} /> 10 sec
                    </label>
                </div>

                <div className={styles.buttons}>
                    <button className={styles.cancelButton} onClick={onClose}>Cancel</button>
                    <button className={styles.createButton} onClick={handleCreateQuiz}>Create Quiz</button>
                </div>
            </div>
        </div>
    );
};

export default QuizPopupTwo;
