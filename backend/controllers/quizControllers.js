const Quiz = require('../models/quiz');
const Question = require('../models/question');


const mongoose = require('mongoose');
const Assignment = require('../models/assignment');

// create new quiz controllers functions
// exports.createQuiz = async (req, res) => {
//     const { userId } = req;

//     try {
//         const { 
//             title, 
//             type, 
//             questions, 
//             description, 
//             subject, 
//             topic, 
//             difficulty, 
//             timeLimit, 
//             passingScore, 
//             isPublic 
//         } = req.body;

//         // Validate the input
//         if (!title || !type || !questions || !Array.isArray(questions)) {
//             return res.status(400).json({ message: 'Invalid input data' });
//         }

//         // Create the Quiz document
//         const newQuiz = new Quiz({
//             title,
//             type,
//             description: description || '',
//             subject: subject || '',
//             topic: topic || '',
//             difficulty: difficulty || 'Intermediate',
//             timeLimit: timeLimit || 30,
//             passingScore: passingScore || 70,
//             isPublic: isPublic || false,
//             questions: [],
//             user: userId
//         });

//         const savedQuiz = await newQuiz.save();

//         // Create Question documents
//         const questionDocs = await Promise.all(
//             questions.map(async (question) => {
//                 const newQuestion = new Question({
//                     quiz: savedQuiz._id,
//                     question: question.question,
//                     questionType: question.questionType || 'Multiple Choice',
//                     optionType: question.optionType || 'text',
//                     options: question.options,
//                     subject: subject || '',
//                     topic: topic || '',
//                     difficulty: difficulty || 'Intermediate',
//                     explanation: question.explanation || '',
//                     timer: question.timer
//                 });
//                 return await newQuestion.save();
//             })
//         );

//         // Update the Quiz document with the question IDs
//         newQuiz.questions = questionDocs.map(q => q._id);
//         await newQuiz.save();

//         // Populate the user and questions fields in the response
//         const populatedQuiz = await Quiz.findById(newQuiz._id)
//             .populate('user', 'name email')
//             .populate('questions');

//         res.status(201).json({
//             success: true,
//             data: populatedQuiz
//         });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ 
//             success: false,
//             message: 'Server error',
//             error: error.message 
//         });
//     }
// };


    

// const Quiz = require('../models/Quiz');
// const Question = require('../models/Question');

