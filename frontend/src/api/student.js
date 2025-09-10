// src/api/studentApi.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api/v1/student';

// Set up axios defaults
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("jwttokenuser");
    if (token) {
      config.headers.Authorization = token;
    }
    config.headers['Content-Type'] = 'application/json';
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a new student
export const addStudent = async (studentData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/add`, studentData);
    return response.data;
  } catch (error) {
    console.error('Error adding student:', error);
    throw error;
  }
};

// Get all students for the current teacher
export const getStudents = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/all`);
    return response.data;
  } catch (error) {
    console.error('Error fetching students:', error);
    throw error;
  }
};

// Get a specific student by ID
export const getStudent = async (studentId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/${studentId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching student:', error);
    throw error;
  }
};

// Update a student
export const updateStudent = async (studentId, studentData) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/${studentId}`, studentData);
    return response.data;
  } catch (error) {
    console.error('Error updating student:', error);
    throw error;
  }
};

// Delete a student
export const deleteStudent = async (studentId) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/${studentId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting student:', error);
    throw error;
  }
};

// Get student performance analytics
export const getStudentPerformance = async (studentId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/${studentId}/performance`);
    return response.data;
  } catch (error) {
    console.error('Error fetching student performance:', error);
    throw error;
  }
};

// Get all students with pagination
export const getStudentsPaginated = async (page = 1, limit = 10) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/list?page=${page}&limit=${limit}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching paginated students:', error);
    throw error;
  }
};

// Search students by name or email
export const searchStudents = async (query) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/search?q=${encodeURIComponent(query)}`);
    return response.data;
  } catch (error) {
    console.error('Error searching students:', error);
    throw error;
  }
};

// Get students by class/group
export const getStudentsByClass = async (className) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/class/${encodeURIComponent(className)}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching students by class:', error);
    throw error;
  }
};

// Export students data
export const exportStudents = async (format = 'csv') => {
  try {
    const response = await axios.get(`${API_BASE_URL}/export?format=${format}`, {
      responseType: 'blob'
    });
    return response.data;
  } catch (error) {
    console.error('Error exporting students:', error);
    throw error;
  }
};

// Import students from file
export const importStudents = async (fileData) => {
  try {
    const formData = new FormData();
    formData.append('file', fileData);
    
    const response = await axios.post(`${API_BASE_URL}/import`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error importing students:', error);
    throw error;
  }
};

// Reset student password
export const resetStudentPassword = async (studentId) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/${studentId}/reset-password`);
    return response.data;
  } catch (error) {
    console.error('Error resetting student password:', error);
    throw error;
  }
};

// Send welcome email to student
export const sendWelcomeEmail = async (studentId) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/${studentId}/send-welcome`);
    return response.data;
  } catch (error) {
    console.error('Error sending welcome email:', error);
    throw error;
  }
};

// Get student statistics
export const getStudentStats = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/stats`);
    return response.data;
  } catch (error) {
    console.error('Error fetching student statistics:', error);
    throw error;
  }
};

// Bulk add students
export const bulkAddStudents = async (studentsData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/bulk-add`, studentsData);
    return response.data;
  } catch (error) {
    console.error('Error bulk adding students:', error);
    throw error;
  }
};

export default {
  addStudent,
  getStudents,
  getStudent,
  updateStudent,
  deleteStudent,
  getStudentPerformance,
  getStudentsPaginated,
  searchStudents,
  getStudentsByClass,
  exportStudents,
  importStudents,
  resetStudentPassword,
  sendWelcomeEmail,
  getStudentStats,
  bulkAddStudents
};