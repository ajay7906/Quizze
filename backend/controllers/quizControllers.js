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

exports.getDashboardData = async (req, res) => {
    try {
        const quizzes = await Quiz.find({ user: req.user._id }).populate('questions');

        const dashboardData = quizzes.map(quiz => ({
            title: quiz.title,
            createdAt: quiz.createdAt,
            impressions: quiz.impressions,
            totalQuestions: quiz.questions.length,
            questions: quiz.questions
        }));

        const totalQuizzes = quizzes.length;
        const totalImpressions = quizzes.reduce((sum, quiz) => sum + quiz.impressions, 0);

        res.json({
            totalQuizzes,
            totalImpressions,
            quizzes: dashboardData,
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
