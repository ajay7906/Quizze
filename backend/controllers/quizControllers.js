const Quiz = require('../models/quiz');
const Question = require('../models/question');


const mongoose = require('mongoose');

// create new quiz controllers functions
exports.createQuiz = async (req, res) => {
    const { userId } = req;

    try {
        const { title, type, questions } = req.body;

        // Validate the input
        if (!title || !type || !questions || !Array.isArray(questions)) {
            return res.status(400).json({ message: 'Invalid input data' });
        }

     

        // Create the Quiz document
        const newQuiz = new Quiz({
            title,
            type,
            questions: [],
            user: userId
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

        // Populate the user and questions fields in the response
        const populatedQuiz = await Quiz.findById(newQuiz._id)
            .populate('user', 'name email')
            .populate('questions');

        res.status(201).json(populatedQuiz);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};





//update quiz function 
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

        // Check if the user is the user of the quiz
        if (existingQuiz.user.toString() !== userId) {
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

        // Populate the user and questions fields in the response
        const populatedQuiz = await Quiz.findById(existingQuiz._id)
            .populate('user', 'name email')
            .populate('questions');

        res.status(200).json(populatedQuiz);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};



//get quiz details 
exports.getQuizDetails = async (req, res) => {
    try {
        const { userId } = req;
       console.log(userId);
        const quizzes = await Quiz.find({ user: userId });

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
        res.status(500).send({ error: 'Failed to get quizDetailis' });
    }
};



//  get trending function 
exports.getTrendingQuiz = async (req, res) => {
    try {
        const { userId } = req; 

        // Fetch quizzes created by the user with impressions greater than 10
        const trendingQuizzes = await Quiz.find({ user: userId, impressions: { $gt: 5 } }).sort({ impressions: -1 });

        // Format the createdAt date
        const formattedTrendingQuizzes = trendingQuizzes.map(quiz => {
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

        res.json(formattedTrendingQuizzes);
    } catch (error) {
        res.status(500).send({ error: 'Failed to get trending data ' });
    }
};







exports.getDashBoardData = async (req, res) => {
    try {
        const { userId } = req;

        // Ensure userId is an ObjectId if stored as ObjectId in the database
        const userObjectId = new mongoose.Types.ObjectId(userId);

        // Count the total number of quizzes created by the user
        const totalQuizzes = await Quiz.countDocuments({ user: userObjectId });

        // Count the total number of questions in quizzes created by the user
        const totalQuestions = await Quiz.aggregate([
            { $match: { user: userObjectId } },
            { $project: { numOfQuestions: { $size: '$questions' } } },
            { $group: { _id: null, totalQuestions: { $sum: '$numOfQuestions' } } }
        ]);

        // Sum the total impressions of quizzes created by the user
        const totalImpressions = await Quiz.aggregate([
            { $match: { user: userObjectId } },
            { $group: { _id: null, totalImpressions: { $sum: '$impressions' } } }
        ]);

        // Check if aggregation results are empty and handle appropriately
        const totalQuestionsCount = totalQuestions.length > 0 ? totalQuestions[0].totalQuestions : 0;
        const totalImpressionsCount = totalImpressions.length > 0 ? totalImpressions[0].totalImpressions : 0;

        res.json({
            totalQuizzes,
            totalQuestions: totalQuestionsCount,
            totalImpressions: totalImpressionsCount
        });
    } catch (error) {
        // res.status(500).json({ error: err.message });
        res.status(500).send({ error: 'Failed to get dashboards data ' });
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
        res.status(500).send({ error : 'Failed to fetch questions' });
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



//check right and wronng answer
exports.questiRightWrongCheck = async (req, res) => {

    const { quiId } = req.params;
   
    const { updatedData } = req.body;  // `isCorrect` can be true, false, or null
   // console.log(updatedData);
    try {
        let update;

        if (updatedData === true) {
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

//delete quiz
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