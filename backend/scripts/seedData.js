const mongoose = require('mongoose');
const Subject = require('../models/subject');
require('dotenv').config();

const subjects = [
  {
    name: "Mathematics",
    code: "MATH",
    description: "Fundamental mathematical concepts and problem-solving",
    grade: "All Grades",
    topics: [
      {
        name: "Algebra",
        description: "Basic algebraic concepts and equations",
        difficulty: "Beginner"
      },
      {
        name: "Geometry",
        description: "Shapes, angles, and spatial relationships",
        difficulty: "Beginner"
      },
      {
        name: "Calculus",
        description: "Limits, derivatives, and integrals",
        difficulty: "Advanced"
      },
      {
        name: "Statistics",
        description: "Data analysis and probability",
        difficulty: "Intermediate"
      }
    ]
  },
  {
    name: "Science",
    code: "SCI",
    description: "Natural sciences and scientific inquiry",
    grade: "All Grades",
    topics: [
      {
        name: "Physics",
        description: "Matter, energy, and their interactions",
        difficulty: "Intermediate"
      },
      {
        name: "Chemistry",
        description: "Properties and changes of matter",
        difficulty: "Intermediate"
      },
      {
        name: "Biology",
        description: "Living organisms and life processes",
        difficulty: "Beginner"
      },
      {
        name: "Earth Science",
        description: "Earth's structure and processes",
        difficulty: "Beginner"
      }
    ]
  },
  {
    name: "English",
    code: "ENG",
    description: "Language arts, literature, and communication",
    grade: "All Grades",
    topics: [
      {
        name: "Grammar",
        description: "Language structure and rules",
        difficulty: "Beginner"
      },
      {
        name: "Literature",
        description: "Reading comprehension and analysis",
        difficulty: "Intermediate"
      },
      {
        name: "Writing",
        description: "Essay writing and composition",
        difficulty: "Intermediate"
      },
      {
        name: "Vocabulary",
        description: "Word meanings and usage",
        difficulty: "Beginner"
      }
    ]
  },
  {
    name: "History",
    code: "HIST",
    description: "Historical events and their significance",
    grade: "All Grades",
    topics: [
      {
        name: "World History",
        description: "Global historical events and civilizations",
        difficulty: "Intermediate"
      },
      {
        name: "Indian History",
        description: "United States history and development",
        difficulty: "Beginner"
      },
      {
        name: "Ancient Civilizations",
        description: "Early human societies and cultures",
        difficulty: "Beginner"
      },
      {
        name: "Modern History",
        description: "Recent historical developments",
        difficulty: "Intermediate"
      }
    ]
  },
  {
    name: "Computer Science",
    code: "CS",
    description: "Programming, algorithms, and technology",
    grade: "All Grades",
    topics: [
      {
        name: "Programming Basics",
        description: "Introduction to coding concepts",
        difficulty: "Beginner"
      },
      {
        name: "Data Structures",
        description: "Organizing and storing data",
        difficulty: "Intermediate"
      },
      {
        name: "Algorithms",
        description: "Problem-solving strategies",
        difficulty: "Advanced"
      },
      {
        name: "Web Development",
        description: "Building websites and applications",
        difficulty: "Intermediate"
      }
    ]
  }
];

const seedSubjects = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URL || 'mongodb+srv://anujsaini75072:anujsaini75072@cluster0.g5exdn6.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0');
    console.log('Connected to MongoDB');

    // Clear existing subjects
    await Subject.deleteMany({});
    console.log('Cleared existing subjects');

    // Insert new subjects
    const insertedSubjects = await Subject.insertMany(subjects);
    console.log(`Inserted ${insertedSubjects.length} subjects`);

    // Display inserted subjects
    insertedSubjects.forEach(subject => {
      console.log(`- ${subject.name} (${subject.code}): ${subject.topics.length} topics`);
    });

    console.log('Database seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};

// Run the seed function
seedSubjects();
