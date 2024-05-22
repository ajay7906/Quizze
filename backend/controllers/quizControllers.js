const Quiz = require('../models/Quiz');
const Question = require('../models/Question');
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
        if (!title || !type || !questions || !Array.isArray(questions) || questions.length === 0) {
            return res.status(400).json({ message: 'Invalid input data' });
        }

        // Validate questions input
        for (let question of questions) {
            if (!question.question || !question.options || !Array.isArray(question.options) || question.options.length === 0) {
                return res.status(400).json({ message: 'Invalid question data' });
            }
        }

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
                    timer: question.timer
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

exports.getQuizDetails = async (req, res) => {
    try {
        const { userId } = req;
        const quizzes = await Quiz.find()

        // const dashboardData = quizzes.map(quiz => ({
        //     title: quiz.title,
        //     createdAt: quiz.createdAt,
        //     impressions: quiz.impressions,
        //     totalQuestions: quiz.questions.length,
        //     questions: quiz.questions
        // }));

        // const totalQuizzes = quizzes.length;
        // const totalImpressions = quizzes.reduce((sum, quiz) => sum + quiz.impressions, 0);

        res.json({
            // totalQuizzes,
            // totalImpressions,
            // quizzes: dashboardData,
            quizzes
        });
    } catch (error) {
        errorHandler(res, error);
    }
};

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
    // const updatedData = req.body;
    // console.log(quiId);
    // try {
    //     const updatedQuestion = await Question.findByIdAndUpdate(quiId, { $set: updatedData }, { new: true });
    //     if (!updatedQuestion) {
    //         return res.status(404).send({ error: 'Question not found' });
    //     }
    //     res.json(updatedQuestion);
    // } catch (error) {
    //     res.status(500).send({ error: 'Failed to update question' });
    // }

    // const { quiId } = req.params;
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