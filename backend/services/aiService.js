// const axios = require('axios');

// class AIService {
//   constructor() {
//     // Use the Gemini API key and base URL
//     this.apiKey = 'AIzaSyAbUaw6aKygcv913MVpXZ01zK-Vnd58Tvo';
//     // this.baseURL = 'https://generativelanguage.googleapis.com/v1beta';
//      this.baseURL = 'https://generativelanguage.googleapis.com/v1'; // CHANGED: v1
//   }

//   // Generate questions based on subject, topic, and difficulty
//   async generateQuestions(subject, topic, difficulty, count) {
//     try {
//       const prompt = `Generate ${count} ${difficulty} level questions for ${subject} - ${topic}. 
//       Each question should have:
//       - A clear question text
//       - 4 multiple choice options (only one correct)
//       - An explanation for the correct answer
//       - Appropriate difficulty for ${difficulty} level
      
//       Format as JSON:
//       {
//         "questions": [
//           {
//             "question": "question text",
//             "options": ["option1", "option2", "option3", "option4"],
//             "correctAnswer": 0,
//             "explanation": "explanation text",
//             "difficulty": "${difficulty}"
//           }
//         ]
//       }`;

//       const response = await axios.post(
//         `${this.baseURL}/models/gemini-2.5-flash:generateContent?key=${this.apiKey}`,
//         {
//           contents: [
//             {
//               parts: [
//                 {
//                   text: "You are an expert educational content creator. Generate high-quality, accurate questions in the exact JSON format requested. Do not include any additional text or explanations outside the JSON structure."
//                 }
//               ]
//             },
//             {
//               parts: [
//                 {
//                   text: prompt
//                 }
//               ]
//             }
//           ],
//           generationConfig: {
//             temperature: 0.7,
//             topK: 40,
//             topP: 0.95,
//             maxOutputTokens: 2000,
//           }
//         },
//         {
//           headers: {
//             'Content-Type': 'application/json'
//           }
//         }
//       );

//       console.log('Gemini Response:', response.data);

//       if (!response.data.candidates || !response.data.candidates[0] || !response.data.candidates[0].content) {
//         throw new Error('Invalid response format from Gemini API');
//       }

//       const content = response.data.candidates[0].content.parts[0].text;
      
//       // Try to extract JSON from the response
//       let jsonContent;
//       try {
//         // Look for JSON content in the response
//         const jsonMatch = content.match(/\{[\s\S]*\}/);
//         if (jsonMatch) {
//           jsonContent = JSON.parse(jsonMatch[0]);
//         } else {
//           jsonContent = JSON.parse(content);
//         }
//       } catch (parseError) {
//         console.error('Failed to parse JSON response:', parseError);
//         console.log('Raw content:', content);
//         // Fallback to template questions
//         return this.generateFallbackQuestions(subject, topic, difficulty, count);
//       }

//       // Validate the response structure
//       if (!jsonContent.questions || !Array.isArray(jsonContent.questions)) {
//         console.error('Invalid response structure from Gemini');
//         return this.generateFallbackQuestions(subject, topic, difficulty, count);
//       }

//       return jsonContent;
//     } catch (error) {
//       console.error('AI Question Generation Error:', error.response ? error.response.data : error.message);
//       // Fallback to template questions
//       return this.generateFallbackQuestions(subject, topic, difficulty, count);
//     }
//   }

//   // Fallback questions when AI service is unavailable
//   generateFallbackQuestions(subject, topic, difficulty, count) {
//     console.log(`Using fallback questions for ${subject} - ${topic}`);
    
