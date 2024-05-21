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



export const getShareQuestions = async (quizId, page, limit = 1) => {
  try {
    const response = await axios.get(`http://localhost:3000/api/v1/quiz/shareQuestion/${quizId}?page=${page}&limit=1`);
    console.log(response.data);
    return response.data;
   
  } catch (error) {
    console.error('Error fetching questions:', error);
    throw error;
  }
};