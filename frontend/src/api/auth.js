
import axios from 'axios'
//register the user


const BASE_URL = 'http://localhost:3000';
// http://localhost:3000

export async function registerUser({ name,email, password , confirmPassword, role, teacherId}) {
    try {
        console.log(name, email, password);
      const response = await axios.post(`${BASE_URL}/api/v1/user/register`, {
        name,
        email,
        password,
        confirmPassword,
        role,
        teacherId
      });
  
      
      
      return response?.data; // return any response data if needed
    } catch (error) {
      
      return error?.response?.data?.errorMessage;
    }
  }
  
  //login api 
  
  
export async function loginUser({ email, password }) {
    try {
      const response = await axios.post(`${BASE_URL}/api/v1/user/login`, {
        email,
        password
      });
      
      const jwttokenuser = response.data.token;
      console.log(jwttokenuser);
      const expirationTime = Date.now() + 19 * 24 * 60 * 60 * 1000; 
  
      localStorage.setItem("jwttokenuser", jwttokenuser);
      localStorage.setItem("tokenExpiration", expirationTime);
      if (response.data.role) localStorage.setItem('role', response.data.role);
      if (response.data.userId) localStorage.setItem('userId', response.data.userId);
  
      setTimeout(() => {
        localStorage.removeItem("jwttokenuser");
        localStorage.removeItem("tokenExpiration");
        localStorage.removeItem('role');
        localStorage.removeItem('userId');
      },  19 * 24 * 60 * 60 * 1000);
  
      return response.data; // return any response data if needed
    } catch (error) {
      
      return error.response.data.errorMessage;
    }
  }