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

//get question details

export const getDetailsQuestions = async (quizId) => {
  try {
    const response = await axios.get(`http://localhost:3000/api/v1/quiz/getquestion/${quizId}`);
    console.log(response.data);
    return response.data;
   
  } catch (error) {
    console.error('Error fetching questions:', error);
    throw error;
  }
};


export const questionRightWronchk = async (questionId, updatedData) => {
  try {
    const response = await axios.patch(`http://localhost:3000/api/v1/quiz/updatequestion/${questionId}`, updatedData);
    return response.data;
  } catch (error) {
    console.error('Error updating question:', error);
    throw error;
  }
};


export const empressionUpdates = async (questionId, updatedData) => {
  try {
    const response = await axios.patch(`http://localhost:3000/api/v1/quiz/updatequestion/${questionId}`, updatedData);
    return response.data;
  } catch (error) {
    console.error('Error updating question:', error);
    throw error;
  }
};

//quiz details

export const quizDetails = async () => {
  try {
    const token = localStorage.getItem("jwttokenuser");
    
  
    axios.defaults.headers.common["Authorization"] = token;
    const response = await axios.get(`http://localhost:3000/api/v1/quiz/dashboard`);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error('Error updating question:', error);
    throw error;
  }
};

//delete quiz 


export const deleteQuiz = async (quizId) => {
  try {
    const response = await axios.delete(`http://localhost:3000/api/v1/quiz/delete/${quizId}`);
    return response.data;
    
  } catch (error) {
   return error
    
  }
};