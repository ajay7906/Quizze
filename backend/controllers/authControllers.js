const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { errorHandler } = require('../utils/errorHandler');

// exports.register = async (req, res) => {
//   try {
//     const { name, email, password, confirmPassword } = req.body;

//     if (password !== confirmPassword) {
//       return res.status(400).json({ message: 'Passwords do not match' });
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);
//     const user = new User({ name, email, password: hashedPassword });

//     await user.save();
//     const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '60h' });
//     res.json({ token });
//   } catch (error) {
//     errorHandler(res, error);
//   }
// };

// exports.login = async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     const user = await User.findOne({ email });

//     if (!user || !(await bcrypt.compare(password, user.password))) {
//       return res.status(401).json({ message: 'Invalid credentials' });
//     }

//     const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '60h' });
//     res.json({ token });
//   } catch (error) {
//     errorHandler(res, error);
//   }
// };






// const bcrypt = require("bcrypt");
// const jwt = require("jsonwebtoken");

const registerUser = async (req, res) => {
    try {
        const { name, password, email, confirmPassword } = req.body;

      

        if (!name || !password ||!email, !confirmPassword) {
            return res.status(400).json({
                errorMessage: "complete all filled",
                success: false
            });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({ message: 'Passwords do not match' });
          }
        // console.log(req);
        const isExistingUser = await User.findOne({ email: email });
        if (isExistingUser) {
            return res
                .status(409)
                .json({ success: false, errorMessage: "User already exists" });
        }


        const hashedPassword = await bcrypt.hash(password, 10);

        const userData = new User({
            name,
            email,
            password: hashedPassword,

        });
        // const token = jwt.sign(
        //     { userId: userData._id, name: userData.name, email:userData.email },
        //     process.env.SECRET_CODE,
        //     { expiresIn: "60h" }
        // );

        await userData.save();
        res.json({
            success: true,
            message: "User registered successfully",
          //  token: token,
            name: userData.name,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, errorMessage: "Something went wrong!" });
    }
};

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                errorMessage: "Bad Request! Invalid credentials",
            });
        }
        console.log(req);
        const userDetails = await User.findOne({ email });

        if (!userDetails) {
            return res
                .status(401)
                .json({ success: false, errorMessage: "Please enter valid name" });
        }

        const passwordMatch = await bcrypt.compare(
            password,
            userDetails.password
        );

        if (!passwordMatch) {
            return res
                .status(401)
                .json({ success: false, errorMessage: "Please enter valid password" });
        }

        const token = jwt.sign(
            { userId: userDetails._id, email: userDetails.email },
            process.env.SECRET_CODE,
            { expiresIn: "60h" }
        );

        res.json({
            success: true,
            message: "Login Successfully",
            token: token,
            email: userDetails.email,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, errorMessage: "Something went wrong!" });
    }
};

module.exports = { registerUser, loginUser };