//     const fallbackQuestions = {
//       "Mathematics": {
//         "Algebra": [
//           {
//             question: "What is the value of x in the equation 2x + 5 = 13?",
//             options: ["3", "4", "5", "6"],
//             correctAnswer: 1,
//             explanation: "Subtract 5 from both sides: 2x = 8, then divide by 2: x = 4",
//             difficulty: difficulty
//           },
//           {
//             question: "Solve for y: 3y - 7 = 8",
//             options: ["3", "5", "7", "9"],
//             correctAnswer: 1,
//             explanation: "Add 7 to both sides: 3y = 15, then divide by 3: y = 5",
//             difficulty: difficulty
//           }
//         ],
//         "Geometry": [
//           {
//             question: "What is the area of a circle with radius 5 units?",
//             options: ["25π", "50π", "75π", "100π"],
//             correctAnswer: 0,
//             explanation: "Area = πr² = π(5)² = 25π",
//             difficulty: difficulty
//           },
//           {
//             question: "What is the perimeter of a square with side length 6 units?",
//             options: ["12 units", "18 units", "24 units", "36 units"],
//             correctAnswer: 2,
//             explanation: "Perimeter = 4 × side length = 4 × 6 = 24 units",
//             difficulty: difficulty
//           }
//         ]
//       },
//       "Science": {
//         "Physics": [
//           {
//             question: "What is the SI unit of force?",
//             options: ["Joule", "Watt", "Newton", "Pascal"],
//             correctAnswer: 2,
//             explanation: "Force is measured in Newtons (N) in the SI system",
//             difficulty: difficulty
//           },
//           {
//             question: "What is the formula for kinetic energy?",
//             options: ["KE = mgh", "KE = ½mv²", "KE = mv", "KE = Fd"],
//             correctAnswer: 1,
//             explanation: "Kinetic energy = ½ × mass × velocity²",
//             difficulty: difficulty
//           }
//         ],
//         "Chemistry": [
//           {
//             question: "What is the chemical symbol for gold?",
//             options: ["Ag", "Au", "Fe", "Cu"],
//             correctAnswer: 1,
//             explanation: "Au comes from the Latin word 'aurum' meaning gold",
//             difficulty: difficulty
//           }
//         ]
//       },
//       "English": {
//         "Grammar": [
//           {
//             question: "Which word is a conjunction in the sentence: 'I like both tea and coffee'?",
//             options: ["like", "both", "and", "coffee"],
//             correctAnswer: 2,
//             explanation: "'And' is a conjunction that connects two nouns",
//             difficulty: difficulty
//           }
//         ],
//         "Vocabulary": [
//           {
//             question: "What does 'ubiquitous' mean?",
//             options: ["rare", "present everywhere", "expensive", "beautiful"],
//             correctAnswer: 1,
//             explanation: "Ubiquitous means present, appearing, or found everywhere",
//             difficulty: difficulty
//           }
//         ]
//       },
//       "History": {
//         "World History": [
//           {
//             question: "In which year did World War II end?",
//             options: ["1943", "1944", "1945", "1946"],
//             correctAnswer: 2,
//             explanation: "World War II ended in 1945 with the surrender of Germany and Japan",
//             difficulty: difficulty
//           }
//         ]
//       },
//       "Computer Science": {
//         "Programming Basics": [
//           {
//             question: "What is the primary purpose of a loop in programming?",
//             options: ["To store data", "To repeat code", "To define functions", "To handle errors"],
//             correctAnswer: 1,
//             explanation: "Loops are used to execute a block of code multiple times",
//             difficulty: difficulty
//           }
//         ]
//       }
//     };

//     const questions = fallbackQuestions[subject]?.[topic] || [];
//     const availableCount = Math.min(questions.length, count);
    
//     if (availableCount === 0) {
//       // Generate generic questions if no specific fallback exists
//       return {
//         questions: [
//           {
//             question: `What is a key concept in ${topic}?`,
//             options: ["Option A", "Option B", "Option C", "Option D"],
//             correctAnswer: 0,
//             explanation: "This is a fallback question. Please refer to your study materials.",
//             difficulty: difficulty
//           }
//         ]
//       };
//     }

//     return { questions: questions.slice(0, count) };
//   }

//   // Generate personalized study recommendations
//   async generateRecommendations(studentProgress) {
//     try {
//       const prompt = `Based on this student's progress data, provide personalized study recommendations:
      
//       Strengths: ${studentProgress.strengthAreas?.join(', ') || 'None identified'}
//       Weak Areas: ${studentProgress.weakAreas?.join(', ') || 'None identified'}
//       Current Difficulty: ${studentProgress.currentDifficulty || 'Beginner'}
//       Average Score: ${studentProgress.averageScore || 0}%
      
