
import axios from 'axios'
//register the user


export async function registerUser({ name,email, password , confirmPassword}) {
    try {
        console.log(name, email, password);
      const response = await axios.post('https://quizze-se3g.onrender.com/api/v1/user/register', {
        name,
        email,
        password,
        confirmPassword
      });
  
    
     
      return response?.data; // return any response data if needed
    } catch (error) {
      
      return error?.response?.data?.errorMessage;
    }
  }
  
  //login api 

  
export async function loginUser({ email, password }) {
    try {
      const response = await axios.post('https://quizze-se3g.onrender.com/api/v1/user/login', {
        email,
        password
      });
      
      const jwttokenuser = response.data.token;
      console.log(jwttokenuser);
      const expirationTime = Date.now() + 19 * 24 * 60 * 60 * 1000; 
  
      localStorage.setItem("jwttokenuser", jwttokenuser);
      localStorage.setItem("tokenExpiration", expirationTime);
  
    
      setTimeout(() => {
        localStorage.removeItem("jwttokenuser");
        localStorage.removeItem("tokenExpiration");
      },  19 * 24 * 60 * 60 * 1000);
  
      return response.data; // return any response data if needed
    } catch (error) {
      
      return error.response.data.errorMessage;
    }
  }