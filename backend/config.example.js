// Example configuration file - rename to config.js and fill in your values
module.exports = {
  // Database Configuration
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/quizze_exam_platform',
  
  // JWT Configuration
  JWT_SECRET: process.env.JWT_SECRET || 'your_super_secret_jwt_key_here',
  
  // AI Service Configuration (OpenAI)
  OPENAI_API_KEY: process.env.OPENAI_API_KEY || 'your_openai_api_key_here',
  OPENAI_API_URL: process.env.OPENAI_API_URL || 'https://api.openai.com/v1',
  
  // Server Configuration
  PORT: process.env.PORT || 3000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  
  // CORS Configuration
  CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:5173',
  
  // Rate Limiting
  RATE_LIMIT_WINDOW_MS: process.env.RATE_LIMIT_WINDOW_MS || 900000,
  RATE_LIMIT_MAX_REQUESTS: process.env.RATE_LIMIT_MAX_REQUESTS || 100
};