//       Provide 3-4 specific, actionable recommendations for:
//       1. Topics to focus on
//       2. Difficulty level adjustments
//       3. Study strategies
//       4. Practice suggestions
      
//       Format as a clear, encouraging paragraph.`;

//       const response = await axios.post(
//         `${this.baseURL}/models/gemini-2.5-flash:generateContent?key=${this.apiKey}`,
//         {
//           contents: [
//             {
//               parts: [
//                 {
//                   text: "You are an expert educational advisor. Provide personalized, actionable study recommendations in a clear, encouraging tone."
//                 }
//               ]
//             },
//             {
//               parts: [
//                 {
//                   text: prompt
//                 }
//               ]
//             }
//           ],
//           generationConfig: {
//             temperature: 0.5,
//             topK: 40,
//             topP: 0.95,
//             maxOutputTokens: 1000,
//           }
//         },
//         {
//           headers: {
//             'Content-Type': 'application/json'
//           }
//         }
//       );

//       if (!response.data.candidates || !response.data.candidates[0] || !response.data.candidates[0].content) {
//         throw new Error('Invalid response format from Gemini API');
//       }

//       return response.data.candidates[0].content.parts[0].text;
//     } catch (error) {
//       console.error('AI Recommendation Error:', error.response ? error.response.data : error.message);
//       return this.generateFallbackRecommendations(studentProgress);
//     }
//   }

//   // Fallback recommendations
//   generateFallbackRecommendations(studentProgress) {
//     const recommendations = [];
    
//     if (!studentProgress.averageScore || studentProgress.averageScore < 60) {
//       recommendations.push("Focus on fundamental concepts and review basic topics");
//       recommendations.push("Practice more questions at current difficulty level");
//       recommendations.push("Consider seeking help from teachers or tutors");
//     } else if (studentProgress.averageScore < 80) {
//       recommendations.push("Move to intermediate difficulty questions");
//       recommendations.push("Focus on weak areas identified in your practice");
//       recommendations.push("Review concepts you find challenging");
//     } else {
//       recommendations.push("Challenge yourself with advanced questions");
//       recommendations.push("Help other students to reinforce your knowledge");
//       recommendations.push("Explore related topics to expand your understanding");
//     }

//     return recommendations.join('\n\n');
//   }

//   // Analyze question difficulty based on student performance
//   calculateDifficultyScore(questionStats) {
//     const { attempts, correctAttempts, averageTime } = questionStats;
    
//     if (attempts === 0) return 0;
    
//     const successRate = correctAttempts / attempts;
//     const timeFactor = Math.min(averageTime / 60, 1); // Normalize time to 0-1
    
//     // Difficulty score: 0 (easy) to 1 (hard)
//     const difficultyScore = (1 - successRate) * 0.7 + (1 - timeFactor) * 0.3;
    
//     return Math.round(difficultyScore * 100) / 100;
//   }

//   // Generate adaptive questions based on performance
//   async generateAdaptiveQuestions(studentId, subject, topic, count = 5) {
//     try {
//       const difficulty = await this.determineOptimalDifficulty(studentId, subject, topic);
//       return await this.generateQuestions(subject, topic, difficulty, count);
//     } catch (error) {
//       console.error('Adaptive Question Generation Error:', error.response ? error.response.data : error.message);
//       return this.generateQuestions(subject, topic, 'Intermediate', count);
//     }
//   }

//   // Determine optimal difficulty for a student
//   async determineOptimalDifficulty(studentId, subject, topic) {
//     // This would analyze the student's performance history
//     // and return the appropriate difficulty level
//     // For now, returning a default
//     return 'Intermediate';
//   }
// }

// module.exports = new AIService();














































const axios = require('axios');

class AIService {
  constructor() {
    // GPT-4 API configuration
    this.apiKey = 'b252ccc4ecmshf24c55ba62b378fp1328f8jsndd37dc945aae';
    this.hostname = 'cheapest-gpt-4-turbo-gpt-4-vision-chatgpt-openai-ai-api.p.rapidapi.com';
    this.baseURL = `https://${this.hostname}/v1/chat/completions`;
  }

