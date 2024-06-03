



import React, { useState, useEffect } from 'react';
import styles from './quizpopuptwo.module.css';
import DeleteImg from '../../assets/delete.png';
import { ToastContainer, toast } from 'react-toastify';
import { ColorRing } from 'react-loader-spinner';

const QuizPopupTwo = ({ onSubmit, onClose, quizType, quizQuestions, handleUpdateQuiz }) => {

    console.log(quizQuestions);
   // this is initial QuizSlide based on you are creating or updating quiz
    const initialQuizSlides = quizQuestions && quizQuestions.length > 0
        ? quizQuestions
        : [{
            question: '',
            optionType: 'text',
            options: [
                { text: '', imageURL: '', rightans: false },
                { text: '', imageURL: '', rightans: false }
            ],
            optionsTextAndImg: [
                { text: '', imageURL: '', rightans: false },
                { text: '', imageURL: '', rightans: false }
            ],
            timer: 0
        }];
    const [quizSlides, setQuizSlides] = useState(initialQuizSlides
       
    );

    const [currentSlide, setCurrentSlide] = useState(0);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (quizQuestions && quizQuestions.length > 0) {
            setQuizSlides(quizQuestions);
            console.log(quizQuestions);
        }
    }, [quizQuestions]);

    


    useEffect(() => {
        const firstSlideOptionType = quizSlides[0].optionType;
        const newSlides = quizSlides.map((slide, index) => (
            index === 0 ? slide : { ...slide, optionType: firstSlideOptionType }
        ));
        setQuizSlides(newSlides);
    }, [quizSlides[0].optionType]);



    // Add option function

    const addOption = () => {
        const newSlides = [...quizSlides];
        if (quizSlides[currentSlide].optionType === 'textAndImageURL') {
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


    //Remove option function 
    const removeOption = (index) => {
        const newSlides = [...quizSlides];
        if (quizSlides[currentSlide].optionType === 'textAndImageURL') {
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

    // optionType change funtion 
    const handleOptionChange = (optionIndex, value, field) => {
        const newSlides = [...quizSlides];
        if (quizSlides[currentSlide].optionType === 'textAndImageURL') {
            newSlides[currentSlide].optionsTextAndImg[optionIndex][field] = value;
        } else {
            newSlides[currentSlide].options[optionIndex][field] = value;
        }
        setQuizSlides(newSlides);
    };

    //Handle right answer change
    const handleRightAnswerChange = (optionIndex) => {
        const newSlides = [...quizSlides];
        if (quizSlides[currentSlide].optionType === 'textAndImageURL') {
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
  

    //handle Timer changes funtion
    const handleTimerChange = (event) => {
        const value = event.target.value === 'OFF' ? 0 : parseInt(event.target.value);
        const newSlides = [...quizSlides];
        newSlides[currentSlide].timer = value;
        setQuizSlides(newSlides);
    };
  

    // Add new slide function
    const handleAddSlide = () => {
        if (quizSlides.length < 5) {
            setQuizSlides([...quizSlides, {
                question: '',
                optionType: quizSlides[0].optionType,
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


    //Remove slide funtion
    const handleRemoveSlide = (index) => {
        if (quizSlides.length > 1) {
            const newSlides = quizSlides.filter((_, i) => i !== index);
            setQuizSlides(newSlides);
            setCurrentSlide(Math.max(0, currentSlide - 1)); // Switch to the previous slide if current is removed
        }
    };
   
    // change question
    const handleQuestionChange = (value) => {
        const newSlides = [...quizSlides];
        newSlides[currentSlide].question = value;
        setQuizSlides(newSlides);
    };

    const handleOptionTypeChange = (type) => {
        const newSlides = [...quizSlides];
        newSlides[0].optionType = type;
        setQuizSlides(newSlides);
    };
 
    // create quiz function 
    const handleCreateQuiz = async () => {
        for (const slide of quizSlides) {
            if (!slide.question.trim()) {
                toast.error("Please fill out the question.");
                return;
            }
            const optionsToCheck = quizSlides[0].optionType === 'textAndImageURL' ? slide.optionsTextAndImg : slide.options;
            for (const option of optionsToCheck) {
                if (quizSlides[0].optionType === 'text' && !option.text.trim()) {
                    toast.error("Please fill out all text option.");
                    return;
                }
                if (quizSlides[0].optionType === 'imageURL' && !option.imageURL.trim()) {
                    toast.error("Please fill out all option image URL fields.");
                    return;
                }
                if (quizSlides[0].optionType === 'textAndImageURL' && (!option.text.trim() || !option.imageURL.trim())) {
                    toast.error("Please fill out all option text and image URL fields.");
                    return;
                }
            }
            if (quizType === 'Q&A') {
                const hasRightAnswer = optionsToCheck.some(option => option.rightans);
                if (!hasRightAnswer) {
                    toast.error("Please select at least one right answer.");
                    return;
                }
            }
        }

        setIsLoading(true); // Set loading to true when quiz creation starts
        try {
            if (quizQuestions && quizQuestions.length > 0) {
                await handleUpdateQuiz(quizSlides);
            } else {
                await onSubmit(quizSlides);
            }
            setIsLoading(false); // Set loading to false when quiz creation is done
        } catch (error) {
            toast.error("An error occurred while creating the quiz.");
            setIsLoading(false);
        }
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
                            value="text"
                            checked={quizSlides[0].optionType === 'text'}
                            onChange={() => handleOptionTypeChange('text')}
                            disabled={currentSlide !== 0}
                        />
                        Text
                    </label>
                    <label>
                        <input
                            type="radio"
                            name="optionType"
                            value="imageURL"
                            checked={quizSlides[0].optionType === 'imageURL'}
                            onChange={() => handleOptionTypeChange('imageURL')}
                            disabled={currentSlide !== 0}
                        />
                        Image URL
                    </label>
                    <label>
                        <input
                            type="radio"
                            name="optionType"
                            value="textAndImageURL"
                            checked={quizSlides[0].optionType === 'textAndImageURL'}
                            onChange={() => handleOptionTypeChange('textAndImageURL')}
                            disabled={currentSlide !== 0}
                        />
                        Text & Image URL
                    </label>
                </div>

                <div className={`${styles.timerAndInput} ${quizType==='Q&A' ? styles.setMargin : ''} ${quizSlides[0].optionType === 'textAndImageURL' ? styles.fullWidth : ''}`}>
                    <div>
                        {(quizSlides[0].optionType === 'textAndImageURL' ? quizSlides[currentSlide].optionsTextAndImg : quizSlides[currentSlide].options).map((option, index) => (
                            <div key={index} className={`${styles.option} `}>
                                {
                                    quizType === 'Q&A' &&
                                    <label className={`${styles.optionColor}`}>
                                        <input
                                            id="specifyColor"
                                            type="radio"
                                            name={`rightans-${currentSlide}`}
                                            checked={option.rightans}
                                            onChange={() => handleRightAnswerChange(index)}
                                        />
                                    </label>
                                }

                                <div className={`${quizSlides[0].optionType === 'textAndImageURL' ? styles.textAndImagesUrl : styles.selectWidth}`}>
                                    {quizSlides[0].optionType === 'text' ? (
                                        <input
                                            className={`${option.rightans ? styles.isActiveOption : styles.optionInput}`}
                                            type="text"
                                            placeholder="Text"
                                            value={option.text}
                                            onChange={(e) => handleOptionChange(index, e.target.value, 'text')}
                                        />
                                    ) : null}
                                    {quizSlides[0].optionType === 'imageURL' ? (
                                        <input
                                            className={`${option.rightans ? styles.isActiveOption : styles.optionInput}`}
                                            type="text"
                                            placeholder="Image URL"
                                            value={option.imageURL}
                                            onChange={(e) => handleOptionChange(index, e.target.value, 'imageURL')}
                                        />
                                    ) : null}

                                    {quizSlides[0].optionType === 'textAndImageURL' ? (
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
                                    <button className={` ${quizSlides[0].optionType === 'textAndImageURL' ? styles.removeButtonForboth : styles.removeButton}`} onClick={() => removeOption(index)}> <img src={DeleteImg} alt="" /> </button>
                                )}
                            </div>
                        ))}

                        {(quizSlides[0].optionType === 'textAndImageURL' ? quizSlides[currentSlide].optionsTextAndImg : quizSlides[currentSlide].options).length < 4 && (
                            <button className={`${styles.addOptionButton} ${quizType==='Poll Type'? styles.setButton : ''} ${quizSlides[0].optionType === 'textAndImageURL' ? styles.addOptionButtonBoth : ''}`} onClick={addOption}>Add option</button>
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
                            <button className={styles.createButton} onClick={handleCreateQuiz}>
                                {isLoading ? (
                                    <ColorRing
                                        visible={true}
                                        height="25"
                                        width="50"
                                        ariaLabel="color-ring-loading"
                                        wrapperStyle={{}}
                                        wrapperClass="color-ring-wrapper"
                                        colors={['#e15b64', '#f47e60', '#f8b26a', '#abbd81', '#849b87']}
                                    />
                                ) : 'Update Quiz'}
                            </button> :
                            <button className={styles.createButton} onClick={handleCreateQuiz}>
                                {isLoading ? (
                                    <ColorRing
                                        visible={true}
                                        height="25"
                                        width="50"
                                        ariaLabel="color-ring-loading"
                                        wrapperStyle={{}}
                                        wrapperClass="color-ring-wrapper"
                                        colors={['#e15b64', '#f47e60', '#f8b26a', '#abbd81', '#849b87']}
                                    />
                                ) : 'Create Quiz'}
                            </button>
                    }
                </div>
            </div>
            <ToastContainer toastClassName={styles.customToast}/>
        </div>
    );
};

export default QuizPopupTwo;
