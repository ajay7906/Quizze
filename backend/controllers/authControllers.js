



const Teacher = require('../models/teachers');
const Student = require('../models/students');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
// const { errorHandler } = require('../utils/errorHandler');

// Register controller - Only for teachers
const registerUser = async (req, res) => {
    try {
        const { name, password, email, confirmPassword } = req.body;

        if (!name || !password || !email || !confirmPassword) {
            return res.status(400).json({
                errorMessage: "Complete all fields",
                success: false
            });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({success: false, errorMessage: 'Passwords do not match' });
        }

        const isExistingTeacher = await Teacher.findOne({ email: email });
        if (isExistingTeacher) {
            return res
                .status(409)
                .json({ success: false, errorMessage: "Teacher already exists" });
        }

        const teacherData = new Teacher({
            name,
            email,
            password
        });

        await teacherData.save();
        res.json({
            success: true,
            message: "Teacher registered successfully",
            name: teacherData.name,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, errorMessage: "Something went wrong!" });
    }
};

// Login controller for both teachers and students
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                errorMessage: "Invalid credentials",
            });
        }
      
        // Check if it's a teacher
        let userDetails = await Teacher.findOne({ email });
        let role = 'teacher';
        
        // If not a teacher, check if it's a student
        if (!userDetails) {
            userDetails = await Student.findOne({ email });
            role = 'student';
        }

        if (!userDetails) {
            return res
                .status(401)
                .json({ success: false, errorMessage: "User does not exist" });
        }

        console.log(userDetails);

        const passwordMatch = await bcrypt.compare(password, userDetails.password);

        if (!passwordMatch) {
            return res
                .status(401)
                .json({ success: false, errorMessage: "Invalid email or password" });
        }

        const token = jwt.sign(
            { 
                userId: userDetails._id, 
                email: userDetails.email, 
                role: role,
                // For students, include teacher ID
                ...(role === 'student' && { teacherId: userDetails.teacher })
            },
            process.env.SECRET_CODE,
            { expiresIn: "20d" }
        );

        res.json({
            success: true,
            message: "Login Successful",
            token: token,
            email: userDetails.email,
            role: role,
            userId: userDetails._id
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, errorMessage: "Something went wrong!" });
    }
};

// Add student controller (for teachers)
const addStudent = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const teacherId = req.user.userId; // From JWT token

        if (!name || !email || !password) {
            return res.status(400).json({
                errorMessage: "Complete all fields",
                success: false
            });
        }

        // Check if student already exists
        const isExistingStudent = await Student.findOne({ email });
        if (isExistingStudent) {
            return res
                .status(409)
                .json({ success: false, errorMessage: "Student already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const studentData = new Student({
            name,
            email,
            password: hashedPassword,
            teacher: teacherId
        });

        await studentData.save();
        
        // Add student to teacher's students array
        await Teacher.findByIdAndUpdate(
            teacherId,
            { $push: { students: studentData._id } }
        );

        res.json({
            success: true,
            message: "Student added successfully",
            studentId: studentData._id,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, errorMessage: "Something went wrong!" });
    }
};

module.exports = { registerUser, loginUser, addStudent };