  // Generate questions based on subject, topic, and difficulty
  async generateQuestions(subject, topic, difficulty, count) {
    try {
      const prompt = this.createQuestionPrompt(subject, topic, difficulty, count);

      const response = await axios.post(
        this.baseURL,
        {
          messages: [
            {
              role: 'system',
              content: 'You are an expert educational content creator. Generate high-quality, accurate questions in the exact JSON format requested. Return ONLY valid JSON without any additional text, markdown, or explanations.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          model: 'gpt-4o',
          max_tokens: 2000,
          temperature: 0.7,
          response_format: { type: "json_object" }
        },
        {
          headers: {
            'x-rapidapi-key': this.apiKey,
            'x-rapidapi-host': this.hostname,
            'Content-Type': 'application/json'
          },
          timeout: 30000 // 30 seconds timeout
        }
      );

      console.log('GPT-4 Response received');

      if (!response.data.choices || !response.data.choices[0] || !response.data.choices[0].message) {
        throw new Error('Invalid response format from GPT-4 API');
      }

      const content = response.data.choices[0].message.content;
      const jsonContent = this.parseAIResponse(content);

      // Validate the response structure
      if (!jsonContent.questions || !Array.isArray(jsonContent.questions)) {
        console.error('Invalid response structure from GPT-4');
        throw new Error('Invalid response structure');
      }

      // Ensure we have the requested number of questions
      if (jsonContent.questions.length < count) {
        console.warn(`Requested ${count} questions but got ${jsonContent.questions.length}`);
      }

      return jsonContent;

    } catch (error) {
      console.error('GPT-4 Question Generation Error:', error.response ? error.response.data : error.message);
      // Fallback to template questions
      return this.generateFallbackQuestions(subject, topic, difficulty, count);
    }
  }

  // Create question generation prompt
  createQuestionPrompt(subject, topic, difficulty, count) {
    return `Generate exactly ${count} ${difficulty} level multiple choice questions for ${subject} on the topic of ${topic}.

CRITICAL INSTRUCTIONS:
- Return ONLY valid JSON format as specified below
- Do not include any additional text, explanations, or markdown
- Ensure the JSON is properly formatted and parseable

JSON FORMAT:
{
  "questions": [
    {
      "question": "Clear and concise question text here",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": 0,
      "explanation": "Clear explanation of why the correct answer is right",
      "difficulty": "${difficulty}"
    }
  ]
}

REQUIREMENTS:
1. Each question must have exactly 4 options
2. correctAnswer must be an integer (0-3) representing the index of the correct option
3. Questions should be appropriate for ${difficulty} level
4. Make questions educational and accurate
5. Cover different aspects of ${topic}
6. Ensure explanations are helpful and educational

Generate ${count} questions now:`;
  }

  // Parse AI response and extract JSON
  parseAIResponse(content) {
    try {
      // Clean the content - remove any markdown code blocks
      let cleanContent = content.replace(/```json\s*|\s*```/g, '').trim();
      
      // If the content starts with {, parse directly
      if (cleanContent.startsWith('{')) {
        return JSON.parse(cleanContent);
      }
      
      // Try to find JSON in the content
      const jsonMatch = cleanContent.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      
      throw new Error('No JSON found in response');
      
    } catch (parseError) {
      console.error('Failed to parse JSON response:', parseError);
      console.log('Raw content received:', content);
      throw new Error('Failed to parse AI response as JSON');
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
          },
          {
            question: "Factor the expression: x² - 9",
            options: ["(x-3)(x+3)", "(x-9)(x+1)", "(x-3)²", "(x+3)²"],
            correctAnswer: 0,
            explanation: "This is a difference of squares: x² - 9 = (x-3)(x+3)",
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
          },
          {
            question: "In a right triangle, if two sides are 3 and 4 units, what is the hypotenuse?",
            options: ["5 units", "6 units", "7 units", "8 units"],
            correctAnswer: 0,
            explanation: "Using Pythagorean theorem: 3² + 4² = 9 + 16 = 25, √25 = 5",
            difficulty: difficulty
          }
        ],
        "Calculus": [
          {
            question: "What is the derivative of x²?",
            options: ["x", "2x", "2", "x³/3"],
            correctAnswer: 1,
            explanation: "Using power rule: d/dx(x²) = 2x",
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
          },
          {
            question: "What is the acceleration due to gravity on Earth?",
            options: ["9.8 m/s²", "8.9 m/s²", "10 m/s²", "6.7 m/s²"],
            correctAnswer: 0,
            explanation: "Standard acceleration due to gravity is approximately 9.8 m/s²",
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
          },
          {
            question: "What is the atomic number of carbon?",
            options: ["6", "12", "14", "8"],
            correctAnswer: 0,
            explanation: "Carbon has 6 protons, so its atomic number is 6",
            difficulty: difficulty
          }
        ],
        "Biology": [
          {
            question: "What is the basic unit of life?",
            options: ["Atom", "Cell", "Molecule", "Organ"],
            correctAnswer: 1,
            explanation: "The cell is the basic structural and functional unit of all living organisms",
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
          },
          {
            question: "Identify the verb in: 'The cat sleeps peacefully'",
            options: ["cat", "sleeps", "peacefully", "the"],
            correctAnswer: 1,
            explanation: "'Sleeps' is the action verb in this sentence",
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
          },
          {
            question: "Who was the first President of the United States?",
            options: ["Thomas Jefferson", "George Washington", "John Adams", "Abraham Lincoln"],
            correctAnswer: 1,
            explanation: "George Washington served as the first U.S. President from 1789-1797",
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
          },
          {
            question: "Which data structure uses LIFO (Last-In-First-Out) principle?",
            options: ["Queue", "Stack", "Array", "Linked List"],
            correctAnswer: 1,
            explanation: "Stack uses LIFO principle where the last element added is the first one removed",
            difficulty: difficulty
          }
        ]
      }
    };

