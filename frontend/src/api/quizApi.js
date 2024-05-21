// src/api/quizApi.js
import axios from 'axios';

const API_URL = 'http://localhost:3000/api/v1/quiz/create'; 

export const createQuiz = async (quizData) => {
  try {
    const token = localStorage.getItem("jwttokenuser");
    
  
    axios.defaults.headers.common["Authorization"] = token;
    const response = await axios.post(API_URL, quizData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error('Error creating quiz:', error);
    throw error;
  }
};
