const Quiz = require('../models/quiz');
const Question = require('../models/question');
const { errorHandler } = require('../utils/errorHandler');

// exports.createQuiz = async (req, res) => {
//     //   try {
//     //     const { title, questions, isPoll } = req.body;
//     const { userId } = req;
//     //     const quiz = new Quiz({ title, user: userId, isPoll });

//     //     const savedQuestions = await Promise.all(questions.map(async (q) => {
//     //       const question = new Question(q);
//     //       await question.save();
//     //       return question._id;
//     //     }));

//     //     quiz.questions = savedQuestions;
//     //     await quiz.save();
//     //     res.status(201).json(quiz);
//     //   } catch (error) {
//     //     errorHandler(res, error);
//     //   }


//     try {
//         const { title, type, questions } = req.body;

//         // Validate the input
//         if (!title || !type || !questions || !Array.isArray(questions) || questions.length === 0) {
//             return res.status(400).json({ message: 'Invalid input data' });
//         }

//         // Validate questions input
//         for (let question of questions) {
//             if (!question.text || !question.options || !Array.isArray(question.options) || !question.correctOption) {
//                 return res.status(400).json({ message: 'Invalid question data' });
//             }
//         }

//         // Create the Quiz document
//         const newQuiz = new Quiz({
//             title,
//             type,
//             questions: [],
//             author: userId // Assuming the user ID is available in the request
//         });

//         const savedQuiz = await newQuiz.save();

//         // Create Question documents
//         const questionDocs = await Promise.all(
//             questions.map(async (question) => {
//                 const newQuestion = new Question({
//                     quiz: savedQuiz._id,
//                     text: question.text,
//                     options: question.options,
//                     correctOption: question.correctOption
//                 });
//                 return await newQuestion.save();
//             })
//         );

//         // Update the Quiz document with the question IDs
//         newQuiz.questions = questionDocs.map(q => q._id);
//         await newQuiz.save();

//         // Populate the author and questions fields in the response
//         const populatedQuiz = await Quiz.findById(newQuiz._id)
//             .populate('author', 'name email')
//             .populate('questions');

//         res.status(201).json(populatedQuiz);
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Server error' });
//     }



// };