    const questions = fallbackQuestions[subject]?.[topic] || [];
    const availableCount = Math.min(questions.length, count);
    
    if (availableCount === 0) {
      // Generate generic questions if no specific fallback exists
      const genericQuestions = [];
      for (let i = 0; i < count; i++) {
        genericQuestions.push({
          question: `What is an important concept in ${topic} (${subject})?`,
          options: ["Concept A", "Concept B", "Concept C", "Concept D"],
          correctAnswer: 0,
          explanation: `This is a fallback question about ${topic}. Please refer to your ${subject} study materials for more information.`,
          difficulty: difficulty
        });
      }
      return { questions: genericQuestions };
    }

    return { questions: questions.slice(0, count) };
  }

  // Generate personalized study recommendations
  async generateRecommendations(studentProgress) {
    try {
      const prompt = this.createRecommendationPrompt(studentProgress);

      const response = await axios.post(
        this.baseURL,
        {
          messages: [
            {
              role: 'system',
              content: 'You are an expert educational advisor. Provide personalized, actionable study recommendations in a clear, encouraging tone. Be specific and practical.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          model: 'gpt-4o',
          max_tokens: 1000,
          temperature: 0.5
        },
        {
          headers: {
            'x-rapidapi-key': this.apiKey,
            'x-rapidapi-host': this.hostname,
            'Content-Type': 'application/json'
          },
          timeout: 15000
        }
      );

      if (!response.data.choices || !response.data.choices[0] || !response.data.choices[0].message) {
        throw new Error('Invalid response format from GPT-4 API');
      }

      return response.data.choices[0].message.content;

    } catch (error) {
      console.error('AI Recommendation Error:', error.response ? error.response.data : error.message);
      return this.generateFallbackRecommendations(studentProgress);
    }
  }

  // Create recommendation prompt
  createRecommendationPrompt(studentProgress) {
    return `Based on this student's progress data, provide personalized study recommendations:

Student Progress Summary:
- Strengths: ${studentProgress.strengthAreas?.join(', ') || 'None identified'}
- Weak Areas: ${studentProgress.weakAreas?.join(', ') || 'None identified'}
- Current Difficulty Level: ${studentProgress.currentDifficulty || 'Beginner'}
- Average Score: ${studentProgress.averageScore || 0}%
- Recent Topics: ${studentProgress.recentTopics?.join(', ') || 'Not specified'}

Please provide 3-4 specific, actionable recommendations focusing on:
1. Which topics to prioritize for improvement
2. Suggested difficulty level adjustments
3. Effective study strategies and techniques
4. Practice suggestions and resources

Format your response as a clear, encouraging paragraph with practical advice.`;
  }

  // Fallback recommendations
  generateFallbackRecommendations(studentProgress) {
    const recommendations = [];
    const avgScore = studentProgress.averageScore || 0;
    
    if (avgScore < 60) {
      recommendations.push("📚 **Foundation Building**: Focus on mastering fundamental concepts in your weaker areas. Review basic principles before attempting more complex problems.");
      recommendations.push("🎯 **Targeted Practice**: Spend more time on practice questions at your current difficulty level. Aim for consistency rather than speed.");
      recommendations.push("🔄 **Regular Review**: Create a study schedule that includes daily review sessions. Repetition will help reinforce key concepts.");
      recommendations.push("💡 **Seek Support**: Don't hesitate to ask teachers or peers for help on challenging topics. Collaborative learning can provide new perspectives.");
    } else if (avgScore < 80) {
      recommendations.push("🚀 **Progressive Challenge**: Gradually increase question difficulty to bridge the gap to advanced levels.");
      recommendations.push("📊 **Weakness Analysis**: Identify specific question types or topics where you lose marks and focus your practice there.");
      recommendations.push("⏱️ **Time Management**: Practice with timed sessions to improve your speed while maintaining accuracy.");
      recommendations.push("🔍 **Concept Depth**: Study beyond the basics - understand the 'why' behind concepts rather than just the 'how'.");
    } else {
      recommendations.push("🏆 **Advanced Topics**: Explore more complex concepts and real-world applications of what you're learning.");
      recommendations.push("🤝 **Peer Teaching**: Explain concepts to others - teaching is one of the best ways to deepen your own understanding.");
      recommendations.push("🌐 **Cross-disciplinary Connections**: Look for connections between different topics and subjects to build integrated knowledge.");
      recommendations.push("🎓 **Challenge Projects**: Take on complex problems or projects that require applying multiple concepts together.");
    }

    // Add specific topic recommendations if available
    if (studentProgress.weakAreas && studentProgress.weakAreas.length > 0) {
      recommendations.push(`\n**Priority Focus**: Based on your performance, pay special attention to: ${studentProgress.weakAreas.join(', ')}`);
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
      console.error('Adaptive Question Generation Error:', error);
      return this.generateQuestions(subject, topic, 'Intermediate', count);
    }
  }

  // Determine optimal difficulty for a student
  async determineOptimalDifficulty(studentId, subject, topic) {
    // This would typically analyze the student's performance history
    // For now, returning a default based on some logic
    // You can implement actual performance analysis here later
    
    // Mock implementation - in real scenario, you'd query the database
    const mockPerformance = {
      averageScore: 75, // This would come from actual data
      recentTopics: [topic]
    };

    if (mockPerformance.averageScore < 60) return 'Beginner';
    if (mockPerformance.averageScore < 80) return 'Intermediate';
    return 'Advanced';
  }

  // Validate question format (useful for testing)
  validateQuestionFormat(question) {
    const requiredFields = ['question', 'options', 'correctAnswer', 'explanation', 'difficulty'];
    const missingFields = requiredFields.filter(field => !(field in question));
    
    if (missingFields.length > 0) {
      throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
    }

    if (!Array.isArray(question.options) || question.options.length !== 4) {
      throw new Error('Question must have exactly 4 options');
    }

    if (typeof question.correctAnswer !== 'number' || question.correctAnswer < 0 || question.correctAnswer > 3) {
      throw new Error('correctAnswer must be a number between 0 and 3');
    }

    return true;
  }
}

module.exports = new AIService();