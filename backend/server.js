const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const quizRoutes = require('./routes/quizRoutes')
const cors = require('cors')
//const quizRoutes = require('./routes/quizRoutes');

dotenv.config()
connectDB();

const app = express();
app.use(cors())

// app.use(express.json());
// app.use(express.json());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

app.use('/api/v1/user', authRoutes);
app.use('/api/v1/quiz', quizRoutes);
//app.use('/api/quizzes', quizRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
