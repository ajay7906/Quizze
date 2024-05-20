
import axios from 'axios'
//register the user


export async function registerUser({ name,email, password , confirmPassword}) {
    try {
        console.log(name, email, password);
      const response = await axios.post('http://localhost:3000/api/v1/user/register', {
        name,
        email,
        password,
        confirmPassword
      });
  
    //   const token = response.data.token;
    //   const expirationTime = Date.now() + 60 * 60 * 1000 * 60; // 60 hours from now
  
    //   localStorage.setItem("token", token);
    //   localStorage.setItem("tokenExpiration", expirationTime);
  
    //   // Set a timeout to remove the token after 60 hours
    //   setTimeout(() => {
    //     localStorage.removeItem("token");
    //     localStorage.removeItem("tokenExpiration");
    //   }, 60 * 60 * 1000 * 60);
  
      return response.data; // return any response data if needed
    } catch (error) {
      return error?.response?.data?.errorMessage;
    }
  }
  
  //login api 

  
export async function loginUser({ email, password }) {
    try {
      const response = await axios.post('http://localhost:3000/api/v1/user/login', {
        email,
        password
      });
      
      const jwttokenuser = response.data.token;
      console.log(jwttokenuser);
      const expirationTime = Date.now() + 60 * 60 * 1000 * 60; 
  
      localStorage.setItem("jwttokenuser", jwttokenuser);
      localStorage.setItem("tokenExpiration", expirationTime);
  
    
      setTimeout(() => {
        localStorage.removeItem("jwttokenuser");
        localStorage.removeItem("tokenExpiration");
      }, 60 * 60 * 1000 * 60);
  
      return response.data; // return any response data if needed
    } catch (error) {
      return error.response.data.errorMessage;
    }
  }