exports.createQuiz = async (req, res) => {
    const { userId } = req;

    try {
        const { 
            title, 
            type, 
            questions, 
            description, 
            subject, 
            topic, 
            difficulty, 
            timeLimit, 
            passingScore, 
            isPublic 
        } = req.body;

        // Validate the input
        if (!title || !type || !questions || !Array.isArray(questions)) {
            return res.status(400).json({ message: 'Invalid input data' });
        }

        // Create the Quiz document
        const newQuiz = new Quiz({
            title,
            type,
            description: description || '',
            subject: subject || '',
            topic: topic || '',
            difficulty: difficulty || 'Intermediate',
            timeLimit: timeLimit || 30,
            passingScore: passingScore || 70,
            isPublic: isPublic || false,
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
                    questionType: question.questionType || 'Multiple Choice',
                    optionType: question.optionType || 'text',
                    options: question.options || [],
                    answer: question.answer || '', // For descriptive questions
                    marks: question.marks || 1,
                    subject: subject || '',
                    topic: topic || '',
                    difficulty: difficulty || 'Intermediate',
                    explanation: question.explanation || '',
                    timer: question.timer
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

        res.status(201).json({
            success: true,
            data: populatedQuiz
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ 
            success: false,
            message: 'Server error',
            error: error.message 
        });
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
        const userObjectId = new mongoose.Types.ObjectId(userId);

        // Get proper month ranges
        const currentDate = new Date();
        const currentMonthStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        const lastMonthStart = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
        const lastMonthEnd = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0); // Last day of previous month

        console.log('Date ranges:', {
            lastMonth: { start: lastMonthStart, end: lastMonthEnd },
            currentMonth: { start: currentMonthStart, end: currentDate }
        });

        // Count the total number of quizzes created by the user
        const totalQuizzes = await Quiz.countDocuments({ user: userObjectId });

        // Count total quizzes from last month (properly defined)
        const lastMonthQuizzes = await Quiz.countDocuments({
            user: userObjectId,
            createdAt: { $gte: lastMonthStart, $lte: lastMonthEnd }
        });

        // Count current month quizzes
        const currentMonthQuizzes = await Quiz.countDocuments({
            user: userObjectId,
            createdAt: { $gte: currentMonthStart, $lte: currentDate }
        });

        console.log('Quiz counts:', {
            total: totalQuizzes,
            lastMonth: lastMonthQuizzes,
            currentMonth: currentMonthQuizzes
        });

        // Count the total number of questions in quizzes created by the user
        const totalQuestions = await Quiz.aggregate([
            { $match: { user: userObjectId } },
            { $project: { numOfQuestions: { $size: '$questions' } } },
            { $group: { _id: null, totalQuestions: { $sum: '$numOfQuestions' } } }
        ]);

        // Count last month questions
        const lastMonthQuestions = await Quiz.aggregate([
            { 
                $match: { 
                    user: userObjectId,
                    createdAt: { $gte: lastMonthStart, $lte: lastMonthEnd }
                } 
            },
            { $project: { numOfQuestions: { $size: '$questions' } } },
            { $group: { _id: null, totalQuestions: { $sum: '$numOfQuestions' } } }
        ]);

        // Count current month questions
        const currentMonthQuestions = await Quiz.aggregate([
            { 
                $match: { 
                    user: userObjectId,
                    createdAt: { $gte: currentMonthStart, $lte: currentDate }
                } 
            },
            { $project: { numOfQuestions: { $size: '$questions' } } },
            { $group: { _id: null, totalQuestions: { $sum: '$numOfQuestions' } } }
        ]);

        // Sum the total impressions of quizzes created by the user
        const totalImpressions = await Quiz.aggregate([
            { $match: { user: userObjectId } },
            { $group: { _id: null, totalImpressions: { $sum: '$impressions' } } }
        ]);

        // Sum last month impressions
        const lastMonthImpressions = await Quiz.aggregate([
            { 
                $match: { 
                    user: userObjectId,
                    createdAt: { $gte: lastMonthStart, $lte: lastMonthEnd }
                } 
            },
            { $group: { _id: null, totalImpressions: { $sum: '$impressions' } } }
        ]);

        // Sum current month impressions - THIS WAS MISSING
        const currentMonthImpressions = await Quiz.aggregate([
            { 
                $match: { 
                    user: userObjectId,
                    createdAt: { $gte: currentMonthStart, $lte: currentDate }
                } 
            },
            { $group: { _id: null, totalImpressions: { $sum: '$impressions' } } }
        ]);

        // Handle aggregation results
        const totalQuestionsCount = totalQuestions.length > 0 ? totalQuestions[0].totalQuestions : 0;
        const totalImpressionsCount = totalImpressions.length > 0 ? totalImpressions[0].totalImpressions : 0;
        
        const lastMonthQuestionsCount = lastMonthQuestions.length > 0 ? lastMonthQuestions[0].totalQuestions : 0;
        const lastMonthImpressionsCount = lastMonthImpressions.length > 0 ? lastMonthImpressions[0].totalImpressions : 0;

        const currentMonthQuestionsCount = currentMonthQuestions.length > 0 ? currentMonthQuestions[0].totalQuestions : 0;
        const currentMonthImpressionsCount = currentMonthImpressions.length > 0 ? currentMonthImpressions[0].totalImpressions : 0;

        // Calculate percentage changes using current month vs last month
        const calculatePercentageChange = (current, previous) => {
            if (previous === 0) {
                return current > 0 ? 100 : 0;
            }
            return ((current - previous) / previous) * 100;
        };

        const quizzesPercentageChange = calculatePercentageChange(currentMonthQuizzes, lastMonthQuizzes);
        const questionsPercentageChange = calculatePercentageChange(currentMonthQuestionsCount, lastMonthQuestionsCount);
        const impressionsPercentageChange = calculatePercentageChange(currentMonthImpressionsCount, lastMonthImpressionsCount);

        res.json({
            totalQuizzes,
            totalQuestions: totalQuestionsCount,
            totalImpressions: totalImpressionsCount,
            trends: {
                quizzes: {
                    percentage: Math.abs(quizzesPercentageChange),
                    trend: quizzesPercentageChange >= 0 ? 'increase' : 'decrease',
                    currentMonth: currentMonthQuizzes,
                    lastMonth: lastMonthQuizzes
                },
                questions: {
                    percentage: Math.abs(questionsPercentageChange),
                    trend: questionsPercentageChange >= 0 ? 'increase' : 'decrease',
                    currentMonth: currentMonthQuestionsCount,
                    lastMonth: lastMonthQuestionsCount
                },
                impressions: {
                    percentage: Math.abs(impressionsPercentageChange),
                    trend: impressionsPercentageChange >= 0 ? 'increase' : 'decrease',
                    currentMonth: currentMonthImpressionsCount,
                    lastMonth: lastMonthImpressionsCount
                }
            }
        });
    } catch (error) {
        console.error('Dashboard data error:', error);
        res.status(500).send({ error: 'Failed to get dashboards data' });
    }
};


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

exports.updateQuizStatus = async (req, res) => {
    const { quizId } = req.params;
    const { status } = req.body;
    try {
        const updatedQuiz = await Quiz.findByIdAndUpdate(quizId, { status }, { new: true });
        res.status(200).send({ status: true, message: 'Quiz status updated successfully', data: updatedQuiz });
    } catch (error) {
        res.status(500).send({ status: false, message: 'Failed to update quiz status' });
    }
}


exports.updateAssignmentStatus = async (req, res) => {
    const { assignmentId } = req.params;
    const { status } = req.body;
    
    try{
        const updateAssignment = await Assignment.findByIdAndUpdate(assignmentId, {status}, {new:true});
        if(!updateAssignment){
            return res.status(404).json({success:false,message:'Assignment not found'});
        }
        res.status(200).json({success:true,message:'Assignment status updated successfully',data:updateAssignment});
        

    }catch(error){
        res.status(500).json({success:false,message:'Server error',error:error.message});
    }


}