exports.createQuiz = async (req, res) => {
    const { userId } = req;

    try {
        const { title, type, questions } = req.body;

        // Validate the input
        if (!title || !type || !questions || !Array.isArray(questions)) {
            return res.status(400).json({ message: 'Invalid input data' });
        }

        // Validate questions input
        // for (let question of questions) {
        //     if (!question.question || !question.options || !Array.isArray(question.options) || question.options.length === 0) {
        //         return res.status(400).json({ message: 'Invalid question data' });
        //     }
        // }

        // Create the Quiz document
        const newQuiz = new Quiz({
            title,
            type,
            questions: [],
            author: userId
        });

        const savedQuiz = await newQuiz.save();

        // Create Question documents
        const questionDocs = await Promise.all(
            questions.map(async (question) => {
                const newQuestion = new Question({
                    quiz: savedQuiz._id,
                    question: question.question,
                    options: question.options,
                    correctOption: question.correctOption,
                    timer: question.timer,
                    optionType: question.optionType,
                    optionsTextAndImg: question.optionsTextAndImg
                });
                return await newQuestion.save();
            })
        );

        // Update the Quiz document with the question IDs
        newQuiz.questions = questionDocs.map(q => q._id);
        await newQuiz.save();

        // Populate the author and questions fields in the response
        const populatedQuiz = await Quiz.findById(newQuiz._id)
            .populate('author', 'name email')
            .populate('questions');

        res.status(201).json(populatedQuiz);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};


//update quiz here 



exports.updateQuiz = async (req, res) => {
    const { userId } = req;
    const { quizId } = req.params;
    const { title, type, questions } = req.body;

    try {
        // Validate the input
        if (!title || !type || !questions || !Array.isArray(questions)) {
            return res.status(400).json({ message: 'Invalid input data' });
        }

        // Validate questions input
        for (let question of questions) {
            if (!question.question || !question.options || !Array.isArray(question.options) || question.options.length === 0) {
                return res.status(400).json({ message: 'Invalid question data' });
            }
        }

        // Find the existing quiz
        const existingQuiz = await Quiz.findById(quizId);
        if (!existingQuiz) {
            return res.status(404).json({ message: 'Quiz not found' });
        }

        // Check if the user is the author of the quiz
        if (existingQuiz.author.toString() !== userId) {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        // Update the quiz details
        existingQuiz.title = title;
        existingQuiz.type = type;

        // Delete existing questions
        await Question.deleteMany({ quiz: quizId });

        // Create new Question documents
        const questionDocs = await Promise.all(
            questions.map(async (question) => {
                const newQuestion = new Question({
                    quiz: quizId,
                    question: question.question,
                    optionType:question.optionType,
                    options: question.options,
                    correctOption: question.correctOption,
                    timer: question.timer
                });
                return await newQuestion.save();
            })
        );

        // Update the Quiz document with the new question IDs
        existingQuiz.questions = questionDocs.map(q => q._id);
        await existingQuiz.save();

        // Populate the author and questions fields in the response
        const populatedQuiz = await Quiz.findById(existingQuiz._id)
            .populate('author', 'name email')
            .populate('questions');

        res.status(200).json(populatedQuiz);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};


// exports.getQuizDetails = async (req, res) => {
//     try {
//         const { userId } = req;
//         const quizzes = await Quiz.find()

        

//         res.json({
            
//             quizzes
//         });
//     } catch (error) {
//         errorHandler(res, error);
//     }
// };


exports.getQuizDetails = async (req, res) => {
    try {
        const { userId } = req;
        const quizzes = await Quiz.find();

        const formattedQuizzes = quizzes.map(quiz => {
            const date = new Date(quiz.createdAt);
            const day = date.getDate().toString().padStart(2, '0');
            const month = date.toLocaleString('default', { month: 'short' });
            const year = date.getFullYear();
            const formattedDate = `${day} ${month}, ${year}`;

            return {
                ...quiz._doc,
                createdAt: formattedDate
            };
        });

        res.json({
            quizzes: formattedQuizzes
        });
    } catch (error) {
        errorHandler(res, error);
    }
};



//get trending quiz

exports.getTrendingQuiz = async (req, res) => {
    try {
        const trendingQuizzes = await Quiz.find({ impressions: { $gt: 10 } }).sort({ impressions: -1 });
        res.json(trendingQuizzes);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

//get dashboard stats
exports.getDashBoardData = async (req,  res)=>{
    try {
        const totalQuizzes = await Quiz.countDocuments();
        const totalQuestions = await Quiz.aggregate([
            { $unwind: '$questions' },
            { $count: 'totalQuestions' }
        ]);
        const totalImpressions = await Quiz.aggregate([
            { $group: { _id: null, totalImpressions: { $sum: '$impressions' } } }
        ]);
    
        res.json({
            totalQuizzes,
            totalQuestions: totalQuestions[0]?.totalQuestions || 0,
            totalImpressions: totalImpressions[0]?.totalImpressions || 0
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }

}




exports.submitQuiz = async (req, res) => {
    try {
        const { answers } = req.body;
        const quiz = await Quiz.findById(req.params.id).populate('questions');

        let score = 0;
        quiz.questions.forEach((question, index) => {
            question.attempts += 1;
            if (question.correctOption === answers[index]) {
                question.correctAttempts += 1;
                score += 1;
            } else {
                question.wrongAttempts += 1;
            }
            question.save();
        });

        res.json({ score });
    } catch (error) {
        errorHandler(res, error);
    }
};

exports.getAnalytics = async (req, res) => {
    try {
        const quizzes = await Quiz.find({ user: req.user._id }).populate('questions');

        const analytics = quizzes.map(quiz => ({
            title: quiz.title,
            impressions: quiz.impressions,
            questions: quiz.questions.map(question => ({
                text: question.text,
                attempts: question.attempts,
                correctAttempts: question.correctAttempts,
                wrongAttempts: question.wrongAttempts
            }))
        }));

        res.json(analytics);
    } catch (error) {
        errorHandler(res, error);
    }
};




//Endpoint to fetch questions by Quiz ID with pagination
exports.getShareQuestion = async (req, res) => {
    const { quizId, } = req.params;
    const { page = 1, limit = 1 } = req.query;
    console.log(quizId);
    if (!quizId) {
        return res.status(400).send({ error: 'Quiz ID is required' });
    }

    try {
        const questions = await Question.find({ quiz: quizId })
            .skip((page - 1) * limit)
            .limit(parseInt(limit));

        res.json(questions);
    } catch (error) {
        res.status(500).send({ error: 'Failed to fetch questions' });
    }
}

exports.getQuestionDetails = async (req, res) => {
    const { quizId, } = req.params;
    // const { page = 1, limit = 1 } = req.query;
    // console.log(quizId);
    if (!quizId) {
        return res.status(400).send({ error: 'Quiz ID is required' });
    }

    try {
        const questions = await Question.find({ quiz: quizId })


        res.json(questions);
    } catch (error) {
        res.status(500).send({ error: 'Failed to fetch questions' });
    }
}


exports.questiRightWrongCheck = async (req, res) => {

    const { quiId } = req.params;
   
    const { isCorrect } = req.body;  // `isCorrect` can be true, false, or null

    try {
        let update;

        if (isCorrect === true) {
            update = { $inc: { correctAttempts: 1 } };
        } else {
            // This covers both isCorrect === false and isCorrect === null
            update = { $inc: { wrongAttempts: 1 } };
        }

        const updatedQuestion = await Question.findByIdAndUpdate(quiId, update, { new: true });

        if (!updatedQuestion) {
            return res.status(404).send({ error: 'Question not found' });
        }
        res.json(updatedQuestion);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send({ error: 'Failed to update question' });
    }
}



// Increment the impression field of a question
exports.incrementImpression = async (req, res) => {
    const { quiId } = req.params;

    try {
        const updatedQuestion = await Quiz.findByIdAndUpdate(
            quiId,
            { $inc: { impressions: 1 } },
            { new: true }
        );

        if (!updatedQuestion) {
            return res.status(404).send({ error: 'Question not found' });
        }

        res.json(updatedQuestion);
    } catch (error) {
        res.status(500).send({ error: 'Failed to update question' });
    }
};


exports.deleteQuiz = async (req, res) => {
    const { quizId } = req.params;

    try {
        const deletedQuiz = await Quiz.findByIdAndDelete(quizId);
        if (!deletedQuiz) {
            return res.status(404).send({ error: 'Quiz not found' });
        }
        res.status(200).send({ message: 'Quiz deleted successfully' });
    } catch (error) {
        res.status(500).send({ error: 'Failed to delete quiz' });
    }

}