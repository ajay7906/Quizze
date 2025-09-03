const axios = require('axios');

class AIService {
  constructor() {
    // Use the Gemini API key and base URL
    this.apiKey = 'AIzaSyAbUaw6aKygcv913MVpXZ01zK-Vnd58Tvo';
    this.baseURL = 'https://generativelanguage.googleapis.com/v1beta';
  }

  // Generate questions based on subject, topic, and difficulty
  async generateQuestions(subject, topic, difficulty, count = 5) {
    try {
      const prompt = `Generate ${count} ${difficulty} level questions for ${subject} - ${topic}. 
      Each question should have:
      - A clear question text
      - 4 multiple choice options (only one correct)
      - An explanation for the correct answer
      - Appropriate difficulty for ${difficulty} level
      
      Format as JSON:
      {
        "questions": [
          {
            "question": "question text",
            "options": ["option1", "option2", "option3", "option4"],
            "correctAnswer": 0,
            "explanation": "explanation text",
            "difficulty": "${difficulty}"
          }
        ]
      }`;

      const response = await axios.post(
        `${this.baseURL}/models/gemini-pro:generateContent?key=${this.apiKey}`,
        {
          contents: [
            {
              parts: [
                {
                  text: "You are an expert educational content creator. Generate high-quality, accurate questions in the exact JSON format requested. Do not include any additional text or explanations outside the JSON structure."
                }
              ]
            },
            {
              parts: [
                {
                  text: prompt
                }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 2000,
          }
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('Gemini Response:', response.data);

      if (!response.data.candidates || !response.data.candidates[0] || !response.data.candidates[0].content) {
        throw new Error('Invalid response format from Gemini API');
      }

      const content = response.data.candidates[0].content.parts[0].text;
      
      // Try to extract JSON from the response
      let jsonContent;
      try {
        // Look for JSON content in the response
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          jsonContent = JSON.parse(jsonMatch[0]);
        } else {
          jsonContent = JSON.parse(content);
        }
      } catch (parseError) {
        console.error('Failed to parse JSON response:', parseError);
        console.log('Raw content:', content);
        // Fallback to template questions
        return this.generateFallbackQuestions(subject, topic, difficulty, count);
      }

      // Validate the response structure
      if (!jsonContent.questions || !Array.isArray(jsonContent.questions)) {
        console.error('Invalid response structure from Gemini');
        return this.generateFallbackQuestions(subject, topic, difficulty, count);
      }

      return jsonContent;
    } catch (error) {
      console.error('AI Question Generation Error:', error.response ? error.response.data : error.message);
      // Fallback to template questions
      return this.generateFallbackQuestions(subject, topic, difficulty, count);
    }
  }

  // Fallback questions when AI service is unavailable
  generateFallbackQuestions(subject, topic, difficulty, count) {
    console.log(`Using fallback questions for ${subject} - ${topic}`);
    
    const fallbackQuestions = {
      "Mathematics": {
        "Algebra": [
          {
            question: "What is the value of x in the equation 2x + 5 = 13?",
            options: ["3", "4", "5", "6"],
            correctAnswer: 1,
            explanation: "Subtract 5 from both sides: 2x = 8, then divide by 2: x = 4",
            difficulty: difficulty
          },
          {
            question: "Solve for y: 3y - 7 = 8",
            options: ["3", "5", "7", "9"],
            correctAnswer: 1,
            explanation: "Add 7 to both sides: 3y = 15, then divide by 3: y = 5",
            difficulty: difficulty
          }
        ],
        "Geometry": [
          {
            question: "What is the area of a circle with radius 5 units?",
            options: ["25π", "50π", "75π", "100π"],
            correctAnswer: 0,
            explanation: "Area = πr² = π(5)² = 25π",
            difficulty: difficulty
          },
          {
            question: "What is the perimeter of a square with side length 6 units?",
            options: ["12 units", "18 units", "24 units", "36 units"],
            correctAnswer: 2,
            explanation: "Perimeter = 4 × side length = 4 × 6 = 24 units",
            difficulty: difficulty
          }
        ]
      },
      "Science": {
        "Physics": [
          {
            question: "What is the SI unit of force?",
            options: ["Joule", "Watt", "Newton", "Pascal"],
            correctAnswer: 2,
            explanation: "Force is measured in Newtons (N) in the SI system",
            difficulty: difficulty
          },
          {
            question: "What is the formula for kinetic energy?",
            options: ["KE = mgh", "KE = ½mv²", "KE = mv", "KE = Fd"],
            correctAnswer: 1,
            explanation: "Kinetic energy = ½ × mass × velocity²",
            difficulty: difficulty
          }
        ],
        "Chemistry": [
          {
            question: "What is the chemical symbol for gold?",
            options: ["Ag", "Au", "Fe", "Cu"],
            correctAnswer: 1,
            explanation: "Au comes from the Latin word 'aurum' meaning gold",
            difficulty: difficulty
          }
        ]
      },
      "English": {
        "Grammar": [
          {
            question: "Which word is a conjunction in the sentence: 'I like both tea and coffee'?",
            options: ["like", "both", "and", "coffee"],
            correctAnswer: 2,
            explanation: "'And' is a conjunction that connects two nouns",
            difficulty: difficulty
          }
        ],
        "Vocabulary": [
          {
            question: "What does 'ubiquitous' mean?",
            options: ["rare", "present everywhere", "expensive", "beautiful"],
            correctAnswer: 1,
            explanation: "Ubiquitous means present, appearing, or found everywhere",
            difficulty: difficulty
          }
        ]
      },
      "History": {
        "World History": [
          {
            question: "In which year did World War II end?",
            options: ["1943", "1944", "1945", "1946"],
            correctAnswer: 2,
            explanation: "World War II ended in 1945 with the surrender of Germany and Japan",
            difficulty: difficulty
          }
        ]
      },
      "Computer Science": {
        "Programming Basics": [
          {
            question: "What is the primary purpose of a loop in programming?",
            options: ["To store data", "To repeat code", "To define functions", "To handle errors"],
            correctAnswer: 1,
            explanation: "Loops are used to execute a block of code multiple times",
            difficulty: difficulty
          }
        ]
      }
    };

    const questions = fallbackQuestions[subject]?.[topic] || [];
    const availableCount = Math.min(questions.length, count);
    
    if (availableCount === 0) {
      // Generate generic questions if no specific fallback exists
      return {
        questions: [
          {
            question: `What is a key concept in ${topic}?`,
            options: ["Option A", "Option B", "Option C", "Option D"],
            correctAnswer: 0,
            explanation: "This is a fallback question. Please refer to your study materials.",
            difficulty: difficulty
          }
        ]
      };
    }

    return { questions: questions.slice(0, count) };
  }

  // Generate personalized study recommendations
  async generateRecommendations(studentProgress) {
    try {
      const prompt = `Based on this student's progress data, provide personalized study recommendations:
      
      Strengths: ${studentProgress.strengthAreas?.join(', ') || 'None identified'}
      Weak Areas: ${studentProgress.weakAreas?.join(', ') || 'None identified'}
      Current Difficulty: ${studentProgress.currentDifficulty || 'Beginner'}
      Average Score: ${studentProgress.averageScore || 0}%
      
      Provide 3-4 specific, actionable recommendations for:
      1. Topics to focus on
      2. Difficulty level adjustments
      3. Study strategies
      4. Practice suggestions
      
      Format as a clear, encouraging paragraph.`;

      const response = await axios.post(
        `${this.baseURL}/models/gemini-pro:generateContent?key=${this.apiKey}`,
        {
          contents: [
            {
              parts: [
                {
                  text: "You are an expert educational advisor. Provide personalized, actionable study recommendations in a clear, encouraging tone."
                }
              ]
            },
            {
              parts: [
                {
                  text: prompt
                }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.5,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1000,
          }
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.data.candidates || !response.data.candidates[0] || !response.data.candidates[0].content) {
        throw new Error('Invalid response format from Gemini API');
      }

      return response.data.candidates[0].content.parts[0].text;
    } catch (error) {
      console.error('AI Recommendation Error:', error.response ? error.response.data : error.message);
      return this.generateFallbackRecommendations(studentProgress);
    }
  }

  // Fallback recommendations
  generateFallbackRecommendations(studentProgress) {
    const recommendations = [];
    
    if (!studentProgress.averageScore || studentProgress.averageScore < 60) {
      recommendations.push("Focus on fundamental concepts and review basic topics");
      recommendations.push("Practice more questions at current difficulty level");
      recommendations.push("Consider seeking help from teachers or tutors");
    } else if (studentProgress.averageScore < 80) {
      recommendations.push("Move to intermediate difficulty questions");
      recommendations.push("Focus on weak areas identified in your practice");
      recommendations.push("Review concepts you find challenging");
    } else {
      recommendations.push("Challenge yourself with advanced questions");
      recommendations.push("Help other students to reinforce your knowledge");
      recommendations.push("Explore related topics to expand your understanding");
    }

    return recommendations.join('\n\n');
  }

  // Analyze question difficulty based on student performance
  calculateDifficultyScore(questionStats) {
    const { attempts, correctAttempts, averageTime } = questionStats;
    
    if (attempts === 0) return 0;
    
    const successRate = correctAttempts / attempts;
    const timeFactor = Math.min(averageTime / 60, 1); // Normalize time to 0-1
    
    // Difficulty score: 0 (easy) to 1 (hard)
    const difficultyScore = (1 - successRate) * 0.7 + (1 - timeFactor) * 0.3;
    
    return Math.round(difficultyScore * 100) / 100;
  }

  // Generate adaptive questions based on performance
  async generateAdaptiveQuestions(studentId, subject, topic, count = 5) {
    try {
      const difficulty = await this.determineOptimalDifficulty(studentId, subject, topic);
      return await this.generateQuestions(subject, topic, difficulty, count);
    } catch (error) {
      console.error('Adaptive Question Generation Error:', error.response ? error.response.data : error.message);
      return this.generateQuestions(subject, topic, 'Intermediate', count);
    }
  }

  // Determine optimal difficulty for a student
  async determineOptimalDifficulty(studentId, subject, topic) {
    // This would analyze the student's performance history
    // and return the appropriate difficulty level
    // For now, returning a default
    return 'Intermediate';
  }
}

module.exports = new AIService();